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
        case 'get_feedbacks':
            handleGetFeedbacks($conn);
            break;
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
        
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $feedbacks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Transform data to match expected format
        $transformedFeedbacks = [];
        foreach ($feedbacks as $row) {
            $transformedFeedbacks[] = [
                'id' => $row['id'],
                'beach_id' => $row['beach_id'],
                'beach_name' => $row['beach_name'],
                'visitor_name' => $row['visitor_name'],
                'email' => $row['email'],
                'rating' => $row['rating'],
                'comment' => $row['feedback_comment'], // Note: using feedback_comment field
                'attachment_path' => $row['attachment_path'] ?? null,
                'is_approved' => $row['is_approved'] === null ? null : (bool)$row['is_approved'],
                'created_at' => $row['created_at']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'feedbacks' => $transformedFeedbacks
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
        $stmt = $conn->prepare("UPDATE beach_feedback SET is_approved = 1 WHERE id = ?");
        $stmt->execute([$feedback_id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Feedback approved successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error approving feedback']);
        }
        
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
        $stmt = $conn->prepare("UPDATE beach_feedback SET is_approved = 0 WHERE id = ?");
        $stmt->execute([$feedback_id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Feedback rejected successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error rejecting feedback']);
        }
        
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
        $stmt->execute([$feedback_id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Feedback deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error deleting feedback']);
        }
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error deleting feedback: ' . $e->getMessage()
        ]);
    }
}
?>
