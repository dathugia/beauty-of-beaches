<?php
// Script để thêm cột rank vào bảng beaches
require_once("connect.php");

try {
    // Kiểm tra xem cột rank đã tồn tại chưa
    $checkColumn = "SHOW COLUMNS FROM beaches LIKE 'rank'";
    $result = query($checkColumn);
    
    if ($result->num_rows == 0) {
        // Thêm cột rank nếu chưa tồn tại
        $sql = "ALTER TABLE beaches ADD COLUMN rank INT DEFAULT 0 AFTER id";
        if (query($sql)) {
            echo "Đã thêm cột rank vào bảng beaches thành công!\n";
            
            // Cập nhật rank cho các bãi biển hiện có (theo thứ tự ID)
            $updateRank = "UPDATE beaches SET rank = (SELECT @rank := @rank + 1) ORDER BY id";
            query("SET @rank = 0");
            if (query($updateRank)) {
                echo "Đã cập nhật rank cho các bãi biển hiện có!\n";
            }
        } else {
            echo "Lỗi khi thêm cột rank!\n";
        }
    } else {
        echo "Cột rank đã tồn tại trong bảng beaches!\n";
    }
    
} catch (Exception $e) {
    echo "Lỗi: " . $e->getMessage() . "\n";
}
?>
