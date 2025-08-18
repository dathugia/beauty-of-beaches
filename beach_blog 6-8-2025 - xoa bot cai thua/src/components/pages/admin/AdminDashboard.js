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
    // Kiểm tra admin đã đăng nhập chưa với cơ chế refresh token
    checkAdminAuth();
  }, []);

  // Hàm kiểm tra authentication với refresh token
  const checkAdminAuth = async () => {
    const storedAdminData = localStorage.getItem('adminData');
    const adminToken = localStorage.getItem('adminToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (storedAdminData && adminToken) {
      try {
        const admin = JSON.parse(storedAdminData);
        if (admin) {
          // Kiểm tra xem token có hết hạn chưa
          const expiresAt = new Date(admin.expires_at);
          const now = new Date();
          
          if (expiresAt > now) {
            // Token còn hiệu lực
            setAdminData(admin);
            fetchStats();
            setLoading(false);
            return;
          } else if (refreshToken) {
            // Token hết hạn, thử refresh
            const refreshResult = await refreshAdminToken(refreshToken);
            if (refreshResult) {
              setAdminData(refreshResult);
              fetchStats();
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error('Error parsing admin data:', err);
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('refreshToken');
      }
    }
    
    // Nếu không có trong localStorage hoặc token hết hạn, kiểm tra session
    if (adminToken) {
      try {
        const response = await fetch('http://localhost:8000/api/admin_auth.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ 
            action: 'verify',
            session_token: adminToken
          })
        });
        
        const data = await response.json();
        if (data.success) {
          setAdminData(data.admin);
          // Cập nhật localStorage với token mới
          localStorage.setItem('adminData', JSON.stringify(data.admin));
          localStorage.setItem('adminToken', data.admin.session_token);
          if (data.admin.refresh_token) {
            localStorage.setItem('refreshToken', data.admin.refresh_token);
          }
          fetchStats();
          setLoading(false);
          return;
        } else {
          // Session expired, thử refresh token
          if (refreshToken) {
            const refreshResult = await refreshAdminToken(refreshToken);
            if (refreshResult) {
              setAdminData(refreshResult);
              fetchStats();
              setLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    }
    
    // Nếu không thể xác thực, redirect về login
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/';
  };

  // Hàm refresh token
  const refreshAdminToken = async (refreshToken) => {
    try {
      const response = await fetch('http://localhost:8000/api/admin_auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          action: 'refresh',
          refresh_token: refreshToken
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Cập nhật localStorage với token mới
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        localStorage.setItem('adminToken', data.admin.session_token);
        return data.admin;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
    return null;
  };

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
    const adminToken = localStorage.getItem('adminToken');
    
    // Gọi API logout
    fetch('http://localhost:8000/api/admin_auth.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        action: 'logout',
        session_token: adminToken
      })
    }).catch(error => {
      console.error('Logout error:', error);
    });
    
    // Clear all stored data
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminCredentials');
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
           <Col xs="auto">
             <Button variant="outline-danger" onClick={handleLogout}>
               <i className="fas fa-sign-out-alt me-2"></i>
               Logout
             </Button>
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
