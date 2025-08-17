<?php
require_once 'connect.php';

// Tạo admin1 mới
$username = 'admin1';
$password = '123456'; // Password đơn giản
$email = 'admin1@beachblog.com';

// Hash password
$password_hash = password_hash($password, PASSWORD_DEFAULT);

$conn = connect();

// Xóa admin1 cũ nếu có
$delete_sql = "DELETE FROM admins WHERE username = 'admin1'";
$conn->query($delete_sql);

// Thêm admin1 mới
$insert_sql = "INSERT INTO admins (username, password_hash, email) VALUES (?, ?, ?)";
$stmt = $conn->prepare($insert_sql);
$stmt->bind_param("sss", $username, $password_hash, $email);

if ($stmt->execute()) {
    echo "Admin1 created successfully!\n";
    echo "Username: admin1\n";
    echo "Password: 123456\n";
    echo "Email: admin1@beachblog.com\n";
} else {
    echo "Error creating admin1: " . $stmt->error . "\n";
}

$stmt->close();
$conn->close();
?>
