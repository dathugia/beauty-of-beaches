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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Lấy danh sách feedback
    handleGetFeedbacks($conn);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    switch ($action) {
        case 'approve':
            handleApproveFeedback($conn, $input);
            break;
        case 'reject':
            handleRejectFeedback($conn, $input);
            break;
        case 'delete':
            handleDeleteFeedback($conn, $input);
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
}

function handleGetFeedbacks($conn) {
    try {
        $query = "
            SELECT bf.*, b.name as beach_name 
            FROM beach_feedback bf 
            JOIN beaches b ON bf.beach_id = b.id 
            ORDER BY bf.created_at DESC
        ";
        
        $result = $conn->query($query);
        $feedbacks = [];
        
        while ($row = $result->fetch_assoc()) {
            $feedbacks[] = [
                'id' => $row['id'],
                'beach_id' => $row['beach_id'],
                'beach_name' => $row['beach_name'],
                'visitor_name' => $row['visitor_name'],
                'email' => $row['email'],
                'rating' => $row['rating'],
                'comment' => $row['comment'],
                'is_approved' => (bool)$row['is_approved'],
                'created_at' => $row['created_at']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'feedbacks' => $feedbacks
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching feedbacks: ' . $e->getMessage()
        ]);
    }
}

function handleApproveFeedback($conn, $input) {
    $feedback_id = $input['feedback_id'] ?? 0;
    
    if (!$feedback_id) {
        echo json_encode(['success' => false, 'message' => 'Feedback ID is required']);
        return;
    }
    
    try {
        $stmt = $conn->prepare("UPDATE beach_feedback SET is_approved = TRUE WHERE id = ?");
        $stmt->bind_param("i", $feedback_id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Feedback approved successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error approving feedback']);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error approving feedback: ' . $e->getMessage()
        ]);
    }
}

function handleRejectFeedback($conn, $input) {
    $feedback_id = $input['feedback_id'] ?? 0;
    
    if (!$feedback_id) {
        echo json_encode(['success' => false, 'message' => 'Feedback ID is required']);
        return;
    }
    
    try {
        $stmt = $conn->prepare("UPDATE beach_feedback SET is_approved = FALSE WHERE id = ?");
        $stmt->bind_param("i", $feedback_id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Feedback rejected successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error rejecting feedback']);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error rejecting feedback: ' . $e->getMessage()
        ]);
    }
}

function handleDeleteFeedback($conn, $input) {
    $feedback_id = $input['feedback_id'] ?? 0;
    
    if (!$feedback_id) {
        echo json_encode(['success' => false, 'message' => 'Feedback ID is required']);
        return;
    }
    
    try {
        $stmt = $conn->prepare("DELETE FROM beach_feedback WHERE id = ?");
        $stmt->bind_param("i", $feedback_id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Feedback deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error deleting feedback']);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error deleting feedback: ' . $e->getMessage()
        ]);
    }
}

$conn->close();
?>
