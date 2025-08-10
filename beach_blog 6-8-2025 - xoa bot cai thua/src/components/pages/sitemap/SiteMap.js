import React from 'react';
import { Link } from 'react-router-dom';
import './SiteMap.css';

const SiteMap = () => {
  const siteStructure = {
    main: [
      { name: 'Trang Chủ', path: '/', description: 'Trang chủ với thông tin tổng quan' },
      { name: 'Về Chúng Tôi', path: '/about', description: 'Thông tin về đội ngũ và tổ chức' },
      { name: 'Liên Hệ', path: '/contact', description: 'Thông tin liên hệ và form gửi tin nhắn' },
      { name: 'Phản Hồi', path: '/feedback', description: 'Gửi phản hồi và đánh giá' }
    ],
    beaches: [
      { name: 'Top 50 Bãi Biển', path: '/top50', description: 'Danh sách 50 bãi biển đẹp nhất thế giới' },
      { name: 'Thư Viện Ảnh', path: '/gallery', description: 'Bộ sưu tập hình ảnh bãi biển đẹp' }
    ],
    regions: [
      { name: 'Miền Bắc', path: '/regions/north', description: 'Khám phá bãi biển miền Bắc' },
      { name: 'Miền Nam', path: '/regions/south', description: 'Khám phá bãi biển miền Nam' },
      { name: 'Miền Đông', path: '/regions/east', description: 'Khám phá bãi biển miền Đông' },
      { name: 'Miền Tây', path: '/regions/west', description: 'Khám phá bãi biển miền Tây' }
    ],
    services: [
      { name: 'Tư Vấn Du Lịch', path: '/services/travel-consultation', description: 'Dịch vụ tư vấn du lịch biển' },
      { name: 'Đặt Tour', path: '/services/book-tour', description: 'Đặt tour du lịch biển' },
      { name: 'Thuê Phòng', path: '/services/hotel-booking', description: 'Đặt phòng khách sạn gần biển' }
    ],
    resources: [
      { name: 'Hướng Dẫn Du Lịch', path: '/resources/travel-guide', description: 'Hướng dẫn du lịch biển an toàn' },
      { name: 'Thời Tiết', path: '/resources/weather', description: 'Thông tin thời tiết các bãi biển' },
      { name: 'Tin Tức', path: '/resources/news', description: 'Tin tức du lịch biển mới nhất' }
    ]
  };

  return (
    <div className="sitemap-container">
      <div className="sitemap-content">
        <div className="sitemap-header">
          <h1>Sơ Đồ Website</h1>
          <p>Khám phá tất cả các trang và tính năng của BeachBlog</p>
        </div>

        <div className="sitemap-grid">
          {/* Main Pages */}
          <div className="sitemap-section">
            <h2>📱 Trang Chính</h2>
            <div className="sitemap-links">
              {siteStructure.main.map((item, index) => (
                <div key={index} className="sitemap-link-item">
                  <Link to={item.path} className="sitemap-link">
                    {item.name}
                  </Link>
                  <p className="sitemap-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Beaches */}
          <div className="sitemap-section">
            <h2>🏖️ Bãi Biển</h2>
            <div className="sitemap-links">
              {siteStructure.beaches.map((item, index) => (
                <div key={index} className="sitemap-link-item">
                  <Link to={item.path} className="sitemap-link">
                    {item.name}
                  </Link>
                  <p className="sitemap-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div className="sitemap-section">
            <h2>🗺️ Theo Khu Vực</h2>
            <div className="sitemap-links">
              {siteStructure.regions.map((item, index) => (
                <div key={index} className="sitemap-link-item">
                  <Link to={item.path} className="sitemap-link">
                    {item.name}
                  </Link>
                  <p className="sitemap-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="sitemap-section">
            <h2>🛎️ Dịch Vụ</h2>
            <div className="sitemap-links">
              {siteStructure.services.map((item, index) => (
                <div key={index} className="sitemap-link-item">
                  <Link to={item.path} className="sitemap-link">
                    {item.name}
                  </Link>
                  <p className="sitemap-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="sitemap-section">
            <h2>📚 Tài Nguyên</h2>
            <div className="sitemap-links">
              {siteStructure.resources.map((item, index) => (
                <div key={index} className="sitemap-link-item">
                  <Link to={item.path} className="sitemap-link">
                    {item.name}
                  </Link>
                  <p className="sitemap-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sitemap-footer">
          <div className="sitemap-stats">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Trang</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Bãi Biển</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Khu Vực</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Hỗ Trợ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMap;
