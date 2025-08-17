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
        handleGetAllGalleries($conn);
        break;
    case 'get_beaches':
        handleGetBeaches($conn);
        break;
    case 'create':
        handleCreateGallery($conn, $input);
        break;
    case 'update':
        handleUpdateGallery($conn, $input);
        break;
    case 'delete':
        handleDeleteGallery($conn, $input);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function handleGetAllGalleries($conn) {
    try {
        // Lấy tất cả galleries với thông tin beach
        $query = "
            SELECT g.*, b.name as beach_name, b.rank as beach_rank
            FROM galleries g
            LEFT JOIN beaches b ON g.beach_id = b.id
            ORDER BY g.uploaded_at DESC, g.id DESC
        ";
        
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $galleries = [];
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $galleries[] = [
                'id' => $row['id'] ?? '',
                'beach_id' => $row['beach_id'] ?? '',
                'beach_name' => $row['beach_name'] ?? '',
                'beach_rank' => $row['beach_rank'] ?? 0,
                'image_url' => $row['image_url'] ?? '',
                'caption' => $row['caption'] ?? '',
                'uploaded_at' => $row['uploaded_at'] ?? ''
            ];
        }
        
        echo json_encode([
            'success' => true,
            'galleries' => $galleries
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching galleries: ' . $e->getMessage()
        ]);
    }
}

function handleGetBeaches($conn) {
    try {
        // Lấy danh sách beaches để chọn
        $beaches_query = "SELECT id, name, rank FROM beaches ORDER BY rank ASC, name ASC";
        $stmt = $conn->prepare($beaches_query);
        $stmt->execute();
        $beaches = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
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

function handleCreateGallery($conn, $input) {
    $beach_id = intval($input['beach_id'] ?? 0);
    $image_url = trim($input['image_url'] ?? '');
    $caption = trim($input['caption'] ?? '');
    
    if ($beach_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Beach ID is required']);
        return;
    }
    
    if (empty($image_url)) {
        echo json_encode(['success' => false, 'message' => 'Image URL is required']);
        return;
    }
    
    try {
        // Kiểm tra xem beach có tồn tại không
        $check_beach = $conn->prepare("SELECT id FROM beaches WHERE id = ?");
        $check_beach->execute([$beach_id]);
        if (!$check_beach->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Beach not found']);
            return;
        }
        
        // Tạo gallery entry mới
        $stmt = $conn->prepare("
            INSERT INTO galleries (beach_id, image_url, caption) 
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$beach_id, $image_url, $caption]);
        
        $gallery_id = $conn->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Gallery created successfully',
            'id' => $gallery_id
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error creating gallery: ' . $e->getMessage()
        ]);
    }
}

function handleUpdateGallery($conn, $input) {
    $id = intval($input['id'] ?? 0);
    $beach_id = intval($input['beach_id'] ?? 0);
    $image_url = trim($input['image_url'] ?? '');
    $caption = trim($input['caption'] ?? '');
    
    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Gallery ID is required']);
        return;
    }
    
    if ($beach_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Beach ID is required']);
        return;
    }
    
    if (empty($image_url)) {
        echo json_encode(['success' => false, 'message' => 'Image URL is required']);
        return;
    }
    
    try {
        // Kiểm tra xem gallery có tồn tại không
        $check_gallery = $conn->prepare("SELECT id FROM galleries WHERE id = ?");
        $check_gallery->execute([$id]);
        if (!$check_gallery->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Gallery not found']);
            return;
        }
        
        // Kiểm tra xem beach có tồn tại không
        $check_beach = $conn->prepare("SELECT id FROM beaches WHERE id = ?");
        $check_beach->execute([$beach_id]);
        if (!$check_beach->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Beach not found']);
            return;
        }
        
        // Cập nhật gallery
        $stmt = $conn->prepare("
            UPDATE galleries 
            SET beach_id = ?, image_url = ?, caption = ? 
            WHERE id = ?
        ");
        $stmt->execute([$beach_id, $image_url, $caption, $id]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Gallery updated successfully'
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error updating gallery: ' . $e->getMessage()
        ]);
    }
}

function handleDeleteGallery($conn, $input) {
    $id = intval($input['id'] ?? 0);
    
    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Valid ID is required']);
        return;
    }
    
    try {
        $stmt = $conn->prepare("DELETE FROM galleries WHERE id = ?");
        
        if ($stmt->execute([$id])) {
            echo json_encode([
                'success' => true,
                'message' => 'Gallery deleted successfully'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error deleting gallery']);
        }
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error deleting gallery: ' . $e->getMessage()
        ]);
    }
}
?>
