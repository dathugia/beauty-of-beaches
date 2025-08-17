import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AdminBeachManagement.css';

const AdminBeachManagement = () => {
  const [beaches, setBeaches] = useState([]);
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [beachNames, setBeachNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBeach, setEditingBeach] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const [formData, setFormData] = useState({
    name: '',
    region_name: '', // Để nhập region mới
    city: '', // Để nhập city mới
    description: '',
    image_url: '',
    country: '',
    rank: 0
  });

  useEffect(() => {
    fetchBeaches();
    fetchRegions();
  }, []);

  const fetchBeaches = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin_beach.php?action=get_all');
      const data = await response.json();
      if (data.success) {
        setBeaches(data.beaches);
      }
    } catch (error) {
      console.error('Error fetching beaches:', error);
      setMessage('Error loading beaches');
      setMessageType('danger');
    }
    setLoading(false);
  };

  const fetchRegions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin_beach.php?action=get_regions');
      const data = await response.json();
      if (data.success) {
        setRegions(data.regions);
        setCountries(data.countries);
        setBeachNames(data.beaches);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setMessage('Beach name is required');
      setMessageType('danger');
      return;
    }
    
    if (!formData.region_name.trim()) {
      setMessage('Region name is required');
      setMessageType('danger');
      return;
    }
    
    if (!formData.city.trim()) {
      setMessage('City name is required');
      setMessageType('danger');
      return;
    }
    
    if (!formData.country.trim()) {
      setMessage('Country name is required');
      setMessageType('danger');
      return;
    }
    
    try {
      const action = editingBeach ? 'update' : 'create';
      
      // Xử lý dữ liệu trước khi gửi
      const submitData = {
        action: action,
        ...formData,
        id: editingBeach?.id
      };
      
      // Đảm bảo region_id = 0 để tạo region mới
      submitData.region_id = 0;
      
      const response = await fetch('http://localhost:8000/api/admin_beach.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
             if (data.success) {
         setMessage(editingBeach ? 'Beach updated successfully!' : 'Beach created successfully!');
         setMessageType('success');
         setShowModal(false);
         resetForm();
         fetchBeaches();
         // Cập nhật lại danh sách regions để hiển thị region mới
         fetchRegions();
       } else {
        setMessage(data.message || 'Operation failed');
        setMessageType('danger');
      }
    } catch (error) {
      setMessage('Error performing operation');
      setMessageType('danger');
    }
  };

  const handleEdit = (beach) => {
    setEditingBeach(beach);
    
    // Lấy thông tin region từ danh sách regions
    const regionInfo = regions.find(r => r.id === beach.region_id);
    
    setFormData({
      name: beach.name,
      region_name: beach.region_name || regionInfo?.name || '',
      city: beach.region_city || regionInfo?.city || '',
      description: beach.description || '',
      image_url: beach.image_url || '',
      country: beach.country || regionInfo?.national || '',
      rank: beach.rank || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (beachId) => {
    if (window.confirm('Are you sure you want to delete this beach?')) {
      try {
        const response = await fetch('http://localhost:8000/api/admin_beach.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'delete',
            id: beachId
          })
        });

        const data = await response.json();
        if (data.success) {
          setMessage('Beach deleted successfully!');
          setMessageType('success');
          fetchBeaches();
        } else {
          setMessage(data.message || 'Delete failed');
          setMessageType('danger');
        }
      } catch (error) {
        setMessage('Error deleting beach');
        setMessageType('danger');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      region_name: '',
      city: '',
      description: '',
      image_url: '',
      country: '',
      rank: 0
    });
    setEditingBeach(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const getRegionInfo = (regionId) => {
    const region = regions.find(r => r.id === regionId);
    return region ? { name: region.name } : null;
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <div className="admin-beach-management">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1>Beach Management</h1>
                <p>Manage all beaches in the system</p>
              </div>
              <div>
                <Button variant="primary" onClick={handleAddNew}>
                  <i className="fas fa-plus me-2"></i>
                  Add New Beach
                </Button>
                <Link to="/admin/dashboard" className="btn btn-secondary ms-2">
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        {/* Message Alert */}
        {message && (
          <Row className="mb-3">
            <Col>
              <Alert variant={messageType} onClose={() => setMessage('')} dismissible>
                {message}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Beaches Table */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h4>All Beaches ({beaches.length})</h4>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                                     <thead>
                     <tr>
                       <th className="col-id">ID</th>
                       <th className="col-rank">Rank</th>
                       <th className="col-name">Name</th>
                       <th className="col-region">Region</th>
                       <th className="col-national">Country</th>
                       <th className="col-image">Image</th>
                       <th className="col-created">Created</th>
                       <th className="col-actions">Actions</th>
                     </tr>
                   </thead>
                  <tbody>
                    {beaches.map((beach) => (
                      <tr key={beach.id}>
                        <td>{beach.id}</td>
                        <td>
                          <Badge bg={beach.rank <= 10 ? 'danger' : beach.rank <= 50 ? 'warning' : 'secondary'}>
                            #{beach.rank}
                          </Badge>
                        </td>
                                                 <td>
                           <div className="text-truncate">
                             <strong>{beach.name}</strong>
                           </div>
                           {beach.description && (
                             <div className="text-muted small text-truncate">
                               {beach.description.substring(0, 30)}...
                             </div>
                           )}
                         </td>
                                                                          <td>
                           {(() => {
                             // Ưu tiên hiển thị region_name từ API response
                             if (beach.region_name) {
                               return (
                                 <div>
                                   <strong>{beach.region_name}</strong>
                                 </div>
                               );
                             }
                             // Fallback: tìm từ danh sách regions
                             const regionInfo = getRegionInfo(beach.region_id);
                             return regionInfo ? (
                               <div>
                                 <strong>{regionInfo.name}</strong>
                               </div>
                             ) : (
                               <span className="text-muted">No region</span>
                             );
                           })()}
                         </td>
                                     <td>
              {beach.country || '-'}
            </td>
                        <td>
                          {beach.image_url ? (
                            <img 
                              src={beach.image_url} 
                              alt={beach.name}
                              style={{ width: '50px', height: '30px', objectFit: 'cover' }}
                            />
                          ) : (
                            <span className="text-muted">No image</span>
                          )}
                        </td>
                                                 <td>
                           {beach.created_at ? 
                             new Date(beach.created_at).toLocaleDateString() : 
                             'N/A'
                           }
                         </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => handleEdit(beach)}
                            className="me-1"
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDelete(beach.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingBeach ? 'Edit Beach' : 'Add New Beach'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                                 <Col md={6}>
                   <Form.Group className="mb-3">
                     <Form.Label>Beach Name *</Form.Label>
                     <Form.Control
                       type="text"
                       name="name"
                       value={formData.name}
                       onChange={handleInputChange}
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
                       name="region_name"
                       value={formData.region_name}
                       onChange={handleInputChange}
                       placeholder="Enter region name"
                       required
                     />
                     <Form.Text className="text-muted mt-1">
                       Enter city name below:
                     </Form.Text>
                     <Form.Control
                       type="text"
                       name="city"
                       value={formData.city}
                       onChange={handleInputChange}
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
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
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
                      name="rank"
                      value={formData.rank}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingBeach ? 'Update Beach' : 'Create Beach'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminBeachManagement;

