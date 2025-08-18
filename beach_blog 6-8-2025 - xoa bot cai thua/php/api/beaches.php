<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json; charset=utf-8');

require_once("./../db/connect.php");

try {
    $conn = connect();
    
    // Cập nhật SQL query để xử lý logic region/city tốt hơn
    $sql = "SELECT b.*, 
            r.name as region_name, 
            r.city, 
            r.national,
            CASE 
                WHEN r.name IS NOT NULL AND r.name != '' THEN r.name
                WHEN r.city IS NOT NULL AND r.city != '' THEN r.city
                ELSE NULL
            END as display_region
            FROM beaches b 
            LEFT JOIN regions r ON b.region_id = r.id 
            ORDER BY b.id ASC";
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


