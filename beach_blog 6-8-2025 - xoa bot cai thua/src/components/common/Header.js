import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Modal, Button, Form } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: "admin1",
    password: "123456"
  });
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Load saved credentials if remember password is enabled
    const savedCredentials = localStorage.getItem('adminCredentials');
    if (savedCredentials) {
      try {
        const credentials = JSON.parse(savedCredentials);
        setLoginForm({
          username: credentials.username || 'admin',
          password: credentials.password || '123456'
        });
        setRememberPassword(true);
      } catch (err) {
        localStorage.removeItem('adminCredentials');
      }
    }

    // Bắt sự kiện scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        setIsScrolled(true);
        // Tự động ẩn dropdown khi scroll
        setIsDropdownOpen(false);
      } else {
        setIsScrolled(false);
      }
    };

    // Bắt sự kiện click ra ngoài để đóng dropdown
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('nav-list-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Kiểm tra trạng thái đăng nhập admin
    const checkAdminStatus = async () => {
      // Kiểm tra localStorage trước
      const storedAdminData = localStorage.getItem('adminData');
      if (storedAdminData) {
        try {
          const admin = JSON.parse(storedAdminData);
          if (admin) {
            setIsLoggedIn(true);
            return;
          }
        } catch (err) {
          localStorage.removeItem('adminData');
        }
      }
      
      // Nếu không có trong localStorage, kiểm tra session
      const adminToken = localStorage.getItem('adminToken');
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
            setIsLoggedIn(true);
            // Save to localStorage for future checks
            localStorage.setItem('adminData', JSON.stringify(data.admin));
          } else {
            // Session expired, clear tokens
            localStorage.removeItem('adminData');
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          // Clear tokens on error
          localStorage.removeItem('adminData');
          localStorage.removeItem('adminToken');
        }
      }
    };

    checkAdminStatus();
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', loginForm);
    
    try {
      const requestBody = {
        action: 'login',
        username: loginForm.username,
        password: loginForm.password
      };
      console.log('Request body:', requestBody);
      
      const response = await fetch('http://localhost:8000/api/admin_auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        
        // Save credentials if remember password is checked
        if (rememberPassword) {
          localStorage.setItem('adminCredentials', JSON.stringify({
            username: loginForm.username,
            password: loginForm.password
          }));
        } else {
          localStorage.removeItem('adminCredentials');
        }
        
        // Save admin data to localStorage
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        localStorage.setItem('adminToken', data.admin.session_token);
        
        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        alert(data.error || data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    const adminToken = localStorage.getItem('adminToken');
    try {
      const response = await fetch('http://localhost:8000/api/admin_auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          action: 'logout',
          session_token: adminToken
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(false);
        // Clear all stored session data
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminToken');
        // Redirect to home page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      setIsLoggedIn(false);
      localStorage.removeItem('adminData');
      localStorage.removeItem('adminToken');
      window.location.href = '/';
    }
  };

  // Kiểm tra xem có phải trang home không
  const isHomePage = location.pathname === "/";

  return (
    <>
      <header className="main-header fixed-top">
        <Navbar
          expand="lg"
          variant="dark"
          className={`navbar ${isScrolled ? "scrolled" : ""} ${!isHomePage ? "other-page" : ""}`}
        >
          <Container className="justify-content-between align-items-center">
            <Navbar.Brand as={Link} to="/">
              Beauty Of Beaches
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarNav" />
            <Navbar.Collapse id="navbarNav" className="align-items-center">
              <Nav className="mx-auto gap-4 p-2">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <NavDropdown 
                  title="THE LIST"
                  id="nav-list-dropdown"
                  show={isDropdownOpen}
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={isHomePage ? "dropdown-home" : "dropdown-other"}
                >
                  <NavDropdown.Item as={Link} to="/regions/east">East</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/regions/north">North</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/regions/west">West</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/regions/south">South</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="/top50">Top Beaches</Nav.Link>
                <Nav.Link as={Link} to="/gallery">Photo Gallery</Nav.Link>
                <Nav.Link as={Link} to="/about">About Us</Nav.Link>
              </Nav>

              <div className="d-flex align-items-center gap-3">
                {/* Visitor count */}
                <div className="visitor-count d-flex align-items-center px-3 py-1 rounded-pill text-white">
                  <span>1234</span>
                </div>
                
                {/* Admin section */}
                <div className="admin-section d-flex align-items-center gap-2">
                  {isLoggedIn ? (
                    <>
                      {/* Admin Dashboard button */}
                      <Button
                        variant="outline-light"
                        size="sm"
                        as={Link}
                        to="/admin/dashboard"
                        className="admin-btn"
                        title="Admin Dashboard"
                      >
                        <i className="fas fa-tachometer-alt me-1"></i>
                        Dashboard
                      </Button>
                      
                      {/* Logout button */}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleLogout}
                        className="admin-btn"
                        title="Logout"
                      >
                        <i className="fas fa-sign-out-alt me-1"></i>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => setShowLoginModal(true)}
                      className="admin-btn"
                      title="Admin Login"
                    >
                      <i className="fas fa-user-cog me-1"></i>
                      Admin
                    </Button>
                  )}
                </div>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      {/* Admin Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Admin Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username or Email Address *</Form.Label>
              <Form.Control
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                required
                placeholder="Enter username or email"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
                placeholder="Enter password"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Remember password"
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
              />
            </Form.Group>
            
            <div className="d-grid">
              <Button variant="primary" type="submit" className="w-100">
                LOGIN
              </Button>
            </div>
            
            <div className="text-center mt-3">
              <a href="#" className="text-decoration-none">Forgot password?</a>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;
