<?php
require_once 'connect.php';

echo "Checking BACH LONG VY beach data...\n";

try {
    $conn = connect();
    
    // Tìm beach BACH LONG VY
    $find_beach = "SELECT * FROM beaches WHERE name LIKE '%BACH LONG VY%'";
    $result = $conn->query($find_beach);
    
    if ($result->num_rows > 0) {
        $beach = $result->fetch_assoc();
        echo "Found beach: " . $beach['name'] . " (ID: " . $beach['id'] . ")\n";
        echo "Current region_id: " . $beach['region_id'] . "\n";
        
        // Kiểm tra region hiện tại
        if ($beach['region_id'] > 0) {
            $check_region = "SELECT * FROM regions WHERE id = " . $beach['region_id'];
            $region_result = $conn->query($check_region);
            
            if ($region_result->num_rows > 0) {
                $region = $region_result->fetch_assoc();
                echo "Current region: " . $region['name'] . " (" . $region['city'] . ", " . $region['national'] . ")\n";
            } else {
                echo "Region ID " . $beach['region_id'] . " not found!\n";
            }
        } else {
            echo "Beach has no region_id!\n";
        }
        
        // Kiểm tra API response
        echo "\n=== API RESPONSE CHECK ===\n";
        $api_query = "
            SELECT b.*, 
                CASE 
                    WHEN r.name LIKE '%NORTH%' THEN 'NORTH'
                    WHEN r.name LIKE '%EAST%' THEN 'EAST'
                    WHEN r.name LIKE '%SOUTH%' THEN 'SOUTH'
                    WHEN r.name LIKE '%WEST%' THEN 'WEST'
                    ELSE r.name
                END as region_name,
                r.city as region_city,
                r.national as country,
                (SELECT g.image_url FROM galleries g WHERE g.beach_id = b.id LIMIT 1) as gallery_image_url
            FROM beaches b
            LEFT JOIN regions r ON b.region_id = r.id
            WHERE b.id = " . $beach['id'];
        
        $api_result = $conn->query($api_query);
        if ($api_result->num_rows > 0) {
            $api_row = $api_result->fetch_assoc();
            echo "API region_name: " . ($api_row['region_name'] ?? 'NULL') . "\n";
            echo "API region_city: " . ($api_row['region_city'] ?? 'NULL') . "\n";
            echo "API country: " . ($api_row['country'] ?? 'NULL') . "\n";
        }
        
    } else {
        echo "BACH LONG VY beach not found!\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
