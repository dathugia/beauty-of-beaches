<?php
require_once 'connect.php';

echo "Fixing beach ID 64 data...\n";

try {
    $conn = connect();
    
    // Kiểm tra beach ID 64
    $find_beach = "SELECT * FROM beaches WHERE id = 64";
    $result = $conn->query($find_beach);
    
    if ($result->num_rows > 0) {
        $beach = $result->fetch_assoc();
        echo "Found beach ID 64: " . $beach['name'] . "\n";
        echo "Current region_id: " . $beach['region_id'] . "\n";
        
        // Kiểm tra region ID 62
        $check_region = "SELECT * FROM regions WHERE id = 62";
        $region_result = $conn->query($check_region);
        
        if ($region_result->num_rows > 0) {
            $region = $region_result->fetch_assoc();
            echo "Found region ID 62: " . $region['name'] . " (" . $region['city'] . ", " . $region['national'] . ")\n";
            
            // Cập nhật beach ID 64 để sử dụng region ID 62
            $update_beach = "UPDATE beaches SET region_id = 62 WHERE id = 64";
            if ($conn->query($update_beach)) {
                echo "✓ Updated beach ID 64 to use region_id = 62\n";
            } else {
                echo "✗ Error updating beach\n";
            }
            
        } else {
            echo "Region ID 62 not found!\n";
        }
        
    } else {
        echo "Beach ID 64 not found!\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
