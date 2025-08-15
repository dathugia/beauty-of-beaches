# FeedbackSection Component

## Mô tả
Component này hiển thị section feedback với các đánh giá từ khách hàng và nút "Send Feedback" để chuyển hướng đến trang feedback.

## Tính năng chính

### 1. Hiển thị Feedback
- Hiển thị danh sách các feedback từ khách hàng
- Mỗi feedback bao gồm: tên, đánh giá sao, comment, ngày tháng
- Responsive design cho mobile và tablet

### 2. Nút Send Feedback
- **Vị trí**: Ở cuối section, căn giữa
- **Chức năng**: Chuyển hướng đến trang `/feedback` khi click
- **Loading State**: 
  - Hiển thị spinner khi đang chuyển hướng
  - Disable nút trong quá trình loading
  - Text thay đổi thành "Đang chuyển hướng..."
- **Styling**: 
  - Sử dụng Bootstrap classes (`btn btn-outline-primary`)
  - Có icon Font Awesome (`fa-comment-dots`)
  - Hiệu ứng hover với transform và shadow
  - Hiệu ứng ripple khi click
  - Animation cho icon
  - Loading state với opacity và cursor changes

### 3. Accessibility
- Có `aria-label` cho screen readers
- Có `title` attribute cho tooltip
- Icon được ẩn khỏi screen readers với `aria-hidden="true"`
- Disabled state được xử lý đúng cách

### 4. Error Handling
- Try-catch block cho navigation
- Console error logging
- Graceful fallback nếu có lỗi

## Cách sử dụng

```jsx
import FeedbackSection from './components/shared/FeedbackSection';

// Trong component
<FeedbackSection />
```

## State Management
- `isLoading`: Boolean state để quản lý loading state
- Sử dụng `useState` hook để quản lý state

## Routing
Nút "Send Feedback" sử dụng React Router để chuyển hướng:
- Import: `import { useNavigate } from 'react-router-dom'`
- Hook: `const navigate = useNavigate()`
- Chuyển hướng: `navigate('/feedback')`
- Async function với loading simulation

## Dependencies
- React Router DOM (cho navigation)
- Font Awesome (cho icon và spinner)
- Bootstrap (cho styling)

## File liên quan
- `FeedbackSection.js` - Component chính
- `FeedbackSection.css` - Styling
- `Feedback.js` - Trang feedback đích
- `App.js` - Routing configuration

## CSS Classes
- `.btn-outline-primary` - Styling chính cho nút
- `.btn-outline-primary.loading` - Loading state
- `.btn-outline-primary:disabled` - Disabled state
- `.fa-spinner` - Animation cho spinner
- `@keyframes spin` - Keyframe animation cho spinner
