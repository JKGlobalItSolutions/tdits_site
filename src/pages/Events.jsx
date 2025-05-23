"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Container, Row, Col, Card, Pagination, Spinner } from "react-bootstrap"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "./firebase-config"
import { useLocation } from "react-router-dom"

function Events() {
  const eventsPerPage = 9 // Updated to show 9 events per page
  const [activePage, setActivePage] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const observerRef = useRef(null)
  const location = useLocation()

  // Reset states when location changes
  useEffect(() => {
    setIsLoaded(false)
    setLoading(true)

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [location.pathname])

  useEffect(() => {
    let isMounted = true

    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "events")
        const eventsQuery = query(eventsCollection, orderBy("date", "desc"))
        const querySnapshot = await getDocs(eventsQuery)

        if (isMounted) {
          const eventsData = querySnapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              ...data,
              date: data.date.toDate().toLocaleDateString(),
              imageUrl: data.imageUrl || "/images/leadership-summit.jpg", // Use default image if none provided
            }
          })

          setEvents(eventsData)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching events: ", error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchEvents()

    return () => {
      isMounted = false
    }
  }, [location.pathname])

  const totalPages = Math.ceil(events.length / eventsPerPage)
  const currentEvents = events.slice((activePage - 1) * eventsPerPage, activePage * eventsPerPage)

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber)
    setAnimationKey((prevKey) => prevKey + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
  }, [observerCallback, isLoaded, events, loading, animationKey, location.pathname])

  // Function to render pagination numbers intelligently
  const renderPaginationItems = () => {
    const items = []

    // If few enough pages, show all
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <Pagination.Item key={i} active={activePage === i} onClick={() => handlePageChange(i)}>
            {i}
          </Pagination.Item>,
        )
      }
      return items
    }

    // Show first page
    items.push(
      <Pagination.Item key={1} active={activePage === 1} onClick={() => handlePageChange(1)}>
        1
      </Pagination.Item>,
    )

    // Calculate range around current page
    let startPage = Math.max(2, activePage - 1)
    let endPage = Math.min(totalPages - 1, activePage + 1)

    // Adjust for edge cases
    if (activePage <= 3) {
      endPage = Math.min(4, totalPages - 1)
    } else if (activePage >= totalPages - 2) {
      startPage = Math.max(totalPages - 3, 2)
    }

    // Add ellipsis if needed
    if (startPage > 2) {
      items.push(<Pagination.Ellipsis key="ellipsis1" />)
    }

    // Add pages in the middle
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item key={i} active={activePage === i} onClick={() => handlePageChange(i)}>
          {i}
        </Pagination.Item>,
      )
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      items.push(<Pagination.Ellipsis key="ellipsis2" />)
    }

    // Show last page
    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={activePage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>,
      )
    }

    return items
  }

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

          .hover-card {
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          }

          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .loader {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
          }

          .loader-spinner {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #0d6efd;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .empty-events {
            min-height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          
          .pagination-container {
            display: flex;
            justify-content: center;
            margin-top: 2rem;
          }
          
          /* Make sure events container has minimum height */
          .events-container {
            min-height: 600px;
          }
        `}
      </style>

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
        <h1 style={{ color: "white", margin: 0 }}>Events</h1>
      </div>

      <Container className="my-5 events-container">
        {loading ? (
          <div className="loader">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-events text-center">
            <h3>No events found</h3>
            <p>Check back later for upcoming events.</p>
          </div>
        ) : (
          <>
            <Row className="g-4" key={animationKey}>
              {currentEvents.map((event, index) => (
                <Col
                  key={event.id}
                  md={6}
                  lg={4}
                  className="hidden mb-4"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <Card className="h-100 shadow-lg hover-card">
                    <Card.Img
                      variant="top"
                      src={event.imageUrl || "/images/leadership-summit.jpg"}
                      alt={event.title}
                      style={{ height: "200px", objectFit: "cover" }}
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
                </Col>
              ))}
            </Row>

            {totalPages > 1 && (
              <div className="pagination-container">
                <Pagination>
                  <Pagination.First onClick={() => handlePageChange(1)} disabled={activePage === 1} />
                  <Pagination.Prev
                    onClick={() => handlePageChange(Math.max(activePage - 1, 1))}
                    disabled={activePage === 1}
                  />

                  {renderPaginationItems()}

                  <Pagination.Next
                    onClick={() => handlePageChange(Math.min(activePage + 1, totalPages))}
                    disabled={activePage === totalPages}
                  />
                  <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={activePage === totalPages} />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  )
}

export default Events

