<?php
require_once 'connect.php';

echo "Checking current data...\n";

try {
    $conn = connect();
    
    // Kiểm tra beaches gần đây
    echo "\n=== RECENT BEACHES ===\n";
    $beaches_query = "SELECT * FROM beaches ORDER BY id DESC LIMIT 5";
    $beaches_result = $conn->query($beaches_query);
    
    while ($row = $beaches_result->fetch_assoc()) {
        echo "Beach ID: " . $row['id'] . ", Name: " . $row['name'] . ", Region ID: " . $row['region_id'] . "\n";
    }
    
    // Kiểm tra regions gần đây
    echo "\n=== RECENT REGIONS ===\n";
    $regions_query = "SELECT * FROM regions ORDER BY id DESC LIMIT 5";
    $regions_result = $conn->query($regions_query);
    
    while ($row = $regions_result->fetch_assoc()) {
        echo "Region ID: " . $row['id'] . ", Name: " . $row['name'] . ", City: " . $row['city'] . ", Country: " . $row['national'] . "\n";
    }
    
    // Kiểm tra galleries gần đây
    echo "\n=== RECENT GALLERIES ===\n";
    $galleries_query = "SELECT * FROM galleries ORDER BY id DESC LIMIT 5";
    $galleries_result = $conn->query($galleries_query);
    
    while ($row = $galleries_result->fetch_assoc()) {
        echo "Gallery ID: " . $row['id'] . ", Beach ID: " . $row['beach_id'] . ", Image: " . $row['image_url'] . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
