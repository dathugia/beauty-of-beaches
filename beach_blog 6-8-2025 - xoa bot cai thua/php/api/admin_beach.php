<?php
// CORS headers - phải đặt trước mọi output
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
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
            ORDER BY b.id ASC
        ";
        
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $beaches = [];
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
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
        // Lấy danh sách regions (name) - loại bỏ timestamp
        $regions_query = "
            SELECT id, 
                CASE 
                    WHEN name LIKE '%_%' THEN SUBSTRING_INDEX(name, '_', 1)
                    ELSE name
                END as name
            FROM regions 
            ORDER BY name ASC
        ";
        $stmt = $conn->prepare($regions_query);
        $stmt->execute();
        $regions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Lấy danh sách countries (national)
        $countries_query = "SELECT DISTINCT national FROM regions WHERE national IS NOT NULL AND national != '' ORDER BY national ASC";
        $stmt = $conn->prepare($countries_query);
        $stmt->execute();
        $countries = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $countries[] = $row['national'];
        }
        
        // Lấy danh sách beach names
        $beaches_query = "SELECT id, name FROM beaches ORDER BY name ASC";
        $stmt = $conn->prepare($beaches_query);
        $stmt->execute();
        $beaches = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
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
        $conn->beginTransaction();
        
        // Tạo region mới với tên gốc (không có timestamp)
        $insert_region = $conn->prepare("
            INSERT INTO regions (name, description, city, national) 
            VALUES (?, ?, ?, ?)
        ");
        $region_desc = "Region for " . $name;
        $insert_region->execute([$region_name, $region_desc, $city, $country]);
        
        $final_region_id = $conn->lastInsertId();
        
        // Tạo beach
        $stmt = $conn->prepare("
            INSERT INTO beaches (name, region_id, description, rank) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$name, $final_region_id, $description, $rank]);
        
        $beach_id = $conn->lastInsertId();
        
        // Nếu có image URL, thêm vào bảng galleries
        if (!empty($image_url)) {
            $gallery_stmt = $conn->prepare("
                INSERT INTO galleries (beach_id, image_url, caption) 
                VALUES (?, ?, ?)
            ");
            $caption = "Image for " . $name;
            $gallery_stmt->execute([$beach_id, $image_url, $caption]);
        }
        
        // Commit transaction
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Beach created successfully',
            'id' => $beach_id,
            'region_id' => $final_region_id,
            'region_name' => $region_name
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
        $conn->beginTransaction();
        
        $final_region_id = $region_id;
        
        // Nếu có nhập region_name mới, cập nhật region hiện tại thay vì tạo mới
        if (!empty($region_name) && $region_id > 0) {
            // Cập nhật region hiện tại
            $update_region = $conn->prepare("
                UPDATE regions 
                SET name = ?, city = ?, national = ? 
                WHERE id = ?
            ");
            $update_region->execute([$region_name, $city, $country, $region_id]);
        }
        
        // Cập nhật beach
        $stmt = $conn->prepare("
            UPDATE beaches 
            SET name = ?, description = ?, rank = ? 
            WHERE id = ?
        ");
        $stmt->execute([$name, $description, $rank, $id]);
        
        // Nếu có image URL, cập nhật hoặc thêm vào bảng galleries
        if (!empty($image_url)) {
            // Kiểm tra xem đã có gallery entry cho beach này chưa
            $check_gallery = $conn->prepare("SELECT id FROM galleries WHERE beach_id = ?");
            $check_gallery->execute([$id]);
            $gallery_row = $check_gallery->fetch(PDO::FETCH_ASSOC);
            
            if ($gallery_row) {
                // Cập nhật gallery entry hiện có
                $update_gallery = $conn->prepare("
                    UPDATE galleries 
                    SET image_url = ?, caption = ? 
                    WHERE id = ?
                ");
                $caption = "Image for " . $name;
                $update_gallery->execute([$image_url, $caption, $gallery_row['id']]);
            } else {
                // Tạo gallery entry mới
                $insert_gallery = $conn->prepare("
                    INSERT INTO galleries (beach_id, image_url, caption) 
                    VALUES (?, ?, ?)
                ");
                $caption = "Image for " . $name;
                $insert_gallery->execute([$id, $image_url, $caption]);
            }
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
    // Hỗ trợ cả 'id' và 'beach_id' để tương thích
    $id = intval($input['id'] ?? $input['beach_id'] ?? 0);
    
    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Valid ID is required']);
        return;
    }
    
    try {
        // Bắt đầu transaction để đảm bảo tính nhất quán
        $conn->beginTransaction();
        
        // Xóa dữ liệu từ bảng galleries trước (foreign key constraint)
        $delete_galleries = $conn->prepare("DELETE FROM galleries WHERE beach_id = ?");
        $delete_galleries->execute([$id]);
        
        // Xóa dữ liệu từ bảng beach_feedback
        $delete_feedback = $conn->prepare("DELETE FROM beach_feedback WHERE beach_id = ?");
        $delete_feedback->execute([$id]);
        
        // Xóa beach từ bảng beaches
        $delete_beach = $conn->prepare("DELETE FROM beaches WHERE id = ?");
        $result = $delete_beach->execute([$id]);
        
        if ($result) {
            // Commit transaction
            $conn->commit();
            echo json_encode([
                'success' => true,
                'message' => 'Beach and related data deleted successfully'
            ]);
        } else {
            // Rollback nếu xóa beach thất bại
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Error deleting beach']);
        }
        
    } catch (Exception $e) {
        // Rollback nếu có lỗi
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => 'Error deleting beach: ' . $e->getMessage()
        ]);
    }
}
?>
