<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json; charset=utf-8');

require_once("./../db/connect.php");

try {
    $conn = connect();
    
    $beach_id = isset($_GET['beach_id']) ? intval($_GET['beach_id']) : 0;

    if ($beach_id <= 0) {
        $data = [
            "status" => false,
            "message" => "Invalid beach_id"
        ];
        echo json_encode($data);
        exit;
    }

    // Lấy feedback theo beach_id, giới hạn 3 feedback mới nhất
    $sql = "SELECT name, rating, message, created_at 
            FROM feedback 
            WHERE beach_id = ? 
            ORDER BY created_at DESC 
            LIMIT 3";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$beach_id]);
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
