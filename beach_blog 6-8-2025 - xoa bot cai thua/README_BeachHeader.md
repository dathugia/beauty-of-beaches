# BeachHeader Component

## Mô tả
BeachHeader là một component React được thiết kế để hiển thị header cho trang chi tiết bãi biển với thông tin đầy đủ và nút điều hướng sang các bãi biển khác.

## Tính năng

### 1. Hiển thị thông tin bãi biển
- **Tên bãi biển**: Hiển thị tên bãi biển hiện tại
- **Quốc gia**: Hiển thị tên quốc gia từ bảng regions
- **Rank**: Hiển thị thứ hạng của bãi biển (ví dụ: #1 IN THE WORLD)

### 2. Navigation buttons
- **Nút trái**: Điều hướng đến bãi biển trước đó
- **Nút phải**: Điều hướng đến bãi biển tiếp theo
- **Thông tin preview**: Hiển thị tên và rank của bãi biển kế tiếp

### 3. Background image
- Sử dụng ảnh từ trường `image_url` của bảng beaches
- Overlay gradient để text dễ đọc
- Responsive design cho mọi kích thước màn hình

## Cấu trúc Database

### Bảng `beaches`
```sql
CREATE TABLE beaches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rank INT DEFAULT 0,  -- Thứ hạng bãi biển
    name VARCHAR(255) NOT NULL,
    region_id INT NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    tips TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bảng `regions`
```sql
CREATE TABLE regions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    national VARCHAR(100),  -- Tên quốc gia
    direction ENUM('north', 'south', 'east', 'west')
);
```

## Cách sử dụng

### 1. Import component
```javascript
import BeachHeader from './BeachHeader';
```

### 2. Sử dụng trong BeachDetail
```javascript
<BeachHeader currentBeachId={id} beachData={beach} />
```

### 3. Props
- `currentBeachId`: ID của bãi biển hiện tại
- `beachData`: Object chứa thông tin bãi biển từ API

## API Endpoints

### 1. Lấy chi tiết bãi biển
```
GET /api/beach.php?id={beach_id}
```

Response:
```json
{
    "status": true,
    "message": "Success",
    "data": {
        "id": 1,
        "rank": 1,
        "name": "CALA GOLORITZE",
        "region_id": 1,
        "description": "...",
        "image_url": "...",
        "tips": "...",
        "region_name": "Sardinia",
        "city": "Baunei",
        "national": "ITALY"
    }
}
```

### 2. Lấy danh sách bãi biển
```
GET /api/beaches.php
```

Response:
```json
{
    "status": true,
    "message": "Success",
    "data": [
        {
            "id": 1,
            "rank": 1,
            "name": "CALA GOLORITZE",
            "national": "ITALY",
            "image_url": "..."
        }
    ]
}
```

## Styling

### CSS Classes chính
- `.beach-header-container`: Container chính
- `.beach-header-background`: Background với ảnh
- `.beach-header-card`: Card chứa thông tin chính
- `.beach-nav-button`: Nút điều hướng
- `.beach-nav-info`: Thông tin bãi biển kế tiếp

### Responsive Design
- **Desktop**: Hiển thị đầy đủ thông tin và navigation
- **Tablet**: Giảm kích thước, ẩn một số thông tin
- **Mobile**: Chỉ hiển thị nút navigation, ẩn thông tin preview

## Cập nhật Database

### Thêm cột rank
```bash
cd php/db
php add_rank_column.php
```

### Cập nhật rank cho bãi biển hiện có
```bash
cd php/db
php update_ranks.php
```

## Tính năng nâng cao

### 1. Loading state
- Hiển thị spinner khi đang tải dữ liệu
- Smooth transition khi chuyển đổi bãi biển

### 2. Error handling
- Xử lý lỗi khi không tìm thấy bãi biển
- Fallback cho ảnh không tồn tại

### 3. Accessibility
- Keyboard navigation
- Screen reader support
- ARIA labels cho buttons

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support (với webkit prefix)
- Mobile browsers: Responsive design

## Dependencies
- React Router DOM (useNavigate)
- Bootstrap CSS classes
- Font Awesome icons
