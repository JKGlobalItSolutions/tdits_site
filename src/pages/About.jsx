"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Container, Row, Col, Button, Image, Card } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"

function About() {
  const [isLoaded, setIsLoaded] = useState(false)
  const observerRef = useRef(null)
  const location = useLocation()

  const observerCallback = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show")
        entry.target.style.visibility = "visible"
      }
    })
  }, [])

  useEffect(() => {
    setIsLoaded(false)

    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [location.pathname])

  useEffect(() => {
    if (!isLoaded) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    })

    const timer = setTimeout(() => {
      const hiddenElements = document.querySelectorAll(".hidden")
      if (hiddenElements.length > 0) {
        hiddenElements.forEach((el) => {
          el.style.visibility = "hidden"
          observerRef.current.observe(el)
        })
      }
    }, 200)

    return () => {
      clearTimeout(timer)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [observerCallback, isLoaded])

  return (
    <div>
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

          .hover-image {
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          }

          .hover-image:hover {
            transform: scale(1.02);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          }
          
          .image-caption {
            font-size: 0.9rem;
            color: #666;
            text-align: center;
            margin-top: 0.5rem;
          }
          
          .section-spacing {
            margin-bottom: 5rem;
          }
          
          .leadership-card {
            background: linear-gradient(to right, #f8f9fa, #ffffff);
            border: none;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
        `}
      </style>

      {/* Banner Section */}
      <div
        className={`${isLoaded ? "fade-in" : ""}`}
        style={{
          backgroundImage: "url(/images/banner-without-content.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "100px 0",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "white", margin: 0 }}>About Us</h1>
      </div>

      {/* Main Content */}
      <Container className="my-5">
        {/* Who We Are Section */}
        <section className="section-spacing">
          <Row className="align-items-center">
            <Col md={6} className="p-2 hidden">
              <h2 className="mb-4">Who We Are</h2>
              <p>
                The <b>Tiruvannamalai</b> Development Information Technology Society <b>(TDITS)</b> is a hub for
                innovation, collaboration, and community development. We bring together like-minded individuals,
                businesses, and organizations to create a thriving ecosystem for growth and advancement. At TDITS, we
                aim to foster a culture of knowledge-sharing, technological progress, and community-driven initiatives
                that drive sustainable change.
              </p>
              <p>
                We believe in the power of collective action and work towards building a network that supports both
                professional development and societal growth. Through our events, workshops, and partnerships, we create
                a platform for individuals and businesses to enhance their capabilities and contribute to the
                development of our community.
              </p>
              <Link to="/contact">
                <Button variant="primary" className="mt-3">
                  Contact Us
                </Button>
              </Link>
            </Col>
            <Col md={6} className="hidden" style={{ transitionDelay: "0.2s" }}>
              <div className="position-relative">
                <Image
                  src="./Gallery/15.jpeg"
                  fluid
                  rounded
                  className="hover-image shadow-lg"
                  alt="TDITS Team at CONFED-ITA Tech Summit"
                />
                <p className="image-caption mt-2">TDITS Team at CONFED-ITA Tech Summit</p>
              </div>
            </Col>
          </Row>
        </section>

        {/* Leadership Section */}
        <section className="section-spacing">
          <h2 className="text-center mb-4 hidden">Our Leadership</h2>
          <Card className="leadership-card p-4 hidden">
            <Row className="align-items-center">
              <Col md={6}>
                <Image
                  src="./Gallery/6.jfif"
                  fluid
                  rounded
                  className="hover-image"
                  alt="TDITS Leadership at General Body Meeting"
                />
              </Col>
              <Col md={6}>
                <h3 className="mt-4 mt-md-0">Strong Leadership, Clear Vision</h3>
                <p>
                  Our leadership team brings together experienced professionals with diverse expertise in technology,
                  business, and community development. Led by our President and Executive Committee, TDITS is guided by
                  a clear vision to transform Tiruvannamalai into a hub of technological innovation and sustainable
                  growth.
                </p>
                <ul className="mt-3">
                  <li>Experienced leadership team</li>
                  <li>Commitment to excellence</li>
                  <li>Focus on community development</li>
                  <li>Transparent governance</li>
                </ul>
              </Col>
            </Row>
          </Card>
        </section>

        {/* Our Goals Section */}
        <section className="section-spacing">
          <Row className="align-items-center">
            <Col md={6} className="order-md-2 hidden">
              <h2 className="mb-4">Our Goals</h2>
              <p>At TDITS, we are driven by a passion for progress. Our goals include:</p>
              <ul>
                <li className="mb-3">
                  <b>Promoting technological literacy and access:</b> We focus on ensuring that technology is accessible
                  to everyone and that individuals are equipped with the skills to navigate the digital world.
                </li>
                <li className="mb-3">
                  <b>Providing platforms for professional networking:</b> By creating opportunities for collaboration
                  and partnerships, we help businesses and professionals build meaningful connections.
                </li>
                <li className="mb-3">
                  <b>Enhancing community well-being through impactful projects:</b> We are committed to supporting local
                  communities with projects that foster growth and contribute to their overall well-being.
                </li>
                <li className="mb-3">
                  <b>Building strong industry partnerships:</b> We collaborate with leading technology associations and
                  companies to bring the best opportunities to our members.
                </li>
              </ul>
            </Col>
            <Col md={6} className="order-md-1 hidden" style={{ transitionDelay: "0.2s" }}>
              <div className="position-relative">
                <Image
                  src="./Gallery/10.jpeg"
                  fluid
                  rounded
                  className="hover-image shadow-lg"
                  alt="TDITS Members Celebrating Achievement"
                />
                <p className="image-caption mt-2">TDITS Members Celebrating Achievement</p>
              </div>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  )
}

export default About

