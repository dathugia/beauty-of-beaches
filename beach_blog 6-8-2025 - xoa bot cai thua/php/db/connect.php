<?php
function connect() {
    $host = 'localhost';
    $dbname = 'bb'; // Tên database của bạn
    $username = 'root';
    $password = 'root'; // Password MAMP thường là 'root'
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch(PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}
?>


