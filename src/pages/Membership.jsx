import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import emailjs from 'emailjs-com';

function Membership() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessLocation: '',
    contactNumber: '',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the email data
    const templateParams = {
      businessName: formData.businessName,
      businessLocation: formData.businessLocation,
      contactNumber: formData.contactNumber,
    };

    // Send the email via EmailJS
    emailjs
      .send(
        'service_rcu87dr', // Replace with your EmailJS service ID
        'template_ih56l0k', // Replace with your EmailJS template ID
        templateParams,
        'IoZZSUt6RcebUgHjz' // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          console.log('Email sent successfully!', response);
          alert('Membership application submitted successfully!');
          setFormData({ businessName: '', businessLocation: '', contactNumber: '' });
        },
        (error) => {
          console.error('Email sending error:', error);
          alert('There was an error sending your application. Please try again.');
        }
      );

    // Send WhatsApp message
    const whatsappMessage = `
      New Membership Application:
      Business Name: ${formData.businessName}
      Business Location: ${formData.businessLocation}
      Contact Number: ${formData.contactNumber}
    `;
    const whatsappUrl = `https://wa.me/7806844491?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp link in a new tab to send the message
    window.open(whatsappUrl, '_blank');
  };

  const observerCallback = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        entry.target.style.visibility = 'visible';
      }
    });
  }, []);

  useEffect(() => {
    setIsLoaded(true);

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => {
      el.style.visibility = 'hidden';
      observer.observe(el);
    });

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, [observerCallback]);

  return (
    <>
      <style>
        {`
          :root {
            --animation-duration: 0.8s;
            --animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
          }

          .hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity var(--animation-duration) var(--animation-timing-function),
                        transform var(--animation-duration) var(--animation-timing-function);
          }

          .show {
            opacity: 1;
            transform: translateY(0);
          }

          .fade-in {
            animation: fadeIn var(--animation-duration) var(--animation-timing-function) forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .pulse-button {
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
          }
        `}
      </style>

      <div
        className={`${isLoaded ? 'fade-in' : ''}`}
        style={{
          backgroundImage: 'url(/images/banner-without-content.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '100px 0',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: 'white', margin: 0 }}>Membership</h1>
        <p style={{ color: 'white', margin: 0 }}>
          Join TDITS to access exclusive benefits and networking opportunities.
        </p>
      </div>

      <Container className="mb-5">
        <h1 className="text-center my-5 hidden">Membership Form</h1>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg hidden">
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="formBusinessName">
                    <Form.Label>Business Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBusinessLocation">
                    <Form.Label>Business Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="businessLocation"
                      value={formData.businessLocation}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formContactNumber">
                    <Form.Label>Contact Mobile Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="text-center">
                    <Button variant="primary" type="submit" size="lg" className="px-5 pulse-button">
                      Apply for Membership
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Membership;

