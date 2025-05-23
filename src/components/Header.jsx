import { Link, useLocation } from "react-router-dom"
import { Navbar, Nav, Button, Container } from "react-bootstrap"
import { FaLock } from "react-icons/fa"

function Header() {
  const location = useLocation()

  const navLinkStyle = {
    fontSize: "18px",
    padding: "10px 15px",
    margin: "0 5px",
    borderRadius: "5px",
    transition: "all 0.3s ease",
  }

  const activeStyle = {
    backgroundColor: "#e6f2ff",
    color: "#0066cc",
    fontWeight: "bold",
  }

  const adminButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "8px 15px",
    borderRadius: "5px",
    transition: "all 0.3s ease",
    backgroundColor: "#f8f9fa",
    color: "#0066cc",
    border: "1px solid #0066cc",
  }

  return (
    <Navbar bg="light" expand="lg" className="px-1 py-2 shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img src="/images/logo.png" alt="TDITS Logo" height="60" className="d-inline-block align-top mx-3" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" style={{ ...navLinkStyle, ...(location.pathname === "/" ? activeStyle : {}) }}>
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              style={{ ...navLinkStyle, ...(location.pathname === "/about" ? activeStyle : {}) }}
            >
              About
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/gallery"
              style={{ ...navLinkStyle, ...(location.pathname === "/gallery" ? activeStyle : {}) }}
            >
              Gallery
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/events"
              style={{ ...navLinkStyle, ...(location.pathname === "/events" ? activeStyle : {}) }}
            >
              Events
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/membership"
              style={{ ...navLinkStyle, ...(location.pathname === "/membership" ? activeStyle : {}) }}
            >
              Membership
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contact"
              style={{ ...navLinkStyle, ...(location.pathname === "/contact" ? activeStyle : {}) }}
            >
              Contact
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Link to="/login" className="text-decoration-none">
              <Button
                variant="outline-primary"
                size="sm"
                className="d-flex align-items-center"
                style={adminButtonStyle}
                aria-label="Admin Login"
              >
                <FaLock size={14} />
                <span className="d-none d-sm-inline ms-1">Admin Login</span>
              </Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header

