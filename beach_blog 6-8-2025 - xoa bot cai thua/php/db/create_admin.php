<?php
require_once 'connect.php';

// Tạo admin mới với password rõ ràng
$username = 'admin';
$password = '123456'; // Password đơn giản hơn
$email = 'admin@beachblog.com';

// Hash password
$password_hash = password_hash($password, PASSWORD_DEFAULT);

$conn = connect();

// Xóa admin cũ nếu có
$delete_sql = "DELETE FROM admins WHERE username = 'admin'";
$conn->query($delete_sql);

// Thêm admin mới
$insert_sql = "INSERT INTO admins (username, password_hash, email) VALUES (?, ?, ?)";
$stmt = $conn->prepare($insert_sql);
$stmt->bind_param("sss", $username, $password_hash, $email);

if ($stmt->execute()) {
    echo "Admin created successfully!\n";
    echo "Username: admin\n";
    echo "Password: 123456\n";
    echo "Email: admin@beachblog.com\n";
} else {
    echo "Error creating admin: " . $stmt->error . "\n";
}

$stmt->close();
$conn->close();
?>
