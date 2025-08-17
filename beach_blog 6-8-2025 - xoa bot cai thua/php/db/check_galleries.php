<?php
require_once 'connect.php';

echo "Checking galleries table structure...\n";

try {
    $conn = connect();
    
    // Kiểm tra cấu trúc bảng galleries
    $check_table = "SHOW CREATE TABLE galleries";
    $result = $conn->query($check_table);
    $row = $result->fetch_assoc();
    
    echo "Current table structure:\n";
    echo $row['Create Table'] . "\n\n";
    
    // Kiểm tra xem có dữ liệu nào không
    $check_data = "SELECT COUNT(*) as count FROM galleries";
    $data_result = $conn->query($check_data);
    $data_row = $data_result->fetch_assoc();
    
    echo "Number of galleries: " . $data_row['count'] . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
