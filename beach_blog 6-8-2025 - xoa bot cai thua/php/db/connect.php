<?php
// Kết nối theo cấu trúc đơn giản bạn yêu cầu

function connect() {
    $host = 'localhost';
    $user = 'root';
    $password = 'root'; // Nếu MAMP Windows: có thể là '' (rỗng)
    $db_name = 'bob'; // Đổi đúng tên DB của bạn

    try {
        // Thử mysqli trước
        if (extension_loaded('mysqli')) {
            $conn = mysqli_connect($host, $user, $password, $db_name);
            if (!$conn || (property_exists($conn, 'connect_error') && $conn->connect_error)) {
                throw new Exception('MySQLi connection failed');
            }
            if (method_exists($conn, 'set_charset')) {
                $conn->set_charset('utf8mb4');
            }
            return $conn;
        } else {
            // Fallback to PDO
            $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8mb4";
            $conn = new PDO($dsn, $user, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        }
    } catch (Exception $e) {
        die('Connection failed: ' . $e->getMessage());
    }
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


