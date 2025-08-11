<?php
//COR headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");

require_once("./../db/connect.php");

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    $data = [
        "status" => false,
        "message" => "Invalid id"
    ];
    echo json_encode($data);
    exit;
}

$sql = "SELECT * FROM beaches WHERE id = $id";
$rs = query($sql);
$row = $rs->fetch_assoc();

if (!$row) {
    $data = [
        "status" => false,
        "message" => "Not found"
    ];
    echo json_encode($data);
    exit;
}

$data = [
    "status" => true,
    "message" => "Success",
    "data" => $row
];

echo json_encode($data);


