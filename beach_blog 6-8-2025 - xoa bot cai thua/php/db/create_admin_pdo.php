<?php
require_once 'connect.php';

echo "Creating admin user with PDO...\n";

try {
    $conn = connect();
    
    // Kiểm tra xem admin đã tồn tại chưa
    $check_stmt = $conn->prepare("SELECT id FROM admins WHERE username = ?");
    $check_stmt->execute(['admin']);
    
    if ($check_stmt->fetch()) {
        echo "Admin user 'admin' already exists!\n";
    } else {
        // Tạo admin mới
        $password_hash = password_hash('123456', PASSWORD_DEFAULT);
        
        $insert_stmt = $conn->prepare("
            INSERT INTO admins (username, email, password_hash, created_at) 
            VALUES (?, ?, ?, NOW())
        ");
        
        $insert_stmt->execute(['admin', 'admin@beautyofbeaches.com', $password_hash]);
        
        echo "Admin user 'admin' created successfully!\n";
        echo "Username: admin\n";
        echo "Password: 123456\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
