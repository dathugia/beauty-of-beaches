<?php
require_once 'connect.php';

echo "Fixing Tra Co beach data...\n";

try {
    $conn = connect();
    
    // Tìm beach Tra Co
    $find_beach = "SELECT * FROM beaches WHERE name = 'Tra Co'";
    $result = $conn->query($find_beach);
    
    if ($result->num_rows > 0) {
        $beach = $result->fetch_assoc();
        echo "Found Tra Co beach with ID: " . $beach['id'] . "\n";
        
        // Cập nhật region cho Tra Co (NORTH region)
        $update_region = "UPDATE beaches SET region_id = 2 WHERE id = " . $beach['id'];
        if ($conn->query($update_region)) {
            echo "✓ Updated Tra Co region to NORTH (ID: 2)\n";
        }
        
        // Cập nhật region NORTH với thông tin đúng
        $update_north = "UPDATE regions SET 
            name = 'NORTH', 
            city = 'Quang Ninh', 
            national = 'VIET NAM' 
            WHERE id = 2";
        if ($conn->query($update_north)) {
            echo "✓ Updated NORTH region with correct data\n";
        }
        
        // Thêm image URL vào galleries
        $image_url = "https://www.asiakingtravel.com/images/thumbs/2025/01/18455/top-banner-tra-co_1900x700xcrop.webp";
        
        // Kiểm tra xem đã có gallery entry chưa
        $check_gallery = "SELECT * FROM galleries WHERE beach_id = " . $beach['id'];
        $gallery_result = $conn->query($check_gallery);
        
        if ($gallery_result->num_rows > 0) {
            // Cập nhật gallery hiện có
            $update_gallery = "UPDATE galleries SET 
                image_url = '$image_url', 
                caption = 'Image for Tra Co' 
                WHERE beach_id = " . $beach['id'];
            if ($conn->query($update_gallery)) {
                echo "✓ Updated gallery with correct image URL\n";
            }
        } else {
            // Tạo gallery entry mới
            $insert_gallery = "INSERT INTO galleries (beach_id, image_url, caption) 
                VALUES (" . $beach['id'] . ", '$image_url', 'Image for Tra Co')";
            if ($conn->query($insert_gallery)) {
                echo "✓ Created new gallery entry\n";
            }
        }
        
        // Cập nhật description
        $description = "<p>Tra Co Beach is located in Tra Co Ward, Mong Cai City, Quang Ninh Province. This location is about 9km from the city center and about 200km from Ha Long. This is one of the longest beaches in Vietnam with a length of up to 15km, smooth white sand, gentle waves all year round.</p>";
        $update_desc = "UPDATE beaches SET description = '" . $conn->real_escape_string($description) . "' WHERE id = " . $beach['id'];
        if ($conn->query($update_desc)) {
            echo "✓ Updated description\n";
        }
        
        echo "\nTra Co beach data fixed successfully!\n";
        
    } else {
        echo "Tra Co beach not found!\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
