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
$action = $input['action'] ?? '';

switch ($action) {
    case 'login':
        handleLogin($conn, $input);
        break;
    case 'logout':
        handleLogout($conn, $input);
        break;
    case 'verify':
        handleVerify($conn, $input);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function handleLogin($conn, $input) {
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Username and password are required']);
        return;
    }
    
    // Tìm admin trong database
    $stmt = $conn->prepare("SELECT id, username, password_hash, email FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        return;
    }
    
    // Verify password
    if (password_verify($password, $admin['password_hash'])) {
        // Tạo session token
        $session_token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+24 hours'));
        
        // Lưu session vào database
        $stmt = $conn->prepare("INSERT INTO admin_sessions (admin_id, session_token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$admin['id'], $session_token, $expires_at]);
        
        // Cập nhật last_login
        $stmt = $conn->prepare("UPDATE admins SET last_login = NOW() WHERE id = ?");
        $stmt->execute([$admin['id']]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'admin' => [
                'id' => $admin['id'],
                'username' => $admin['username'],
                'email' => $admin['email'],
                'session_token' => $session_token
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }
}

function handleLogout($conn, $input) {
    $session_token = $input['session_token'] ?? '';
    
    if (!empty($session_token)) {
        // Xóa session
        $stmt = $conn->prepare("DELETE FROM admin_sessions WHERE session_token = ?");
        $stmt->execute([$session_token]);
    }
    
    echo json_encode(['success' => true, 'message' => 'Logout successful']);
}

function handleVerify($conn, $input) {
    $session_token = $input['session_token'] ?? '';
    
    if (empty($session_token)) {
        echo json_encode(['success' => false, 'message' => 'No session token provided']);
        return;
    }
    
    // Kiểm tra session
    $stmt = $conn->prepare("
        SELECT a.id, a.username, a.email 
        FROM admins a 
        JOIN admin_sessions s ON a.id = s.admin_id 
        WHERE s.session_token = ? AND s.expires_at > NOW()
    ");
    $stmt->execute([$session_token]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo json_encode([
            'success' => true,
            'admin' => $admin
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired session']);
    }
}
?>
