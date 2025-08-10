import React from 'react';
import './AdvertisementSection.css';

const AdvertisementSection = () => {
  const advertisements = [
    {
      id: 1,
      type: 'flight',
      title: 'Chuyến Bay Đến Phú Quốc',
      description: 'Bay từ Hà Nội/Hồ Chí Minh đến Phú Quốc chỉ từ 1,200,000 VNĐ',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '1,200,000 VNĐ',
      discount: '20% OFF',
      company: 'Vietnam Airlines',
      icon: '✈️'
    },
    {
      id: 2,
      type: 'bus',
      title: 'Xe Khách Đến Nha Trang',
      description: 'Xe khách chất lượng cao từ Hà Nội đến Nha Trang',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '450,000 VNĐ',
      discount: '15% OFF',
      company: 'Phương Trang',
      icon: '🚌'
    },
    {
      id: 3,
      type: 'flight',
      title: 'Chuyến Bay Đến Đà Nẵng',
      description: 'Khám phá bãi biển Đà Nẵng với giá vé cực tốt',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '980,000 VNĐ',
      discount: '25% OFF',
      company: 'Bamboo Airways',
      icon: '✈️'
    },
    {
      id: 4,
      type: 'bus',
      title: 'Xe Khách Đến Vũng Tàu',
      description: 'Xe khách VIP từ Hồ Chí Minh đến Vũng Tàu',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '120,000 VNĐ',
      discount: '10% OFF',
      company: 'Mai Linh',
      icon: '🚌'
    }
  ];

  return (
    <section className="advertisement-section">
      <div className="advertisement-container">
        <div className="advertisement-header">
          <h2>🚀 Đặt Vé Du Lịch</h2>
          <p>Khám phá các bãi biển đẹp với giá vé tốt nhất!</p>
        </div>

        <div className="advertisement-grid">
          {advertisements.map((ad) => (
            <div key={ad.id} className={`advertisement-card ${ad.type}`}>
              <div className="ad-image-container">
                <img 
                  src={ad.image} 
                  alt={ad.title}
                  className="ad-image"
                />
                <div className="ad-overlay">
                  <div className="ad-type-badge">
                    {ad.icon} {ad.type === 'flight' ? 'Chuyến Bay' : 'Xe Khách'}
                  </div>
                  <div className="ad-discount-badge">
                    {ad.discount}
                  </div>
                </div>
              </div>

              <div className="ad-content">
                <div className="ad-company">
                  <span className="company-icon">{ad.icon}</span>
                  <span className="company-name">{ad.company}</span>
                </div>

                <h3 className="ad-title">{ad.title}</h3>
                <p className="ad-description">{ad.description}</p>

                <div className="ad-price-section">
                  <div className="ad-price">
                    <span className="price-label">Giá chỉ từ:</span>
                    <span className="price-value">{ad.price}</span>
                  </div>
                  <button className="book-now-btn">
                    Đặt Ngay
                  </button>
                </div>

                <div className="ad-features">
                  <span className="feature">🎫 Vé một chiều</span>
                  <span className="feature">🛡️ Bảo hiểm</span>
                  <span className="feature">📱 Đặt online</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="advertisement-footer">
          <div className="ad-stats">
            <div className="stat-item">
              <span className="stat-icon">✈️</span>
              <span className="stat-text">100+ Chuyến Bay</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🚌</span>
              <span className="stat-text">50+ Tuyến Xe</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🏖️</span>
              <span className="stat-text">20+ Điểm Đến</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-text">4.8/5 Đánh Giá</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertisementSection;
