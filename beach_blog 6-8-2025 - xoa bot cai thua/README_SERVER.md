# Hướng dẫn khởi động server

## Vấn đề hiện tại
Admin không đăng nhập được vì **PHP server chưa chạy**!

## Cách khởi động server

### Phương pháp 1: Sử dụng Command Prompt/PowerShell
1. Mở Command Prompt hoặc PowerShell
2. Di chuyển đến thư mục gốc của project
3. Chạy lệnh:
```bash
cd php
php -S localhost:8000
```

### Phương pháp 2: Sử dụng file batch
1. Double-click file `start_server.bat` trong thư mục gốc
2. Hoặc chạy từ Command Prompt:
```bash
start_server.bat
```

### Phương pháp 3: Sử dụng script PHP
1. Mở Command Prompt
2. Chạy lệnh:
```bash
php php/start_server.php
```

## Kiểm tra server đã chạy
Sau khi khởi động server, truy cập:
- http://localhost:8000/api/admin_auth.php

Nếu thấy thông báo "Invalid action" thì server đã chạy thành công.

## Test đăng nhập
1. Khởi động server (theo hướng dẫn trên)
2. Mở React app (npm start)
3. Thử đăng nhập admin với:
   - Username: admin
   - Password: 123456

## Lưu ý
- Server phải chạy trên port 8000
- Document root phải là thư mục `php`
- Đảm bảo database MySQL đang chạy
- Đảm bảo database `beach_blog` tồn tại

## Troubleshooting
Nếu vẫn không đăng nhập được:
1. Kiểm tra server có chạy không: http://localhost:8000
2. Kiểm tra database: chạy `php php/db/check_db.php`
3. Kiểm tra API: chạy `php php/db/test_api.php`
