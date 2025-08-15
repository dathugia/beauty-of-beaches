<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");

require_once("./../db/connect.php");

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
        WHERE beach_id = $beach_id 
        ORDER BY created_at DESC 
        LIMIT 3";
$rs = query($sql);
$list = [];
while ($row = $rs->fetch_assoc()) {
    $list[] = $row;
}

$data = [
    "status" => true,
    "message" => "Success",
    "data" => $list 
];

echo json_encode($data);
?>
