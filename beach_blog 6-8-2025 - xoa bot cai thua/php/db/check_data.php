<?php
require_once 'connect.php';

echo "Checking database data...\n";

try {
    $conn = connect();

    // Kiểm tra bảng beaches
    echo "\n=== BEACHES TABLE ===\n";
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM beaches");
    $stmt->execute();
    $beaches_count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    echo "Total beaches: " . $beaches_count . "\n";

    if ($beaches_count > 0) {
        $stmt = $conn->prepare("SELECT id, name, region_id, rank FROM beaches ORDER BY id LIMIT 10");
        $stmt->execute();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "- ID: " . $row['id'] . ", Name: " . $row['name'] . ", Region ID: " . $row['region_id'] . ", Rank: " . $row['rank'] . "\n";
        }
    }

    // Kiểm tra bảng regions
    echo "\n=== REGIONS TABLE ===\n";
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM regions");
    $stmt->execute();
    $regions_count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    echo "Total regions: " . $regions_count . "\n";

    if ($regions_count > 0) {
        $stmt = $conn->prepare("SELECT id, name, city, national FROM regions ORDER BY id LIMIT 10");
        $stmt->execute();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "- ID: " . $row['id'] . ", Name: " . $row['name'] . ", City: " . $row['city'] . ", Country: " . $row['national'] . "\n";
        }
    }

    // Kiểm tra bảng galleries
    echo "\n=== GALLERIES TABLE ===\n";
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM galleries");
    $stmt->execute();
    $galleries_count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    echo "Total galleries: " . $galleries_count . "\n";

    if ($galleries_count > 0) {
        $stmt = $conn->prepare("SELECT id, beach_id, image_url FROM galleries ORDER BY id LIMIT 5");
        $stmt->execute();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "- ID: " . $row['id'] . ", Beach ID: " . $row['beach_id'] . ", Image: " . $row['image_url'] . "\n";
        }
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
