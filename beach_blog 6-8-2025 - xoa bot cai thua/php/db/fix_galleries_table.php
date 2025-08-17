<?php
require_once 'connect.php';

echo "Fixing galleries table...\n";

try {
    $conn = connect();
    
    // Kiểm tra cấu trúc bảng galleries
    $check_table = "SHOW CREATE TABLE galleries";
    $result = $conn->query($check_table);
    $row = $result->fetch_assoc();
    
    echo "Current table structure:\n";
    echo $row['Create Table'] . "\n\n";
    
    // Tạm thời disable foreign key checks
    $conn->query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Sửa cột id để có auto_increment
    $fix_id = "ALTER TABLE galleries MODIFY COLUMN id INT AUTO_INCREMENT";
    
    if ($conn->query($fix_id)) {
        echo "✓ Fixed galleries table - added AUTO_INCREMENT to id column\n";
    } else {
        echo "✗ Error fixing galleries table: " . $conn->error . "\n";
    }
    
    // Enable lại foreign key checks
    $conn->query("SET FOREIGN_KEY_CHECKS = 1");
    
    // Kiểm tra lại cấu trúc
    $result = $conn->query($check_table);
    $row = $result->fetch_assoc();
    
    echo "\nUpdated table structure:\n";
    echo $row['Create Table'] . "\n";
    
    echo "\nGalleries table fixed successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
