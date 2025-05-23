import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import emailjs from 'emailjs-com';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    message: '',
    reason: '',
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

    // Prepare email data
    const templateParams = {
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      message: formData.message,
      reason: formData.reason,
    };

    // Send email using EmailJS
    emailjs
      .send(
        'service_rcu87dr', // Replace with your EmailJS service ID
        'template_78uzhbc', // Replace with your EmailJS template ID
        templateParams,
        'IoZZSUt6RcebUgHjz' // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          console.log('Email sent successfully!', response);
          alert('Your message has been sent successfully!');
          setFormData({ name: '', mobileNumber: '', email: '', message: '', reason: '' });
        },
        (error) => {
          console.error('Error sending email:', error);
          alert('There was an error sending your message. Please try again.');
        }
      );

    // Create the WhatsApp message with the form data
    const message = `*TDITS Contact Form*\n\nName: ${formData.name}\nMobile: ${formData.mobileNumber}\nEmail: ${formData.email}\nMessage: ${formData.message}\nReason: ${formData.reason}`;
    
    // WhatsApp API URL with the pre-filled message
    const whatsappUrl = `https://wa.me/7806844491?text=${encodeURIComponent(message)}`;

    // Redirect to WhatsApp with the pre-filled message
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
        <h1 style={{ color: 'white', margin: 0 }}>Contact Us</h1>
      </div>

      <Container className="mb-5">
        <h1 className="text-center my-5 hidden">Contact Form</h1>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg hidden">
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Why are you writing?</Form.Label>
                    <Form.Select
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a reason</option>
                      <option value="general">General inquiry</option>
                      <option value="membership">Membership inquiry</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="text-center">
                    <Button variant="primary" type="submit" size="lg" className="px-5 pulse-button">
                      Send Message
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

export default Contact;

