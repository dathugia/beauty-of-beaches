import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap'; // Import Bootstrap components
import { API_BASE_URL } from '../../util/url';
import './Beaches.css'; // Import CSS file

const Beaches = () => {
  // State để lưu danh sách bãi biển từ API
  const [beaches, setBeaches] = useState([]);
  // State để hiển thị loading khi đang fetch data
  const [loading, setLoading] = useState(true);
  // State để lưu lỗi nếu có
  const [error, setError] = useState('');
  
  // Admin states
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBeach, setEditingBeach] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    region_name: '',
    city: '',
    description: '',
    image_url: '',
    country: '',
    rank: 0
  });
  const [message, setMessage] = useState('');



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
    
    // Kiểm tra admin status
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      setIsAdmin(true);
    }
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

  // Admin functions
  const handleEdit = (beach) => {
    setEditingBeach(beach);
    setEditForm({
      name: beach.name || '',
      region_name: beach.region_name || '',
      city: beach.region_city || '',
      description: beach.description || '',
      image_url: beach.image_url || '',
      country: beach.country || '',
      rank: beach.rank || 0
    });
    setShowEditModal(true);
  };

  const handleDelete = async (beachId) => {
    if (window.confirm('Are you sure you want to delete this beach?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/admin_beach.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id: beachId })
        });
        
        const data = await response.json();
        if (data.success) {
          setMessage('Beach deleted successfully!');
          // Refresh beaches list
          const res = await fetch(`${API_BASE_URL}/beaches.php`);
          const json = await res.json();
          if (json.status) {
            setBeaches(json.data || []);
          }
        } else {
          setMessage(data.message || 'Error deleting beach');
        }
      } catch (error) {
        console.error('Delete error:', error);
        setMessage('Error deleting beach: ' + error.message);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_beach.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: editingBeach.id,
          ...editForm
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage('Beach updated successfully!');
        setShowEditModal(false);
        // Refresh beaches list
        const res = await fetch(`${API_BASE_URL}/beaches.php`);
        const json = await res.json();
        if (json.status) {
          setBeaches(json.data || []);
        }
      } else {
        setMessage('Error updating beach');
      }
    } catch (error) {
      setMessage('Error updating beach');
    }
  };

  // Hiển thị lỗi nếu có
  if (error) return (
    <div className="alert error-alert m-3" role="alert">
      <strong>Error:</strong> {error}
    </div>
  );

  return (
    <div className="beaches-container">
      <Container fluid className="py-5">
        {/* Message Alert */}
        {message && (
          <Alert variant="info" onClose={() => setMessage('')} dismissible className="mb-4">
            {message}
          </Alert>
        )}
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
                  
                  {/* Thông tin quốc gia và vùng */}
                  <Card.Subtitle className="mb-3">
                    <div className="location-info">
                      {(() => {
                        // Tạo chuỗi location từ dữ liệu có sẵn
                        const country = beach.national || beach.country || '';
                        
                        // Sử dụng display_region từ API hoặc fallback
                        let region = beach.display_region || beach.region_name || beach.city || '';
                        
                        if (country && region) {
                          return `${country} - ${region}`;
                        } else if (country) {
                          return country;
                        } else if (region) {
                          return region;
                        } else {
                          return 'Location not specified';
                        }
                      })()}
                    </div>
                  </Card.Subtitle>
                  
                  {/* Nút "View Details" */}
                  <div className="mt-auto">
                    <Link to={`/beach/${beach.id}`}>
                      <Button variant="outline-primary" size="sm" className="w-100 mb-2">
                        <i className="fas fa-eye me-2"></i>
                        View Details
                      </Button>
                    </Link>
                    
                    {/* Admin buttons */}
                    {isAdmin && (
                      <div className="admin-buttons d-flex gap-2">
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          onClick={() => handleEdit(beach)}
                          className="flex-fill"
                        >
                          <i className="fas fa-edit me-1"></i>
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleDelete(beach.id)}
                          className="flex-fill"
                        >
                          <i className="fas fa-trash me-1"></i>
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Footer section nếu cần */}
        {/* <Row className="mt-5">
          <Col className="text-center">
            <p className="beaches-footer">
              Showing {beaches.length} beaches from database
            </p>
          </Col>
        </Row> */}
      </Container>

      {/* Edit Beach Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Beach</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Beach Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Enter beach name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Region Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.region_name}
                    onChange={(e) => setEditForm({...editForm, region_name: e.target.value})}
                    placeholder="Enter region name"
                    required
                  />
                  <Form.Text className="text-muted mt-1">
                    Enter city name below:
                  </Form.Text>
                  <Form.Control
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                    placeholder="Enter city name"
                    className="mt-1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                    placeholder="Enter country name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rank</Form.Label>
                  <Form.Control
                    type="number"
                    value={editForm.rank}
                    onChange={(e) => setEditForm({...editForm, rank: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                value={editForm.image_url}
                onChange={(e) => setEditForm({...editForm, image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                placeholder="Enter beach description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Update Beach
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Beaches;
