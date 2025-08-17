import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AdminStats.css';

const AdminStats = () => {
  const [stats, setStats] = useState({
    total_beaches: 0,
    pending_feedback: 0,
    total_images: 0,
    recent_feedback: [],
    region_stats: [],
    avg_rating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin_stats.php');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        setError('Error loading statistics: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Error loading statistics');
    }
    setLoading(false);
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
    <div className="admin-stats">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1>Statistics Dashboard</h1>
                <p>Overview of website performance and data</p>
              </div>
              <Link to="/admin/dashboard" className="btn btn-secondary">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Dashboard
              </Link>
            </div>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Row className="mb-3">
            <Col>
              <Alert variant="danger" onClose={() => setError('')} dismissible>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Main Stats */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stat-card">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-primary">
                    <i className="fas fa-umbrella-beach"></i>
                  </div>
                  <div className="stat-content">
                    <Card.Title>Total Beaches</Card.Title>
                    <Card.Text className="stat-number">{stats.total_beaches}</Card.Text>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-warning">
                    <i className="fas fa-comments"></i>
                  </div>
                  <div className="stat-content">
                    <Card.Title>Pending Feedback</Card.Title>
                    <Card.Text className="stat-number">{stats.pending_feedback}</Card.Text>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-success">
                    <i className="fas fa-images"></i>
                  </div>
                  <div className="stat-content">
                    <Card.Title>Total Images</Card.Title>
                    <Card.Text className="stat-number">{stats.total_images}</Card.Text>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-info">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="stat-content">
                    <Card.Title>Average Rating</Card.Title>
                    <Card.Text className="stat-number">{stats.avg_rating}/5</Card.Text>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Region Stats */}
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Header>
                <h4>Beaches by Region</h4>
              </Card.Header>
              <Card.Body>
                {stats.region_stats && stats.region_stats.length > 0 ? (
                  <div className="region-stats">
                                         {stats.region_stats.map((region, index) => (
                       <div key={index} className="region-item">
                         <div className="d-flex justify-content-between align-items-center">
                                       <div>
              <span className="region-name">{region.region_name}</span>
            </div>
                           <span className="region-count">{region.beach_count} beaches</span>
                         </div>
                         <div className="progress mt-2">
                           <div 
                             className="progress-bar" 
                             style={{ 
                               width: `${(region.beach_count / stats.total_beaches) * 100}%` 
                             }}
                           ></div>
                         </div>
                       </div>
                     ))}
                  </div>
                ) : (
                  <div className="text-muted">No region data available</div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h4>Recent Feedback</h4>
              </Card.Header>
              <Card.Body>
                {stats.recent_feedback && stats.recent_feedback.length > 0 ? (
                  <div className="recent-feedback">
                    {stats.recent_feedback.map((feedback, index) => (
                      <div key={index} className="feedback-item">
                        <div className="d-flex justify-content-between">
                          <strong>{feedback.beach_name}</strong>
                          <span className="rating">
                            {feedback.rating}/5 ⭐
                          </span>
                        </div>
                        <p className="comment">"{feedback.comment}"</p>
                        <small className="text-muted">
                          by {feedback.visitor_name} • {new Date(feedback.created_at).toLocaleDateString()}
                        </small>
                        {index < stats.recent_feedback.length - 1 && <hr />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted">No recent feedback</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h4>Quick Actions</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4} className="mb-3">
                    <Link to="/admin/beaches" className="btn btn-primary w-100">
                      <i className="fas fa-umbrella-beach me-2"></i>
                      Manage Beaches
                    </Link>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Link to="/admin/feedback" className="btn btn-warning w-100">
                      <i className="fas fa-comments me-2"></i>
                      Review Feedback
                    </Link>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Button variant="success" className="w-100" onClick={fetchStats}>
                      <i className="fas fa-sync-alt me-2"></i>
                      Refresh Stats
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminStats;
