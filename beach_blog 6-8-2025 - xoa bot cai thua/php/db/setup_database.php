<?php
// File setup database
require_once 'connect.php';

echo "Setting up database...\n";

try {
    $conn = connect();
    
    // Tạo bảng admins nếu chưa có
    $create_admins_table = "
    CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE
    )";
    
    if ($conn->query($create_admins_table)) {
        echo "✓ Admins table created/verified\n";
    } else {
        echo "✗ Error creating admins table: " . $conn->error . "\n";
    }
    
    // Tạo bảng admin_sessions nếu chưa có
    $create_sessions_table = "
    CREATE TABLE IF NOT EXISTS admin_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL,
        session_token VARCHAR(64) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    )";
    
    if ($conn->query($create_sessions_table)) {
        echo "✓ Admin sessions table created/verified\n";
    } else {
        echo "✗ Error creating sessions table: " . $conn->error . "\n";
    }
    
    // Tạo bảng regions nếu chưa có
    $create_regions_table = "
    CREATE TABLE IF NOT EXISTS regions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        city VARCHAR(100),
        national VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if ($conn->query($create_regions_table)) {
        echo "✓ Regions table created/verified\n";
    } else {
        echo "✗ Error creating regions table: " . $conn->error . "\n";
    }
    
    // Tạo bảng beaches nếu chưa có
    $create_beaches_table = "
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
    )";
    
    if ($conn->query($create_beaches_table)) {
        echo "✓ Beaches table created/verified\n";
    } else {
        echo "✗ Error creating beaches table: " . $conn->error . "\n";
    }
    
    // Tạo bảng feedback nếu chưa có
    $create_feedback_table = "
    CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        beach_id INT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (beach_id) REFERENCES beaches(id) ON DELETE CASCADE
    )";
    
    if ($conn->query($create_feedback_table)) {
        echo "✓ Feedback table created/verified\n";
    } else {
        echo "✗ Error creating feedback table: " . $conn->error . "\n";
    }
    
    // Thêm dữ liệu mẫu cho regions
    $check_regions = "SELECT COUNT(*) as count FROM regions";
    $result = $conn->query($check_regions);
    $row = $result->fetch_assoc();
    
    if ($row['count'] == 0) {
        $insert_regions = "
        INSERT INTO regions (name, description, city, national) VALUES
        ('North Region', 'Northern beaches of Vietnam', 'Hanoi', 'Vietnam'),
        ('Central Region', 'Central coastal beaches', 'Da Nang', 'Vietnam'),
        ('South Region', 'Southern beaches and islands', 'Ho Chi Minh City', 'Vietnam'),
        ('East Region', 'Eastern coastal areas', 'Nha Trang', 'Vietnam'),
        ('West Region', 'Western mountain areas', 'Sapa', 'Vietnam'),
        ('Thailand Beaches', 'Beautiful beaches of Thailand', 'Phuket', 'Thailand'),
        ('Philippines Islands', 'Tropical islands of Philippines', 'Manila', 'Philippines'),
        ('Indonesia Archipelago', 'Indonesian island beaches', 'Bali', 'Indonesia')
        ";
        
        if ($conn->query($insert_regions)) {
            echo "✓ Sample regions data inserted\n";
        } else {
            echo "✗ Error inserting regions data: " . $conn->error . "\n";
        }
    } else {
        echo "✓ Regions data already exists\n";
    }
    
    // Tạo admin mặc định
    $username = 'admin';
    $password = '123456';
    $email = 'admin@beachblog.com';
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Kiểm tra xem admin đã tồn tại chưa
    $check_admin = "SELECT id FROM admins WHERE username = ?";
    $stmt = $conn->prepare($check_admin);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 0) {
        // Tạo admin mới
        $insert_admin = "INSERT INTO admins (username, password_hash, email) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($insert_admin);
        $stmt->bind_param("sss", $username, $password_hash, $email);
        
        if ($stmt->execute()) {
            echo "✓ Admin created successfully\n";
            echo "  Username: admin\n";
            echo "  Password: 123456\n";
            echo "  Email: admin@beachblog.com\n";
        } else {
            echo "✗ Error creating admin: " . $stmt->error . "\n";
        }
    } else {
        // Cập nhật password của admin hiện tại
        $update_admin = "UPDATE admins SET password_hash = ? WHERE username = ?";
        $stmt = $conn->prepare($update_admin);
        $stmt->bind_param("ss", $password_hash, $username);
        
        if ($stmt->execute()) {
            echo "✓ Admin password updated\n";
            echo "  Username: admin\n";
            echo "  Password: 123456\n";
        } else {
            echo "✗ Error updating admin: " . $stmt->error . "\n";
        }
    }
    
    echo "\nDatabase setup completed successfully!\n";
    echo "You can now login with:\n";
    echo "Username: admin\n";
    echo "Password: 123456\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
