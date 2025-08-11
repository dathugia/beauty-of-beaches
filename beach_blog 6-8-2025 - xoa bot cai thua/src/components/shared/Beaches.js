import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'; // Import Bootstrap components
import { API_BASE_URL } from '../../util/url';
import './Beaches.css'; // Import CSS file

const Beaches = () => {
  // State để lưu danh sách bãi biển từ API
  const [beaches, setBeaches] = useState([]);
  // State để hiển thị loading khi đang fetch data
  const [loading, setLoading] = useState(true);
  // State để lưu lỗi nếu có
  const [error, setError] = useState('');

  // Hàm lấy tên nước từ region_id
  const getCountryName = (regionId) => {
    const id = Number(regionId); // Chuyển sang number để so sánh chính xác
    switch(id) {
      case 1: return 'Italy';
      case 2: return 'Philippines';
      case 3: return 'Thailand';
      case 4: return 'Greece';
      case 5: return 'French Polynesia';
      case 6: return 'Dominican Republic';
      default: return 'Unknown Country';
    }
  };

  // useEffect để fetch data khi component mount
  useEffect(() => {
    const load = async () => {
      try {
        // Gọi API để lấy danh sách bãi biển
        const res = await fetch(`${API_BASE_URL}/beaches.php`);
        const json = await res.json();
        
        // Kiểm tra status từ API response
        if (json.status) {
          setBeaches(json.data || []); // Lưu data vào state
        } else {
          setError(json.message || 'Load failed'); // Lưu lỗi nếu có
        }
      } catch (e) {
        setError(e.message); // Lưu lỗi network
      } finally {
        setLoading(false); // Tắt loading
      }
    };
    load();
  }, []);

  // Hiển thị loading spinner
  if (loading) return (
    <div className="text-center p-5">
      <div className="spinner-border loading-spinner" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading beaches...</p>
    </div>
  );

  // Hiển thị lỗi nếu có
  if (error) return (
    <div className="alert error-alert m-3" role="alert">
      <strong>Error:</strong> {error}
    </div>
  );

  return (
    <div className="beaches-container">
      <Container fluid className="py-5">
        {/* Grid hiển thị danh sách bãi biển */}
        <Row xs={1} md={2} lg={3} xl={4} className="g-4 beaches-grid">
          {beaches.map((beach, index) => (
            <Col key={beach.id}>
              {/* Card cho mỗi bãi biển */}
              <Card className="beach-card h-100">
                {/* Ảnh bãi biển */}
                <Card.Img 
                  variant="top" 
                  src={beach.image_url} 
                  alt={beach.name}
                  className="card-img-top"
                  style={{ 
                    height: '200px', 
                    objectFit: 'cover' // Đảm bảo ảnh không bị méo
                  }}
                />
                
                {/* Nội dung card */}
                <Card.Body className="d-flex flex-column">
                  {/* Số thứ tự */}
                  <div className="mb-2">
                    <span className="badge">#{index + 1}</span>
                  </div>
                  
                  {/* Tên bãi biển */}
                  <Card.Title className="fw-bold mb-2">
                    {beach.name}
                  </Card.Title>
                  
                  {/* Tên nước - sử dụng hàm getCountryName */}
                  <Card.Subtitle className="mb-3">
                    {getCountryName(beach.region_id)}
                  </Card.Subtitle>
                  
                  {/* Nút "View Details" */}
                  <div className="mt-auto">
                    <Link to={`/beach/${beach.id}`}>
                      <Button variant="outline-primary" size="sm" className="w-100">
                        <i className="fas fa-eye me-2"></i>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Footer section nếu cần */}
        <Row className="mt-5">
          <Col className="text-center">
            <p className="beaches-footer">
              Showing {beaches.length} beaches from database
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Beaches;
