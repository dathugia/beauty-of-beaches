<?php
require_once 'connect.php';

$conn = connect();

// Xóa các session đã hết hạn
$cleanup_sql = "DELETE FROM admin_sessions WHERE expires_at < NOW()";
$result = $conn->query($cleanup_sql);

if ($result) {
    $affected_rows = $conn->affected_rows;
    echo "Đã xóa $affected_rows session cũ đã hết hạn.\n";
} else {
    echo "Lỗi khi dọn dẹp sessions: " . $conn->error . "\n";
}

// Hiển thị số session còn lại
$count_sql = "SELECT COUNT(*) as total FROM admin_sessions";
$count_result = $conn->query($count_sql);
$count_data = $count_result->fetch_assoc();

echo "Số session còn lại: " . $count_data['total'] . "\n";

$conn->close();
?>
