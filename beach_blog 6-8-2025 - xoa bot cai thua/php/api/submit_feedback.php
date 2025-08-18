<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once("./../db/connect.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "status" => false,
        "message" => "Only POST method is allowed"
    ]);
    exit;
}

// Tạo thư mục uploads nếu chưa có
$upload_dir = '../uploads/feedback/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

try {
    $conn = connect();
    
    // Lấy dữ liệu từ request (hỗ trợ cả JSON và FormData)
    $input = [];
    if ($_SERVER['CONTENT_TYPE'] && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
        $input = json_decode(file_get_contents('php://input'), true);
    } else {
        $input = $_POST;
    }
    
    // Validate dữ liệu
    $beach_id = isset($input['beach_id']) ? intval($input['beach_id']) : 0;
    $visitor_name = trim($input['visitor_name'] ?? '');
    $email = trim($input['email'] ?? '');
    $rating = isset($input['rating']) ? intval($input['rating']) : 0;
    $feedback_comment = trim($input['feedback_comment'] ?? '');
    $attachment_path = null;
    
    // Validation
    if ($beach_id <= 0) {
        echo json_encode([
            "status" => false,
            "message" => "Invalid beach ID"
        ]);
        exit;
    }
    
    if (empty($visitor_name) || strlen($visitor_name) > 100) {
        echo json_encode([
            "status" => false,
            "message" => "Visitor name is required and must be less than 100 characters"
        ]);
        exit;
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "status" => false,
            "message" => "Valid email is required"
        ]);
        exit;
    }
    
    if ($rating < 1 || $rating > 5) {
        echo json_encode([
            "status" => false,
            "message" => "Rating must be between 1 and 5"
        ]);
        exit;
    }
    
    if (empty($feedback_comment)) {
        echo json_encode([
            "status" => false,
            "message" => "Feedback comment is required"
        ]);
        exit;
    }
    
    // Kiểm tra xem beach có tồn tại không
    $check_beach = $conn->prepare("SELECT id FROM beaches WHERE id = ?");
    $check_beach->execute([$beach_id]);
    if ($check_beach->rowCount() == 0) {
        echo json_encode([
            "status" => false,
            "message" => "Beach not found"
        ]);
        exit;
    }
    
    // Xử lý upload file nếu có
    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['attachment'];
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        $max_size = 5 * 1024 * 1024; // 5MB
        
        // Kiểm tra loại file
        if (!in_array($file['type'], $allowed_types)) {
            echo json_encode([
                "status" => false,
                "message" => "Invalid file type. Only JPG, PNG, GIF, PDF are allowed"
            ]);
            exit;
        }
        
        // Kiểm tra kích thước file
        if ($file['size'] > $max_size) {
            echo json_encode([
                "status" => false,
                "message" => "File size too large. Maximum 5MB allowed"
            ]);
            exit;
        }
        
        // Tạo tên file unique
        $file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $unique_filename = uniqid() . '_' . time() . '.' . $file_extension;
        $file_path = $upload_dir . $unique_filename;
        
        // Upload file
        if (move_uploaded_file($file['tmp_name'], $file_path)) {
            $attachment_path = 'uploads/feedback/' . $unique_filename;
        } else {
            echo json_encode([
                "status" => false,
                "message" => "Error uploading file"
            ]);
            exit;
        }
    }
    
    // Insert feedback vào database
    $sql = "INSERT INTO beach_feedback (beach_id, visitor_name, email, rating, feedback_comment, attachment_path, is_approved) 
            VALUES (?, ?, ?, ?, ?, ?, NULL)";
    $stmt = $conn->prepare($sql);
    $result = $stmt->execute([$beach_id, $visitor_name, $email, $rating, $feedback_comment, $attachment_path]);
    
    if ($result) {
        echo json_encode([
            "status" => true,
            "message" => "Feedback submitted successfully! It will be reviewed by admin."
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Error submitting feedback"
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>
