<?php
// File sửa lỗi auto_increment cho bảng regions
require_once 'connect.php';

echo "Fixing regions table...\n";

try {
    $conn = connect();
    
    // Kiểm tra cấu trúc bảng regions
    $check_table = "SHOW CREATE TABLE regions";
    $result = $conn->query($check_table);
    $row = $result->fetch_assoc();
    
    echo "Current table structure:\n";
    echo $row['Create Table'] . "\n\n";
    
    // Tạm thời disable foreign key checks
    $conn->query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Sửa cột id để có auto_increment (không thêm PRIMARY KEY vì đã có)
    $fix_id = "ALTER TABLE regions MODIFY COLUMN id INT AUTO_INCREMENT";
    
    if ($conn->query($fix_id)) {
        echo "✓ Fixed regions table - added AUTO_INCREMENT to id column\n";
    } else {
        echo "✗ Error fixing regions table: " . $conn->error . "\n";
    }
    
    // Enable lại foreign key checks
    $conn->query("SET FOREIGN_KEY_CHECKS = 1");
    
    // Kiểm tra lại cấu trúc
    $result = $conn->query($check_table);
    $row = $result->fetch_assoc();
    
    echo "\nUpdated table structure:\n";
    echo $row['Create Table'] . "\n";
    
    echo "\nRegions table fixed successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
