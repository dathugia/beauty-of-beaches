<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json; charset=utf-8');

require_once("./../db/connect.php");

try {
    $conn = connect();
    
    // Lấy tất cả ảnh từ bảng galleries
    $sql = "SELECT * FROM galleries ORDER BY uploaded_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $list = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [
        "status" => true,
        "message" => "Success",
        "data" => $list 
    ];

    echo json_encode($data);
    
} catch (Exception $e) {
    $data = [
        "status" => false,
        "message" => "Error: " . $e->getMessage(),
        "data" => []
    ];
    echo json_encode($data);
}
?>
