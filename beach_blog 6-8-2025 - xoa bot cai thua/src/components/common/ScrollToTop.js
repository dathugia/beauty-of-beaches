import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Tự động scroll lên đầu trang khi chuyển route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Hàm kiểm tra vị trí scroll với useCallback để tối ưu performance
  const toggleVisibility = useCallback(() => {
    // Hiển thị nút khi scroll xuống hơn 300px
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  // Hàm scroll lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Effect để lắng nghe sự kiện scroll với debounce
  useEffect(() => {
    let timeoutId;

    // Hàm debounce để tránh gọi quá nhiều lần
    const debouncedToggleVisibility = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(toggleVisibility, 10);
    };

    // Thêm event listener cho scroll
    window.addEventListener('scroll', debouncedToggleVisibility, { passive: true });

    // Cleanup function để remove event listener
    return () => {
      window.removeEventListener('scroll', debouncedToggleVisibility);
      clearTimeout(timeoutId);
    };
  }, [toggleVisibility]);

  return (
    <>
      {/* Nút Back to Top */}
      {isVisible && (
        <button
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
        >
          {/* Icon mũi tên lên */}
          <i className="fas fa-chevron-up"></i>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
