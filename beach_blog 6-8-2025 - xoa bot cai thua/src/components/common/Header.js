import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
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

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Kiểm tra xem có phải trang home không
  const isHomePage = location.pathname === "/";

  return (
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
              <Nav.Link as={Link} to="/top50">Top 50 Beaches</Nav.Link>
              <Nav.Link as={Link} to="/gallery">Photo Gallery</Nav.Link>
              <Nav.Link as={Link} to="/about">About Us</Nav.Link>
            </Nav>

            <div
              className="visitor-count d-flex align-items-center px-3 py-1 rounded-pill text-white"
            >
              <span>1234
              </span>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
