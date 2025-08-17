<?php
require_once 'connect.php';

echo "Checking regions table structure...\n";

try {
    $conn = connect();
    
    // Kiểm tra cấu trúc bảng regions
    $check_table = "SHOW CREATE TABLE regions";
    $result = $conn->query($check_table);
    $row = $result->fetch_assoc();
    
    echo "Current table structure:\n";
    echo $row['Create Table'] . "\n\n";
    
    // Kiểm tra xem có dữ liệu nào không
    $check_data = "SELECT COUNT(*) as count FROM regions";
    $data_result = $conn->query($check_data);
    $data_row = $data_result->fetch_assoc();
    
    echo "Number of regions: " . $data_row['count'] . "\n";
    
    if ($data_row['count'] > 0) {
        echo "Sample regions:\n";
        $sample = "SELECT * FROM regions LIMIT 3";
        $sample_result = $conn->query($sample);
        while ($sample_row = $sample_result->fetch_assoc()) {
            echo "- ID: " . $sample_row['id'] . ", Name: " . $sample_row['name'] . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
