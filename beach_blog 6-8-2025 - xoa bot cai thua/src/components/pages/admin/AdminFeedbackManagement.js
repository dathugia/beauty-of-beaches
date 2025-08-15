import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AdminFeedbackManagement.css';

const AdminFeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin_feedback.php');
      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
    setLoading(false);
  };

  const handleApprove = async (feedbackId) => {
    try {
      const response = await fetch('http://localhost:8000/api/admin_feedback.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', feedback_id: feedbackId })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Feedback approved successfully!');
        fetchFeedbacks(); // Refresh list
      }
    } catch (error) {
      setMessage('Error approving feedback');
    }
  };

  const handleReject = async (feedbackId) => {
    try {
      const response = await fetch('http://localhost:8000/api/admin_feedback.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', feedback_id: feedbackId })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Feedback rejected successfully!');
        fetchFeedbacks(); // Refresh list
      }
    } catch (error) {
      setMessage('Error rejecting feedback');
    }
  };

  const handleDelete = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const response = await fetch('http://localhost:8000/api/admin_feedback.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', feedback_id: feedbackId })
        });
        const data = await response.json();
        if (data.success) {
          setMessage('Feedback deleted successfully!');
          fetchFeedbacks(); // Refresh list
        }
      } catch (error) {
        setMessage('Error deleting feedback');
      }
    }
  };

  const showFeedbackDetail = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
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
    <div className="admin-feedback-management">
      <Container fluid>
        {/* Header */}
        <Row className="admin-header">
          <Col>
            <h1>Feedback Management</h1>
            <p>Review and manage user feedback</p>
          </Col>
          <Col xs="auto">
            <Link to="/admin/dashboard" className="btn btn-outline-primary">
              ← Back to Dashboard
            </Link>
          </Col>
        </Row>

        {message && (
          <Alert variant="info" onClose={() => setMessage('')} dismissible>
            {message}
          </Alert>
        )}

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>Total Feedback</Card.Title>
                <Card.Text className="stat-number">{feedbacks.length}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>Pending Review</Card.Title>
                <Card.Text className="stat-number">
                  {feedbacks.filter(f => !f.is_approved).length}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>Approved</Card.Title>
                <Card.Text className="stat-number">
                  {feedbacks.filter(f => f.is_approved).length}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>Average Rating</Card.Title>
                <Card.Text className="stat-number">
                  {(feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length || 0).toFixed(1)}/5
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Feedback Table */}
        <Card>
          <Card.Header>
            <h4>All Feedback</h4>
          </Card.Header>
          <Card.Body>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Beach</th>
                  <th>Visitor</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id}>
                    <td>{feedback.beach_name}</td>
                    <td>{feedback.visitor_name}</td>
                    <td>
                      <span title={`${feedback.rating} stars`}>
                        {renderStars(feedback.rating)}
                      </span>
                    </td>
                    <td>
                      <div className="comment-preview">
                        {feedback.comment.length > 50 
                          ? `${feedback.comment.substring(0, 50)}...` 
                          : feedback.comment
                        }
                        {feedback.comment.length > 50 && (
                          <Button 
                            variant="link" 
                            size="sm" 
                            onClick={() => showFeedbackDetail(feedback)}
                          >
                            View Full
                          </Button>
                        )}
                      </div>
                    </td>
                    <td>
                      {feedback.is_approved ? (
                        <Badge bg="success">Approved</Badge>
                      ) : (
                        <Badge bg="warning">Pending</Badge>
                      )}
                    </td>
                    <td>{new Date(feedback.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        {!feedback.is_approved && (
                          <>
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={() => handleApprove(feedback.id)}
                              className="me-1"
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => handleReject(feedback.id)}
                              className="me-1"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleDelete(feedback.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* Feedback Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Feedback Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFeedback && (
            <div>
              <Row>
                <Col md={6}>
                  <strong>Beach:</strong> {selectedFeedback.beach_name}
                </Col>
                <Col md={6}>
                  <strong>Visitor:</strong> {selectedFeedback.visitor_name}
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <strong>Rating:</strong> {renderStars(selectedFeedback.rating)}
                </Col>
                <Col md={6}>
                  <strong>Date:</strong> {new Date(selectedFeedback.created_at).toLocaleString()}
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <strong>Comment:</strong>
                  <div className="mt-2 p-3 bg-light rounded">
                    {selectedFeedback.comment}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminFeedbackManagement;
