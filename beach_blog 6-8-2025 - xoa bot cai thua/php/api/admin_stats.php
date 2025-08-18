<?php
// CORS headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once '../db/connect.php';

$conn = connect();

try {
    // Get total beaches
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM beaches");
    $stmt->execute();
    $beaches_count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get total feedback
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM beach_feedback");
    $stmt->execute();
    $feedback_count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get pending feedback (is_approved IS NULL)
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM beach_feedback WHERE is_approved IS NULL");
    $stmt->execute();
    $pending_count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get total images
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM galleries");
    $stmt->execute();
    $images_count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get average rating
    $stmt = $conn->prepare("SELECT AVG(rating) as average FROM beach_feedback WHERE rating IS NOT NULL AND is_approved = 1");
    $stmt->execute();
    $avg_rating = $stmt->fetch(PDO::FETCH_ASSOC)['average'];
    $avg_rating = $avg_rating ? round($avg_rating, 1) : 0;

    // Get recent feedback
    $stmt = $conn->prepare("
        SELECT bf.*, b.name as beach_name 
        FROM beach_feedback bf 
        LEFT JOIN beaches b ON bf.beach_id = b.id 
        ORDER BY bf.created_at DESC 
        LIMIT 5
    ");
    $stmt->execute();
    $recent_feedback = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'stats' => [
            'total_beaches' => $beaches_count,
            'total_feedback' => $feedback_count,
            'pending_feedback' => $pending_count,
            'total_images' => $images_count,
            'avg_rating' => $avg_rating,
            'average_rating' => $avg_rating,
            'recent_feedback' => $recent_feedback
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching stats: ' . $e->getMessage()
    ]);
}
?>
