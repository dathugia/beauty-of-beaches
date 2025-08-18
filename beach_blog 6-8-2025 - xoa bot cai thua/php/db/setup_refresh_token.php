<?php
// Script cập nhật database để hỗ trợ refresh token
require_once 'connect.php';

try {
    $conn = connect();
    
    echo "Đang cập nhật database...\n";
    
    // Thêm cột refresh_token và refresh_expires_at vào bảng admin_sessions
    $sql = "ALTER TABLE admin_sessions 
            ADD COLUMN refresh_token VARCHAR(64) UNIQUE NULL AFTER session_token,
            ADD COLUMN refresh_expires_at TIMESTAMP NULL AFTER expires_at";
    
    try {
        $conn->exec($sql);
        echo "✓ Đã thêm cột refresh_token và refresh_expires_at\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "✓ Cột đã tồn tại, bỏ qua\n";
        } else {
            throw $e;
        }
    }
    
    // Cập nhật các session hiện tại với refresh token mặc định
    $sql = "UPDATE admin_sessions 
            SET refresh_token = CONCAT('temp_refresh_', id),
                refresh_expires_at = DATE_ADD(expires_at, INTERVAL 23 DAY)
            WHERE refresh_token IS NULL";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    echo "✓ Đã cập nhật session hiện tại\n";
    
    // Đảm bảo refresh_token không null
    $sql = "ALTER TABLE admin_sessions 
            MODIFY COLUMN refresh_token VARCHAR(64) NOT NULL,
            MODIFY COLUMN refresh_expires_at TIMESTAMP NOT NULL";
    
    try {
        $conn->exec($sql);
        echo "✓ Đã cập nhật cấu trúc cột\n";
    } catch (PDOException $e) {
        echo "⚠ Lỗi cập nhật cấu trúc: " . $e->getMessage() . "\n";
    }
    
    // Xóa các session cũ đã hết hạn
    $sql = "DELETE FROM admin_sessions WHERE expires_at < NOW()";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    echo "✓ Đã xóa session hết hạn\n";
    
    // Tạo index để tối ưu hiệu suất
    $indexes = [
        "CREATE INDEX IF NOT EXISTS idx_session_token ON admin_sessions(session_token)",
        "CREATE INDEX IF NOT EXISTS idx_refresh_token ON admin_sessions(refresh_token)",
        "CREATE INDEX IF NOT EXISTS idx_expires_at ON admin_sessions(expires_at)"
    ];
    
    foreach ($indexes as $index) {
        try {
            $conn->exec($index);
        } catch (PDOException $e) {
            // Index có thể đã tồn tại
        }
    }
    echo "✓ Đã tạo index\n";
    
    // Kiểm tra kết quả
    $stmt = $conn->prepare("SELECT COUNT(*) as total_sessions FROM admin_sessions");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "\n✅ Cập nhật database thành công!\n";
    echo "📊 Tổng số session: " . $result['total_sessions'] . "\n";
    
} catch (PDOException $e) {
    echo "❌ Lỗi: " . $e->getMessage() . "\n";
}
?>
