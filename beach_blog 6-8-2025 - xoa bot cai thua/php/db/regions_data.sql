-- Thêm dữ liệu mẫu cho bảng regions
-- Chạy file này trong phpMyAdmin hoặc MySQL console

-- Xóa dữ liệu cũ (nếu có)
DELETE FROM regions;

-- Thêm dữ liệu mẫu
INSERT INTO regions (name, description, city, national) VALUES
('North Region', 'Northern beaches of Vietnam', 'Hanoi', 'Vietnam'),
('Central Region', 'Central coastal beaches', 'Da Nang', 'Vietnam'),
('South Region', 'Southern beaches and islands', 'Ho Chi Minh City', 'Vietnam'),
('East Region', 'Eastern coastal areas', 'Nha Trang', 'Vietnam'),
('West Region', 'Western mountain areas', 'Sapa', 'Vietnam'),
('Thailand Beaches', 'Beautiful beaches of Thailand', 'Phuket', 'Thailand'),
('Philippines Islands', 'Tropical islands of Philippines', 'Manila', 'Philippines'),
('Indonesia Archipelago', 'Indonesian island beaches', 'Bali', 'Indonesia');

-- Kiểm tra dữ liệu đã thêm
SELECT * FROM regions ORDER BY name;
