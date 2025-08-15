<?php
// Script để cập nhật rank cho các bãi biển
require_once("connect.php");

try {
    // Cập nhật rank cho các bãi biển hiện có (theo thứ tự ID)
    query("SET @rank = 0");
    $updateRank = "UPDATE beaches SET rank = (SELECT @rank := @rank + 1) ORDER BY id";
    
    if (query($updateRank)) {
        echo "Đã cập nhật rank cho các bãi biển thành công!\n";
        
        // Hiển thị danh sách bãi biển với rank
        $sql = "SELECT id, name, rank FROM beaches ORDER BY rank ASC";
        $result = query($sql);
        
        echo "\nDanh sách bãi biển với rank:\n";
        echo "ID\tRank\tName\n";
        echo "------------------------\n";
        
        while ($row = $result->fetch_assoc()) {
            echo $row['id'] . "\t" . $row['rank'] . "\t" . $row['name'] . "\n";
        }
    } else {
        echo "Lỗi khi cập nhật rank!\n";
    }
    
} catch (Exception $e) {
    echo "Lỗi: " . $e->getMessage() . "\n";
}
?>
