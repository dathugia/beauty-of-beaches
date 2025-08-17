<?php
require_once 'connect.php';

echo "Checking beach and gallery data...\n";

try {
    $conn = connect();
    
    // Kiểm tra dữ liệu beaches
    echo "\n=== BEACHES TABLE ===\n";
    $beaches_query = "SELECT * FROM beaches LIMIT 5";
    $beaches_result = $conn->query($beaches_query);
    
    while ($row = $beaches_result->fetch_assoc()) {
        echo "ID: " . $row['id'] . ", Name: " . $row['name'] . "\n";
        echo "Description: " . substr($row['description'], 0, 100) . "...\n";
        echo "---\n";
    }
    
    // Kiểm tra dữ liệu galleries
    echo "\n=== GALLERIES TABLE ===\n";
    $galleries_query = "SELECT * FROM galleries LIMIT 5";
    $galleries_result = $conn->query($galleries_query);
    
    while ($row = $galleries_result->fetch_assoc()) {
        echo "ID: " . $row['id'] . ", Beach ID: " . $row['beach_id'] . "\n";
        echo "Image URL: " . $row['image_url'] . "\n";
        echo "Caption: " . $row['caption'] . "\n";
        echo "---\n";
    }
    
    // Kiểm tra JOIN query
    echo "\n=== JOIN QUERY RESULT ===\n";
    $join_query = "
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
            g.image_url as gallery_image_url
        FROM beaches b
        LEFT JOIN regions r ON b.region_id = r.id
        LEFT JOIN galleries g ON b.id = g.beach_id
        ORDER BY b.rank ASC, b.name ASC
        LIMIT 3
    ";
    
    $join_result = $conn->query($join_query);
    
    while ($row = $join_result->fetch_assoc()) {
        echo "Beach ID: " . $row['id'] . ", Name: " . $row['name'] . "\n";
        echo "Description: " . substr($row['description'], 0, 50) . "...\n";
        echo "Gallery Image: " . $row['gallery_image_url'] . "\n";
        echo "---\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
