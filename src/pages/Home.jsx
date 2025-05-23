"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import { Container, Row, Col, Button, Image, Card, Spinner } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "./firebase-config"

const EventCard = React.memo(({ event }) => (
  <Card className="h-100 shadow-lg hover-card">
    <Card.Img
      variant="top"
      src={event.imageUrl || "/images/leadership-summit.jpg"}
      alt={event.title}
      style={{ height: "200px", objectFit: "cover" }}
      loading="lazy"
      onError={(e) => {
        e.target.onerror = null
        e.target.src = "/images/leadership-summit.jpg"
      }}
    />
    <Card.Body>
      <Card.Title>{event.title}</Card.Title>
      <small className="text-muted d-block mb-2">{event.date}</small>
      <Card.Text>{event.description}</Card.Text>
    </Card.Body>
  </Card>
))

function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const observerRef = useRef(null)
  const location = useLocation()

  // Reset states when location changes
  useEffect(() => {
    setIsLoaded(false)
    setLoadingEvents(true)

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [location.pathname])

  // Fetch events from Firebase
  useEffect(() => {
    let isMounted = true

    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "events")
        const eventsQuery = query(eventsCollection, orderBy("date", "desc"), limit(3))
        const querySnapshot = await getDocs(eventsQuery)

        if (isMounted) {
          if (!querySnapshot.empty) {
            const eventsData = querySnapshot.docs.map((doc) => {
              const data = doc.data()
              return {
                id: doc.id,
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl || "/images/leadership-summit.jpg",
                date: data.date ? data.date.toDate().toLocaleDateString() : "Upcoming",
              }
            })

            setEvents(eventsData)
          } else {
            // Fallback events if no events in Firebase
            setEvents([
              {
                id: "fallback1",
                title: "Leadership Summit 2024",
                date: "February 10, 2024",
                description:
                  "Join us for an inspiring day of leadership development, networking, and professional growth.",
                imageUrl: "/images/leadership-summit.jpg",
              },
              {
                id: "fallback2",
                title: "Business Networking Gala",
                date: "March 15, 2024",
                description:
                  "An exclusive evening for business leaders to connect, collaborate, and celebrate success.",
                imageUrl: "/images/leadership-summit.jpg",
              },
              {
                id: "fallback3",
                title: "Tech Innovation Showcase",
                date: "April 5, 2024",
                description:
                  "Explore cutting-edge technologies and innovative solutions from local tech startups and established companies.",
                imageUrl: "/images/leadership-summit.jpg",
              },
            ])
          }
          setLoadingEvents(false)
        }
      } catch (error) {
        console.error("Error fetching events: ", error)
        // Use fallback events if there's an error
        if (isMounted) {
          setEvents([
            {
              id: "fallback1",
              title: "Leadership Summit 2024",
              date: "February 10, 2024",
              description:
                "Join us for an inspiring day of leadership development, networking, and professional growth.",
              imageUrl: "/images/leadership-summit.jpg",
            },
            {
              id: "fallback2",
              title: "Business Networking Gala",
              date: "March 15, 2024",
              description: "An exclusive evening for business leaders to connect, collaborate, and celebrate success.",
              imageUrl: "/images/leadership-summit.jpg",
            },
            {
              id: "fallback3",
              title: "Tech Innovation Showcase",
              date: "April 5, 2024",
              description:
                "Explore cutting-edge technologies and innovative solutions from local tech startups and established companies.",
              imageUrl: "/images/leadership-summit.jpg",
            },
          ])
          setLoadingEvents(false)
        }
      }
    }

    fetchEvents()

    return () => {
      isMounted = false
    }
  }, [location.pathname])

  const observerCallback = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show")
        entry.target.style.visibility = "visible"
      }
    })
  }, [])

  // Setup intersection observer
  useEffect(() => {
    if (!isLoaded) return

    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    })

    // Small delay to ensure DOM elements are ready
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
  }, [observerCallback, isLoaded, events, loadingEvents, location.pathname])

  return (
    <Container fluid className="p-0">
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

          .banner-image {
            transition: transform 8s ease-in-out;
          }

          .banner-image:hover {
            transform: scale(1.05);
          }

          .pulse-button {
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
          }

          .hover-card {
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          }

          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .stagger-animation > * {
            opacity: 0;
            transform: translateY(30px);
          }

          .stagger-animation.show > * {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          }

          .stagger-animation.show > *:nth-child(1) { transition-delay: 0.1s; }
          .stagger-animation.show > *:nth-child(2) { transition-delay: 0.2s; }
          .stagger-animation.show > *:nth-child(3) { transition-delay: 0.3s; }

          .events-loader {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 300px;
          }
        `}
      </style>

      <Image
        src="/images/banner.jpg"
        className={`py-2 img-fluid banner-image ${isLoaded ? "fade-in" : ""}`}
        alt="TDITS Banner"
        rounded
        loading="eager"
      />

      <Container>
        <section className="my-5">
          <Row className="align-items-center hidden">
            <Col md={6}>
              <Image
                src="./Gallery/1.jpeg"
                className="p-2 img-fluid rounded shadow-lg"
                alt="TDITS General Body Meeting - Our Team"
                loading="lazy"
              />
              <small className="d-block text-center text-muted mt-2">TDITS 1st General Body Meeting - 2024</small>
            </Col>
            <Col md={6}>
              <h2>About TDITS</h2>
              <p>
                The <b>Tiruvannamalai</b> District Information Technology Society <b>(TDITS)</b> is a hub for
                innovation, collaboration, and community development. We bring together like-minded individuals,
                businesses, and organizations to create a thriving ecosystem for growth and advancement.
              </p>
              <p>
                We believe in the power of collective action and work towards building a network that supports both
                professional development and societal growth.
              </p>
              <Button variant="primary" as={Link} to="/about" className="mt-3 pulse-button">
                Learn More
              </Button>
            </Col>
          </Row>
        </section>

        <section className="my-5">
          <h2 className="text-center mb-4 hidden">Upcoming Events</h2>
          {loadingEvents ? (
            <div className="events-loader">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading events...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <Row className="g-4 stagger-animation hidden">
                {events.map((event) => (
                  <Col key={event.id} md={6} lg={4}>
                    <EventCard event={event} />
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-4">
                <Button variant="outline-primary" as={Link} to="/events">
                  View All Events
                </Button>
              </div>
            </>
          )}
        </section>
      </Container>
    </Container>
  )
}

export default Home

