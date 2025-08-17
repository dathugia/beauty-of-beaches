-- Tạo database
CREATE DATABASE IF NOT EXISTS bob CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bob;

-- Tạo bảng admins
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tạo bảng admin_sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    session_token VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- Tạo bảng regions
CREATE TABLE IF NOT EXISTS regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    city VARCHAR(100),
    national VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng beaches
CREATE TABLE IF NOT EXISTS beaches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    region_id INT,
    location VARCHAR(200),
    rating DECIMAL(3,2) DEFAULT 0.00,
    rank INT DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE SET NULL
);

-- Tạo bảng feedback
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    beach_id INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (beach_id) REFERENCES beaches(id) ON DELETE CASCADE
);

-- Thêm dữ liệu mẫu cho regions
INSERT INTO regions (name, description, city, national) VALUES
('North Region', 'Northern beaches of Vietnam', 'Hanoi', 'Vietnam'),
('Central Region', 'Central coastal beaches', 'Da Nang', 'Vietnam'),
('South Region', 'Southern beaches and islands', 'Ho Chi Minh City', 'Vietnam'),
('East Region', 'Eastern coastal areas', 'Nha Trang', 'Vietnam'),
('West Region', 'Western mountain areas', 'Sapa', 'Vietnam'),
('Thailand Beaches', 'Beautiful beaches of Thailand', 'Phuket', 'Thailand'),
('Philippines Islands', 'Tropical islands of Philippines', 'Manila', 'Philippines'),
('Indonesia Archipelago', 'Indonesian island beaches', 'Bali', 'Indonesia');

-- Tạo admin mặc định
INSERT INTO admins (username, password_hash, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@beachblog.com')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- Kiểm tra dữ liệu
SELECT 'Database and tables created successfully!' as message;
SELECT COUNT(*) as admin_count FROM admins;
SELECT COUNT(*) as region_count FROM regions;
