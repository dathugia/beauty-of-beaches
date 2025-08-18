import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../../util/url';
import './AdminFeedbackManagement.css';

const AdminFeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_feedback.php`);
      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
      } else {
        setMessage('Error loading feedbacks: ' + data.message);
        setMessageType('danger');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setMessage('Error loading feedbacks');
      setMessageType('danger');
    }
    setLoading(false);
  };

  const handleApprove = async (feedbackId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_feedback.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'approve', feedback_id: feedbackId })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Feedback approved successfully!');
        setMessageType('success');
        fetchFeedbacks(); // Refresh list
      } else {
        setMessage('Error approving feedback: ' + data.message);
        setMessageType('danger');
      }
    } catch (error) {
      setMessage('Error approving feedback');
      setMessageType('danger');
    }
  };

  const handleReject = async (feedbackId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_feedback.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'reject', feedback_id: feedbackId })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Feedback rejected successfully!');
        setMessageType('success');
        fetchFeedbacks(); // Refresh list
      } else {
        setMessage('Error rejecting feedback: ' + data.message);
        setMessageType('danger');
      }
    } catch (error) {
      setMessage('Error rejecting feedback');
      setMessageType('danger');
    }
  };

  const handleDelete = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/admin_feedback.php`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action: 'delete', feedback_id: feedbackId })
        });
        const data = await response.json();
        if (data.success) {
          setMessage('Feedback deleted successfully!');
          setMessageType('success');
          fetchFeedbacks(); // Refresh list
        } else {
          setMessage('Error deleting feedback: ' + data.message);
          setMessageType('danger');
        }
      } catch (error) {
        setMessage('Error deleting feedback');
        setMessageType('danger');
      }
    }
  };

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const getFilteredFeedbacks = () => {
    switch (filter) {
      case 'pending':
        return feedbacks.filter(f => !f.is_approved);
      case 'approved':
        return feedbacks.filter(f => f.is_approved);
      case 'rejected':
        return feedbacks.filter(f => f.is_approved === false);
      default:
        return feedbacks;
    }
  };

  const getStatusBadge = (isApproved) => {
    if (isApproved === null || isApproved === undefined) {
      return <Badge bg="warning">Pending</Badge>;
    }
    return isApproved ? 
      <Badge bg="success">Approved</Badge> : 
      <Badge bg="danger">Rejected</Badge>;
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

  const filteredFeedbacks = getFilteredFeedbacks();

  return (
    <div className="admin-feedback-management">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1>Feedback Management</h1>
                <p>Manage all user feedback and reviews</p>
              </div>
              <Link to="/admin/dashboard" className="btn btn-secondary">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Dashboard
              </Link>
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

        {/* Filter Controls */}
        <Row className="mb-3">
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">Filters</h5>
                  </div>
                  <div className="btn-group" role="group">
                    <Button 
                      variant={filter === 'all' ? 'primary' : 'outline-primary'}
                      onClick={() => setFilter('all')}
                    >
                      All ({feedbacks.length})
                    </Button>
                    <Button 
                      variant={filter === 'pending' ? 'primary' : 'outline-primary'}
                      onClick={() => setFilter('pending')}
                    >
                      Pending ({feedbacks.filter(f => !f.is_approved).length})
                    </Button>
                    <Button 
                      variant={filter === 'approved' ? 'primary' : 'outline-primary'}
                      onClick={() => setFilter('approved')}
                    >
                      Approved ({feedbacks.filter(f => f.is_approved).length})
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Feedbacks Table */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h4>All Feedback ({filteredFeedbacks.length})</h4>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Beach</th>
                      <th>Visitor</th>
                      <th>Rating</th>
                      <th>Attachment</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeedbacks.map((feedback) => (
                      <tr key={feedback.id}>
                        <td>{feedback.id}</td>
                        <td>
                          <strong>{feedback.beach_name}</strong>
                        </td>
                        <td>
                          <div>{feedback.visitor_name}</div>
                          <small className="text-muted">{feedback.email}</small>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="me-2">{feedback.rating}/5</span>
                            <div className="stars">
                              {[...Array(5)].map((_, i) => (
                                <i 
                                  key={i} 
                                  className={`fas fa-star ${i < feedback.rating ? 'text-warning' : 'text-muted'}`}
                                  style={{ fontSize: '0.875rem' }}
                                ></i>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td>
                          {feedback.attachment_path ? (
                            <a 
                              href={`${API_BASE_URL}/${feedback.attachment_path}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              <i className="fas fa-paperclip me-1"></i>
                              View
                            </a>
                          ) : (
                            <span className="text-muted">No attachment</span>
                          )}
                        </td>
                        <td>{getStatusBadge(feedback.is_approved)}</td>
                        <td>{new Date(feedback.created_at).toLocaleDateString()}</td>
                        <td>
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            onClick={() => handleViewDetails(feedback)}
                            className="me-1"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          {!feedback.is_approved && (
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              onClick={() => handleApprove(feedback.id)}
                              className="me-1"
                              title="Approve"
                            >
                              <i className="fas fa-check"></i>
                            </Button>
                          )}
                          {feedback.is_approved !== false && (
                            <Button 
                              variant="outline-warning" 
                              size="sm" 
                              onClick={() => handleReject(feedback.id)}
                              className="me-1"
                              title="Reject"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          )}
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDelete(feedback.id)}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {filteredFeedbacks.length === 0 && (
                  <div className="text-center text-muted py-4">
                    <i className="fas fa-inbox fa-3x mb-3"></i>
                    <p>No feedback found for the selected filter.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Feedback Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Feedback Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedFeedback && (
              <div>
                <Row>
                  <Col md={6}>
                    <h6>Beach</h6>
                    <p className="text-muted">{selectedFeedback.beach_name}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Status</h6>
                    <p>{getStatusBadge(selectedFeedback.is_approved)}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <h6>Visitor Name</h6>
                    <p className="text-muted">{selectedFeedback.visitor_name}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Email</h6>
                    <p className="text-muted">{selectedFeedback.email}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <h6>Rating</h6>
                    <div className="d-flex align-items-center">
                      <span className="me-2">{selectedFeedback.rating}/5</span>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`fas fa-star ${i < selectedFeedback.rating ? 'text-warning' : 'text-muted'}`}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6>Date</h6>
                    <p className="text-muted">
                      {new Date(selectedFeedback.created_at).toLocaleString()}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h6>Comment</h6>
                    <p className="text-muted">{selectedFeedback.comment || 'No comment provided'}</p>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            {selectedFeedback && !selectedFeedback.is_approved && (
              <Button 
                variant="success" 
                onClick={() => {
                  handleApprove(selectedFeedback.id);
                  setShowModal(false);
                }}
              >
                Approve
              </Button>
            )}
            {selectedFeedback && selectedFeedback.is_approved !== false && (
              <Button 
                variant="warning" 
                onClick={() => {
                  handleReject(selectedFeedback.id);
                  setShowModal(false);
                }}
              >
                Reject
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminFeedbackManagement;
