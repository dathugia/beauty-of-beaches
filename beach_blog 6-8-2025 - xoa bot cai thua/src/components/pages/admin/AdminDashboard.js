import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_beaches: 0,
    pending_feedback: 0,
    total_images: 0,
    recent_feedback: [],
    region_stats: [],
    avg_rating: 0
  });

  useEffect(() => {
    // Kiểm tra admin đã đăng nhập chưa
    const storedAdminData = localStorage.getItem('adminData');
    if (storedAdminData) {
      setAdminData(JSON.parse(storedAdminData));
      // Lấy thống kê từ API
      fetchStats();
    } else {
      // Redirect về login nếu chưa đăng nhập
      window.location.href = '/';
    }
    setLoading(false);
  }, []);

  // Hàm lấy thống kê từ API
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin_stats.php');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
    window.location.href = '/';
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

  if (!adminData) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You need to login as admin to access this page.</p>
          <Link to="/" className="btn btn-primary">Go to Login</Link>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="admin-dashboard">
      <Container fluid>
                 {/* Header */}
         <Row className="admin-header">
           <Col>
             <h1>Admin Dashboard</h1>
             <p>Welcome back, {adminData.username}!</p>
           </Col>
         </Row>

                 {/* Quick Stats */}
         <Row className="mb-4">
           <Col md={3}>
             <Card className="stat-card">
               <Card.Body>
                 <Card.Title>Total Beaches</Card.Title>
                 <Card.Text className="stat-number">{stats.total_beaches}</Card.Text>
               </Card.Body>
             </Card>
           </Col>
           <Col md={3}>
             <Card className="stat-card">
               <Card.Body>
                 <Card.Title>Pending Feedback</Card.Title>
                 <Card.Text className="stat-number">{stats.pending_feedback}</Card.Text>
               </Card.Body>
             </Card>
           </Col>
           <Col md={3}>
             <Card className="stat-card">
               <Card.Body>
                 <Card.Title>Total Images</Card.Title>
                 <Card.Text className="stat-number">{stats.total_images}</Card.Text>
               </Card.Body>
             </Card>
           </Col>
           <Col md={3}>
             <Card className="stat-card">
               <Card.Body>
                 <Card.Title>Average Rating</Card.Title>
                 <Card.Text className="stat-number">{stats.avg_rating}/5</Card.Text>
               </Card.Body>
             </Card>
           </Col>
         </Row>

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header>
                <h4>Quick Actions</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3} className="mb-3">
                    <Link to="/admin/beaches" className="btn btn-primary w-100">
                      <i className="fas fa-umbrella-beach me-2"></i>
                      Manage Beaches
                    </Link>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Link to="/admin/galleries" className="btn btn-success w-100">
                      <i className="fas fa-images me-2"></i>
                      Manage Galleries
                    </Link>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Link to="/admin/feedback" className="btn btn-warning w-100">
                      <i className="fas fa-comments me-2"></i>
                      Review Feedback
                    </Link>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Link to="/admin/stats" className="btn btn-info w-100">
                      <i className="fas fa-chart-bar me-2"></i>
                      View Statistics
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

                 {/* Recent Activity */}
         <Row>
           <Col md={6}>
             <Card>
               <Card.Header>
                 <h4>Recent Feedback</h4>
               </Card.Header>
               <Card.Body>
                 {stats.recent_feedback.length > 0 ? (
                   stats.recent_feedback.map((feedback, index) => (
                     <div key={index}>
                       <div className="recent-item">
                         <strong>{feedback.beach_name}</strong> - {feedback.rating} stars
                         <br />
                         <small className="text-muted">"{feedback.comment}"</small>
                         <br />
                         <small className="text-muted">by {feedback.visitor_name}</small>
                       </div>
                       {index < stats.recent_feedback.length - 1 && <hr />}
                     </div>
                   ))
                 ) : (
                   <div className="text-muted">No recent feedback</div>
                 )}
               </Card.Body>
             </Card>
           </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h4>System Status</h4>
              </Card.Header>
              <Card.Body>
                <div className="status-item">
                  <span className="status-dot online"></span>
                  Database: Online
                </div>
                <div className="status-item">
                  <span className="status-dot online"></span>
                  API: Online
                </div>
                <div className="status-item">
                  <span className="status-dot online"></span>
                  File Storage: Online
                </div>
                <div className="status-item">
                  <span className="status-dot online"></span>
                  Email Service: Online
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
