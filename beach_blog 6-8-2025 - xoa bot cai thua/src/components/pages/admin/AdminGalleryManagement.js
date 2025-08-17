import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AdminGalleryManagement.css';

const AdminGalleryManagement = () => {
  const [galleries, setGalleries] = useState([]);
  const [beaches, setBeaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const [formData, setFormData] = useState({
    beach_id: '',
    image_url: '',
    caption: ''
  });

  useEffect(() => {
    fetchGalleries();
    fetchBeaches();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin_gallery.php?action=get_all');
      const data = await response.json();
      if (data.success) {
        setGalleries(data.galleries);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      setMessage('Error loading galleries');
      setMessageType('danger');
    }
    setLoading(false);
  };

  const fetchBeaches = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin_gallery.php?action=get_beaches');
      const data = await response.json();
      if (data.success) {
        setBeaches(data.beaches);
      }
    } catch (error) {
      console.error('Error fetching beaches:', error);
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
    if (!formData.beach_id) {
      setMessage('Please select a beach');
      setMessageType('danger');
      return;
    }
    
    if (!formData.image_url.trim()) {
      setMessage('Image URL is required');
      setMessageType('danger');
      return;
    }
    
    try {
      const action = editingGallery ? 'update' : 'create';
      
      const submitData = {
        action: action,
        ...formData,
        id: editingGallery?.id
      };
      
      const response = await fetch('http://localhost:8000/api/admin_gallery.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingGallery ? 'Gallery updated successfully!' : 'Gallery created successfully!');
        setMessageType('success');
        setShowModal(false);
        resetForm();
        fetchGalleries();
      } else {
        setMessage(data.message || 'Operation failed');
        setMessageType('danger');
      }
    } catch (error) {
      setMessage('Error performing operation');
      setMessageType('danger');
    }
  };

  const handleEdit = (gallery) => {
    setEditingGallery(gallery);
    setFormData({
      beach_id: gallery.beach_id,
      image_url: gallery.image_url,
      caption: gallery.caption
    });
    setShowModal(true);
  };

  const handleDelete = async (galleryId) => {
    if (window.confirm('Are you sure you want to delete this gallery entry?')) {
      try {
        const response = await fetch('http://localhost:8000/api/admin_gallery.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'delete',
            id: galleryId
          })
        });

        const data = await response.json();
        if (data.success) {
          setMessage('Gallery deleted successfully!');
          setMessageType('success');
          fetchGalleries();
        } else {
          setMessage(data.message || 'Delete failed');
          setMessageType('danger');
        }
      } catch (error) {
        setMessage('Error deleting gallery');
        setMessageType('danger');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      beach_id: '',
      image_url: '',
      caption: ''
    });
    setEditingGallery(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
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
    <div className="admin-gallery-management">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1>Gallery Management</h1>
                <p>Manage all gallery images in the system</p>
              </div>
              <div>
                <Button variant="primary" onClick={handleAddNew}>
                  <i className="fas fa-plus me-2"></i>
                  Add New Gallery
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

        {/* Galleries Table */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h4>All Gallery Images ({galleries.length})</h4>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th className="col-id">ID</th>
                      <th className="col-beach">Beach</th>
                      <th className="col-image">Image</th>
                      <th className="col-caption">Caption</th>
                      <th className="col-uploaded">Uploaded</th>
                      <th className="col-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleries.map((gallery) => (
                      <tr key={gallery.id}>
                        <td>{gallery.id}</td>
                        <td>
                          <div>
                            <strong>{gallery.beach_name || 'Unknown Beach'}</strong>
                            {gallery.beach_rank > 0 && (
                              <Badge bg="warning" className="ms-2">
                                #{gallery.beach_rank}
                              </Badge>
                            )}
                          </div>
                          <small className="text-muted">ID: {gallery.beach_id}</small>
                        </td>
                        <td>
                          {gallery.image_url ? (
                            <img 
                              src={gallery.image_url} 
                              alt={gallery.caption || 'Gallery image'}
                              style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          ) : (
                            <span className="text-muted">No image</span>
                          )}
                          {gallery.image_url && (
                            <div style={{ display: 'none' }} className="text-muted small">
                              Image not found
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: '200px' }}>
                            {gallery.caption || '-'}
                          </div>
                        </td>
                        <td>
                          {gallery.uploaded_at ? 
                            new Date(gallery.uploaded_at).toLocaleDateString() : 
                            'N/A'
                          }
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => handleEdit(gallery)}
                            className="me-1"
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDelete(gallery.id)}
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
              {editingGallery ? 'Edit Gallery' : 'Add New Gallery'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Beach *</Form.Label>
                <Form.Select
                  name="beach_id"
                  value={formData.beach_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a beach</option>
                  {beaches.map((beach) => (
                    <option key={beach.id} value={beach.id}>
                      {beach.name} {beach.rank > 0 ? `(#${beach.rank})` : ''}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image URL *</Form.Label>
                <Form.Control
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.image_url} 
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none' }} className="text-danger small">
                      Image not found
                    </div>
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Caption</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="caption"
                  value={formData.caption}
                  onChange={handleInputChange}
                  placeholder="Enter image caption"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingGallery ? 'Update Gallery' : 'Create Gallery'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminGalleryManagement;
