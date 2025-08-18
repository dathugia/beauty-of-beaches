-- Script cập nhật database để hỗ trợ refresh token
USE bob;

-- Thêm cột refresh_token và refresh_expires_at vào bảng admin_sessions
ALTER TABLE admin_sessions 
ADD COLUMN refresh_token VARCHAR(64) UNIQUE NULL AFTER session_token,
ADD COLUMN refresh_expires_at TIMESTAMP NULL AFTER expires_at;

-- Cập nhật các session hiện tại (nếu có) với refresh token mặc định
UPDATE admin_sessions 
SET refresh_token = CONCAT('temp_refresh_', id),
    refresh_expires_at = DATE_ADD(expires_at, INTERVAL 23 DAY)
WHERE refresh_token IS NULL;

-- Đảm bảo refresh_token không null
ALTER TABLE admin_sessions 
MODIFY COLUMN refresh_token VARCHAR(64) NOT NULL,
MODIFY COLUMN refresh_expires_at TIMESTAMP NOT NULL;

-- Xóa các session cũ đã hết hạn
DELETE FROM admin_sessions WHERE expires_at < NOW();

-- Tạo index để tối ưu hiệu suất
CREATE INDEX idx_session_token ON admin_sessions(session_token);
CREATE INDEX idx_refresh_token ON admin_sessions(refresh_token);
CREATE INDEX idx_expires_at ON admin_sessions(expires_at);

-- Kiểm tra kết quả
SELECT 'Database updated successfully!' as message;
SELECT COUNT(*) as total_sessions FROM admin_sessions;
