<?php
require_once 'connect.php';

echo "Cleaning beach data...\n";

try {
    $conn = connect();
    
    // Lấy tất cả beaches có description chứa HTML
    $query = "SELECT id, name, description FROM beaches WHERE description LIKE '%<%' OR description LIKE '%>%'";
    $result = $conn->query($query);
    
    echo "Found " . $result->num_rows . " beaches with HTML in description\n";
    
    while ($row = $result->fetch_assoc()) {
        $clean_description = strip_tags($row['description']);
        
        // Cập nhật description đã làm sạch
        $update_query = "UPDATE beaches SET description = ? WHERE id = ?";
        $stmt = $conn->prepare($update_query);
        $stmt->bind_param("si", $clean_description, $row['id']);
        
        if ($stmt->execute()) {
            echo "✓ Cleaned beach ID " . $row['id'] . " (" . $row['name'] . ")\n";
        } else {
            echo "✗ Error cleaning beach ID " . $row['id'] . "\n";
        }
        
        $stmt->close();
    }
    
    echo "\nBeach data cleaning completed!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
