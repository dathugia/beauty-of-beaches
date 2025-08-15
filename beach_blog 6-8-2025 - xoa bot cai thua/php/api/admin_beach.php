<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../db/connect.php';

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$conn = connect();

// Lấy input từ request
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    switch ($action) {
        case 'update':
            handleUpdateBeach($conn, $input);
            break;
        case 'delete':
            handleDeleteBeach($conn, $input);
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
}

function handleUpdateBeach($conn, $input) {
    $beach_id = $input['beach_id'] ?? 0;
    $name = $input['name'] ?? '';
    $national = $input['national'] ?? '';
    $region_name = $input['region_name'] ?? '';
    $description = $input['description'] ?? '';
    $image_url = $input['image_url'] ?? '';
    
    if (!$beach_id || !$name) {
        echo json_encode(['success' => false, 'message' => 'Beach ID and name are required']);
        return;
    }
    
    try {
        // Update beaches table
        $stmt = $conn->prepare("UPDATE beaches SET name = ?, description = ?, image_url = ? WHERE id = ?");
        $stmt->bind_param("sssi", $name, $description, $image_url, $beach_id);
        
        if ($stmt->execute()) {
            // Update regions table if national and region_name provided
            if ($national && $region_name) {
                $stmt2 = $conn->prepare("UPDATE regions SET national = ?, region_name = ? WHERE beach_id = ?");
                $stmt2->bind_param("ssi", $national, $region_name, $beach_id);
                $stmt2->execute();
                $stmt2->close();
            }
            
            echo json_encode(['success' => true, 'message' => 'Beach updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error updating beach']);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error updating beach: ' . $e->getMessage()
        ]);
    }
}

function handleDeleteBeach($conn, $input) {
    $beach_id = $input['beach_id'] ?? 0;
    
    if (!$beach_id) {
        echo json_encode(['success' => false, 'message' => 'Beach ID is required']);
        return;
    }
    
    try {
        // Start transaction
        $conn->begin_transaction();
        
        // Delete from regions table first (foreign key constraint)
        $stmt1 = $conn->prepare("DELETE FROM regions WHERE beach_id = ?");
        $stmt1->bind_param("i", $beach_id);
        $stmt1->execute();
        $stmt1->close();
        
        // Delete from beaches table
        $stmt2 = $conn->prepare("DELETE FROM beaches WHERE id = ?");
        $stmt2->bind_param("i", $beach_id);
        
        if ($stmt2->execute()) {
            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Beach deleted successfully']);
        } else {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Error deleting beach']);
        }
        
        $stmt2->close();
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => 'Error deleting beach: ' . $e->getMessage()
        ]);
    }
}

$conn->close();
?>
