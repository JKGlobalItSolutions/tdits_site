"use client"
import { Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-light py-4 mt-auto">
      <Container>
        <style jsx="true">{`
          /* Logo size adjustments for different screen sizes */
          .footer-logo {
            width: auto;
            height: 80px; /* Default height for desktop */
          }

          .logo-text {
            font-size: 0.9rem;
            color: #555;
            margin-top: 10px;
            max-width: 250px;
          }

          @media (max-width: 1199px) {
            .footer-logo {
              height: 60px; /* Tablet view */
            }
          }

          @media (max-width: 767px) {
            .footer-logo {
              height: 50px; /* Mobile view */
            }

            /* Center content for mobile view */
            .footer-content {
              justify-content: center;
              text-align: center;
            }

            .footer-text {
              font-size: 0.8rem; /* Adjust text size for mobile */
            }

            /* Center Follow Us icons for mobile */
            .social-icons {
              justify-content: center !important;
            }

            .footer-text {
              font-size: 0.9rem;
              text-align: center;
            }
            
            .logo-text {
              text-align: center;
              margin: 10px auto;
            }
          }

          .footer-text {
            font-size: 0.9rem;
            text-align: center;
          }

          .footer-text a {
            color: #007bff;
            text-decoration: none;
          }

          .footer-text a:hover {
            color: #0056b3;
            text-decoration: underline;
          }
          
          .social-icons a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #f8f9fa;
            transition: all 0.3s ease;
          }
          
          .social-icons a:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          }
          
          .contact-icon {
            min-width: 20px;
            margin-right: 10px;
            color: #007bff;
          }
          
          .quick-link {
            transition: all 0.2s ease;
            display: inline-block;
            padding: 2px 0;
          }
          
          .quick-link:hover {
            transform: translateX(5px);
            color: #007bff !important;
          }
        `}</style>

        <Row className="mb-4 footer-content">
          <Col xs={12} md={3} className="mb-4 mb-md-0 d-flex flex-column align-items-center align-items-md-start">
            {/* Logo with responsive size */}
            <img src="/images/logo.png" alt="TDITS Logo" className="footer-logo" />
            <p className="logo-text text-center text-md-start">
              Tiruvannamalai Development Information Technology Society - Fostering innovation, collaboration, and
              community development since 2023.
            </p>
          </Col>
          <Col xs={12} md={3} className="mb-4 mb-md-0">
            <h5 className="mb-3 text-center text-md-start">Quick Links</h5>
            <ul className="list-unstyled text-center text-md-start">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none text-dark quick-link">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-decoration-none text-dark quick-link">
                  About
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/gallery" className="text-decoration-none text-dark quick-link">
                  Gallery
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/events" className="text-decoration-none text-dark quick-link">
                  Events
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/membership" className="text-decoration-none text-dark quick-link">
                  Membership
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-decoration-none text-dark quick-link">
                  Contact
                </Link>
              </li>
            </ul>
          </Col>
          <Col xs={12} md={3} className="mb-4 mb-md-0">
            <h5 className="mb-3 text-center text-md-start">Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start gap-2 social-icons">
              <a
                href="https://facebook.com"
                className="text-primary fs-5"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                className="text-primary fs-5"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                className="text-primary fs-5"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                className="text-primary fs-5"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
            <div className="mt-4">
              <h5 className="mb-3 text-center text-md-start">Newsletter</h5>
              <p className="small text-center text-md-start">Subscribe to our newsletter for updates</p>
              <form className="d-flex">
                <input
                  type="email"
                  className="form-control form-control-sm me-2"
                  placeholder="Your email"
                  aria-label="Subscribe"
                />
                <button className="btn btn-sm btn-primary" type="submit">
                  Join
                </button>
              </form>
            </div>
          </Col>
          <Col xs={12} md={3} className="mb-4 mb-md-0">
            <h5 className="mb-3 text-center text-md-start">Contact Us</h5>
            <ul className="list-unstyled text-center text-md-start">
              <li className="contact-item mb-2 justify-content-center justify-content-md-start">
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Main St, Tiruvannamalai, TN</span>
              </li>
              <li className="contact-item mb-2 justify-content-center justify-content-md-start">
                <FaEnvelope className="contact-icon" />
                <a href="mailto:info@tdits.com" className="text-decoration-none text-dark">
                  info@tdits.com
                </a>
              </li>
              <li className="contact-item mb-2 justify-content-center justify-content-md-start">
                <FaPhone className="contact-icon" />
                <a href="tel:+911234567890" className="text-decoration-none text-dark">
                  +91 1234567890
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Line separator */}
        <Row>
          <Col className="border-top pt-3">
            <p className="footer-text mb-0">
              &copy; {currentYear} Tiruvannamalai Development Information Technology Society. All rights reserved. |
              Developed by{" "}
              <a href="https://jkglobalitsolution.com" target="_blank" rel="noopener noreferrer">
                JK Global IT Solutions
              </a>
              .
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer

