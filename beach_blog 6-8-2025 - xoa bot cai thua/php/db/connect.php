<?php
// Kết nối theo cấu trúc đơn giản bạn yêu cầu
header('Content-Type: application/json; charset=utf-8');

function connect() {
    $host = 'localhost';
    $user = 'root';
    $password = 'root'; // Nếu MAMP Windows: có thể là '' (rỗng)
    $db_name = 'beach_blog'; // Đổi đúng tên DB của bạn

    $conn = mysqli_connect($host, $user, $password, $db_name);
    if (!$conn || (property_exists($conn, 'connect_error') && $conn->connect_error)) {
        die('Connection failed!');
    }
    if (method_exists($conn, 'set_charset')) {
        $conn->set_charset('utf8mb4');
    }
    return $conn;
}

function query($sql) {
    $conn = connect();
    return $conn->query($sql);
}

function insert($sql) {
    $conn = connect();
    $conn->query($sql);
    return $conn->insert_id;
}


