<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../db/connect.php';

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$conn = connect();

try {
    // Lấy thống kê tổng quan
    $stats = [];
    
    // 1. Tổng số bãi biển
    $beach_query = "SELECT COUNT(*) as total_beaches FROM beaches";
    $beach_result = $conn->query($beach_query);
    $stats['total_beaches'] = $beach_result->fetch_assoc()['total_beaches'];
    
    // 2. Feedback chờ duyệt
    $pending_feedback_query = "SELECT COUNT(*) as pending_feedback FROM beach_feedback WHERE is_approved = FALSE";
    $pending_result = $conn->query($pending_feedback_query);
    $stats['pending_feedback'] = $pending_result->fetch_assoc()['pending_feedback'];
    
    // 3. Tổng số hình ảnh (từ galleries)
    $images_query = "SELECT COUNT(*) as total_images FROM galleries";
    $images_result = $conn->query($images_query);
    $stats['total_images'] = $images_result->fetch_assoc()['total_images'];
    
    // 4. Feedback gần đây (5 feedback mới nhất)
    $recent_feedback_query = "
        SELECT bf.*, b.name as beach_name 
        FROM beach_feedback bf 
        JOIN beaches b ON bf.beach_id = b.id 
        WHERE bf.is_approved = TRUE 
        ORDER BY bf.created_at DESC 
        LIMIT 5
    ";
    $recent_result = $conn->query($recent_feedback_query);
    $recent_feedback = [];
    while ($row = $recent_result->fetch_assoc()) {
        $recent_feedback[] = [
            'beach_name' => $row['beach_name'],
            'visitor_name' => $row['visitor_name'],
            'rating' => $row['rating'],
            'comment' => $row['comment'],
            'created_at' => $row['created_at']
        ];
    }
    $stats['recent_feedback'] = $recent_feedback;
    
    // 5. Thống kê theo vùng
    $region_stats_query = "
        SELECT r.region_name, COUNT(b.id) as beach_count 
        FROM regions r 
        LEFT JOIN beaches b ON r.id = b.region_id 
        GROUP BY r.id, r.region_name
    ";
    $region_result = $conn->query($region_stats_query);
    $region_stats = [];
    while ($row = $region_result->fetch_assoc()) {
        $region_stats[] = [
            'region_name' => $row['region_name'],
            'beach_count' => $row['beach_count']
        ];
    }
    $stats['region_stats'] = $region_stats;
    
    // 6. Đánh giá trung bình
    $avg_rating_query = "SELECT AVG(rating) as avg_rating FROM beach_feedback WHERE is_approved = TRUE";
    $avg_result = $conn->query($avg_rating_query);
    $stats['avg_rating'] = round($avg_result->fetch_assoc()['avg_rating'], 1);
    
    echo json_encode([
        'success' => true,
        'stats' => $stats
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching statistics: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
