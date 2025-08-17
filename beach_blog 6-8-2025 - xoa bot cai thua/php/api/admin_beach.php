<?php
// CORS headers - phải đặt trước mọi output
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once '../db/connect.php';

$conn = connect();

// Lấy input từ request
$input = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? $input['action'] ?? '';

switch ($action) {
    case 'get_all':
        handleGetAllBeaches($conn);
        break;
    case 'get_regions':
        handleGetRegions($conn);
        break;
    case 'create':
        handleCreateBeach($conn, $input);
        break;
    case 'update':
        handleUpdateBeach($conn, $input);
        break;
    case 'delete':
        handleDeleteBeach($conn, $input);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function handleGetAllBeaches($conn) {
    try {
        // Sử dụng subquery để lấy image_url từ galleries mà không tạo duplicate rows
        $query = "
            SELECT b.*, 
                CASE 
                    WHEN r.name LIKE '%NORTH%' THEN 'NORTH'
                    WHEN r.name LIKE '%EAST%' THEN 'EAST'
                    WHEN r.name LIKE '%SOUTH%' THEN 'SOUTH'
                    WHEN r.name LIKE '%WEST%' THEN 'WEST'
                    WHEN r.name LIKE '%_%' THEN SUBSTRING_INDEX(r.name, '_', 1)
                    ELSE r.name
                END as region_name,
                r.city as region_city,
                r.national as country,
                (SELECT g.image_url FROM galleries g WHERE g.beach_id = b.id LIMIT 1) as gallery_image_url
            FROM beaches b
            LEFT JOIN regions r ON b.region_id = r.id
            ORDER BY b.rank ASC, b.name ASC
        ";
        
        $result = $conn->query($query);
        $beaches = [];
        
        while ($row = $result->fetch_assoc()) {
            // Làm sạch description - loại bỏ HTML tags
            $clean_description = strip_tags($row['description'] ?? '');
            
            $beaches[] = [
                'id' => $row['id'] ?? '',
                'name' => $row['name'] ?? '',
                'region_id' => $row['region_id'] ?? '',
                'region_name' => $row['region_name'] ?? '',
                'region_city' => $row['region_city'] ?? '',
                'description' => $clean_description,
                'image_url' => $row['gallery_image_url'] ?? $row['image_url'] ?? '',
                'country' => $row['country'] ?? '',
                'rank' => $row['rank'] ?? 0,
                'created_at' => $row['created_at'] ?? ''
            ];
        }
        
        echo json_encode([
            'success' => true,
            'beaches' => $beaches
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching beaches: ' . $e->getMessage()
        ]);
    }
}

function handleGetRegions($conn) {
    try {
        // Lấy danh sách regions (name)
        $regions_query = "SELECT id, name FROM regions ORDER BY name ASC";
        $regions_result = $conn->query($regions_query);
        $regions = [];
        
        while ($row = $regions_result->fetch_assoc()) {
            $regions[] = [
                'id' => $row['id'],
                'name' => $row['name']
            ];
        }
        
        // Lấy danh sách countries (national)
        $countries_query = "SELECT DISTINCT national FROM regions WHERE national IS NOT NULL AND national != '' ORDER BY national ASC";
        $countries_result = $conn->query($countries_query);
        $countries = [];
        
        while ($row = $countries_result->fetch_assoc()) {
            $countries[] = $row['national'];
        }
        
        // Lấy danh sách beach names
        $beaches_query = "SELECT id, name FROM beaches ORDER BY name ASC";
        $beaches_result = $conn->query($beaches_query);
        $beaches = [];
        
        while ($row = $beaches_result->fetch_assoc()) {
            $beaches[] = [
                'id' => $row['id'],
                'name' => $row['name']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'regions' => $regions,
            'countries' => $countries,
            'beaches' => $beaches
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching data: ' . $e->getMessage()
        ]);
    }
}

function handleCreateBeach($conn, $input) {
    $name = trim($input['name'] ?? '');
    $region_name = trim($input['region_name'] ?? ''); // Tên region mới
    $city = trim($input['city'] ?? ''); // City mới
    $country = trim($input['country'] ?? ''); // Country mới
    $description = trim($input['description'] ?? '');
    $image_url = trim($input['image_url'] ?? '');
    $rank = intval($input['rank'] ?? 0);
    
    if (empty($name)) {
        echo json_encode(['success' => false, 'message' => 'Beach name is required']);
        return;
    }
    
    if (empty($region_name)) {
        echo json_encode(['success' => false, 'message' => 'Region name is required']);
        return;
    }
    
    if (empty($city)) {
        echo json_encode(['success' => false, 'message' => 'City is required']);
        return;
    }
    
    if (empty($country)) {
        echo json_encode(['success' => false, 'message' => 'Country is required']);
        return;
    }
    
    try {
        // Bắt đầu transaction
        $conn->begin_transaction();
        
        // Luôn tạo region mới với tên unique
        $unique_region_name = $region_name . "_" . time(); // Thêm timestamp để đảm bảo unique
        $insert_region = $conn->prepare("
            INSERT INTO regions (name, description, city, national) 
            VALUES (?, ?, ?, ?)
        ");
        $region_desc = "Region for " . $name;
        $insert_region->bind_param("ssss", $unique_region_name, $region_desc, $city, $country);
        
        if ($insert_region->execute()) {
            $final_region_id = $conn->insert_id;
        } else {
            throw new Exception('Error creating region');
        }
        $insert_region->close();
        
        // Tạo beach
        $stmt = $conn->prepare("
            INSERT INTO beaches (name, region_id, description, rank) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->bind_param("sisi", $name, $final_region_id, $description, $rank);
        
        if (!$stmt->execute()) {
            throw new Exception('Error creating beach');
        }
        
        $beach_id = $conn->insert_id;
        $stmt->close();
        
        // Nếu có image URL, thêm vào bảng galleries
        if (!empty($image_url)) {
            $gallery_stmt = $conn->prepare("
                INSERT INTO galleries (beach_id, image_url, caption) 
                VALUES (?, ?, ?)
            ");
            $caption = "Image for " . $name;
            $gallery_stmt->bind_param("iss", $beach_id, $image_url, $caption);
            
            if (!$gallery_stmt->execute()) {
                throw new Exception('Error creating gallery entry');
            }
            $gallery_stmt->close();
        }
        
        // Commit transaction
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Beach created successfully',
            'id' => $beach_id,
            'region_id' => $final_region_id,
            'region_name' => $region_name // Trả về region name gốc
        ]);
        
    } catch (Exception $e) {
        // Rollback nếu có lỗi
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => 'Error creating beach: ' . $e->getMessage()
        ]);
    }
}

function handleUpdateBeach($conn, $input) {
    $id = intval($input['id'] ?? 0);
    $name = trim($input['name'] ?? '');
    $region_id = intval($input['region_id'] ?? 0);
    $region_name = trim($input['region_name'] ?? ''); // Tên region mới nếu nhập trực tiếp
    $city = trim($input['city'] ?? ''); // City mới nếu nhập trực tiếp
    $country = trim($input['country'] ?? ''); // Country mới nếu nhập trực tiếp
    $description = trim($input['description'] ?? '');
    $image_url = trim($input['image_url'] ?? '');
    $rank = intval($input['rank'] ?? 0);
    
    if ($id <= 0 || empty($name)) {
        echo json_encode(['success' => false, 'message' => 'ID and beach name are required']);
        return;
    }
    
    try {
        // Bắt đầu transaction
        $conn->begin_transaction();
        
        $final_region_id = $region_id;
        
        // Luôn tạo region mới nếu có nhập region_name
        if (!empty($region_name)) {
            // Tạo region mới với tên unique
            $unique_region_name = $region_name . "_" . time(); // Thêm timestamp để đảm bảo unique
            $insert_region = $conn->prepare("
                INSERT INTO regions (name, description, city, national) 
                VALUES (?, ?, ?, ?)
            ");
            $region_desc = "Region for " . $name;
            $insert_region->bind_param("ssss", $unique_region_name, $region_desc, $city, $country);
            
            if ($insert_region->execute()) {
                $final_region_id = $conn->insert_id;
            } else {
                throw new Exception('Error creating region');
            }
            $insert_region->close();
        }
        
        // Cập nhật beach
        $stmt = $conn->prepare("
            UPDATE beaches 
            SET name = ?, region_id = ?, description = ?, rank = ? 
            WHERE id = ?
        ");
        $stmt->bind_param("sisis", $name, $final_region_id, $description, $rank, $id);
        
        if (!$stmt->execute()) {
            throw new Exception('Error updating beach');
        }
        
        $stmt->close();
        
        // Nếu có image URL, cập nhật hoặc thêm vào bảng galleries
        if (!empty($image_url)) {
            // Kiểm tra xem đã có gallery entry cho beach này chưa
            $check_gallery = $conn->prepare("SELECT id FROM galleries WHERE beach_id = ?");
            $check_gallery->bind_param("i", $id);
            $check_gallery->execute();
            $gallery_result = $check_gallery->get_result();
            
            if ($gallery_result->num_rows > 0) {
                // Cập nhật gallery entry hiện có
                $gallery_row = $gallery_result->fetch_assoc();
                $update_gallery = $conn->prepare("
                    UPDATE galleries 
                    SET image_url = ?, caption = ? 
                    WHERE id = ?
                ");
                $caption = "Image for " . $name;
                $update_gallery->bind_param("ssi", $image_url, $caption, $gallery_row['id']);
                
                if (!$update_gallery->execute()) {
                    throw new Exception('Error updating gallery entry');
                }
                $update_gallery->close();
            } else {
                // Tạo gallery entry mới
                $insert_gallery = $conn->prepare("
                    INSERT INTO galleries (beach_id, image_url, caption) 
                    VALUES (?, ?, ?)
                ");
                $caption = "Image for " . $name;
                $insert_gallery->bind_param("iss", $id, $image_url, $caption);
                
                if (!$insert_gallery->execute()) {
                    throw new Exception('Error creating gallery entry');
                }
                $insert_gallery->close();
            }
            $check_gallery->close();
        }
        
        // Commit transaction
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Beach updated successfully',
            'region_id' => $final_region_id
        ]);
        
    } catch (Exception $e) {
        // Rollback nếu có lỗi
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => 'Error updating beach: ' . $e->getMessage()
        ]);
    }
}

function handleDeleteBeach($conn, $input) {
    $id = intval($input['id'] ?? 0);
    
    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Valid ID is required']);
        return;
    }
    
    try {
        $stmt = $conn->prepare("DELETE FROM beaches WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Beach deleted successfully'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error deleting beach']);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error deleting beach: ' . $e->getMessage()
        ]);
    }
}

$conn->close();
?>
