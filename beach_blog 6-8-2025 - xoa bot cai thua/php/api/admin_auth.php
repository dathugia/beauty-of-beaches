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
    case 'refresh':
        handleRefresh($conn, $input);
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
        // Tạo session token và refresh token
        $session_token = bin2hex(random_bytes(32));
        $refresh_token = bin2hex(random_bytes(32));
        
        // Tăng thời gian hết hạn lên 7 ngày thay vì 24 giờ
        $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
        $refresh_expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));
        
        // Xóa session cũ nếu có
        $stmt = $conn->prepare("DELETE FROM admin_sessions WHERE admin_id = ?");
        $stmt->execute([$admin['id']]);
        
        // Lưu session mới vào database
        $stmt = $conn->prepare("INSERT INTO admin_sessions (admin_id, session_token, refresh_token, expires_at, refresh_expires_at) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$admin['id'], $session_token, $refresh_token, $expires_at, $refresh_expires_at]);
        
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
                'session_token' => $session_token,
                'refresh_token' => $refresh_token,
                'expires_at' => $expires_at
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
        SELECT a.id, a.username, a.email, s.expires_at, s.refresh_token
        FROM admins a 
        JOIN admin_sessions s ON a.id = s.admin_id 
        WHERE s.session_token = ? AND s.expires_at > NOW()
    ");
    $stmt->execute([$session_token]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        // Tự động refresh token nếu gần hết hạn (còn 1 ngày)
        $expires = new DateTime($admin['expires_at']);
        $now = new DateTime();
        $diff = $expires->diff($now);
        
        if ($diff->days <= 1) {
            // Tạo token mới
            $new_session_token = bin2hex(random_bytes(32));
            $new_expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
            
            $stmt = $conn->prepare("UPDATE admin_sessions SET session_token = ?, expires_at = ? WHERE session_token = ?");
            $stmt->execute([$new_session_token, $new_expires_at, $session_token]);
            
            $admin['session_token'] = $new_session_token;
            $admin['expires_at'] = $new_expires_at;
        }
        
        echo json_encode([
            'success' => true,
            'admin' => [
                'id' => $admin['id'],
                'username' => $admin['username'],
                'email' => $admin['email'],
                'session_token' => $admin['session_token'],
                'expires_at' => $admin['expires_at']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired session']);
    }
}

function handleRefresh($conn, $input) {
    $refresh_token = $input['refresh_token'] ?? '';
    
    if (empty($refresh_token)) {
        echo json_encode(['success' => false, 'message' => 'No refresh token provided']);
        return;
    }
    
    // Kiểm tra refresh token
    $stmt = $conn->prepare("
        SELECT a.id, a.username, a.email, s.refresh_expires_at
        FROM admins a 
        JOIN admin_sessions s ON a.id = s.admin_id 
        WHERE s.refresh_token = ? AND s.refresh_expires_at > NOW()
    ");
    $stmt->execute([$refresh_token]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        // Tạo session token mới
        $new_session_token = bin2hex(random_bytes(32));
        $new_expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
        
        $stmt = $conn->prepare("UPDATE admin_sessions SET session_token = ?, expires_at = ? WHERE refresh_token = ?");
        $stmt->execute([$new_session_token, $new_expires_at, $refresh_token]);
        
        echo json_encode([
            'success' => true,
            'admin' => [
                'id' => $admin['id'],
                'username' => $admin['username'],
                'email' => $admin['email'],
                'session_token' => $new_session_token,
                'expires_at' => $new_expires_at
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired refresh token']);
    }
}
?>
