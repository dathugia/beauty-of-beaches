<?php
require_once 'connect.php';

echo "Fixing beaches table...\n";

try {
    $conn = connect();
    
    // Kiểm tra cấu trúc bảng beaches
    $check_table = "SHOW CREATE TABLE beaches";
    $result = $conn->query($check_table);
    $row = $result->fetch_assoc();
    
    echo "Current table structure:\n";
    echo $row['Create Table'] . "\n\n";
    
    // Tạm thời disable foreign key checks
    $conn->query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Sửa cột id để có auto_increment
    $fix_id = "ALTER TABLE beaches MODIFY COLUMN id INT AUTO_INCREMENT";
    
    if ($conn->query($fix_id)) {
        echo "✓ Fixed beaches table - added AUTO_INCREMENT to id column\n";
    } else {
        echo "✗ Error fixing beaches table: " . $conn->error . "\n";
    }
    
    // Enable lại foreign key checks
    $conn->query("SET FOREIGN_KEY_CHECKS = 1");
    
    // Kiểm tra lại cấu trúc
    $result = $conn->query($check_table);
    $row = $result->fetch_assoc();
    
    echo "\nUpdated table structure:\n";
    echo $row['Create Table'] . "\n";
    
    echo "\nBeaches table fixed successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
