"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Form, Table, Modal, Spinner } from "react-bootstrap"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage, auth } from "./firebase-config"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState({ title: "", description: "", date: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [user, setUser] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchEvents()
      } else {
        navigate("/login")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, "events")
      const eventsQuery = query(eventsCollection, orderBy("date", "desc"))
      const querySnapshot = await getDocs(eventsQuery)

      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate().toISOString().split("T")[0],
      }))

      setEvents(eventsData)
    } catch (error) {
      console.error("Error fetching events: ", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/login")
    } catch (error) {
      console.error("Error signing out: ", error)
    }
  }

  const handleShowModal = (event = null) => {
    if (event) {
      setCurrentEvent(event)
      setImagePreview(event.imageUrl || "")
      setIsEditing(true)
    } else {
      setCurrentEvent({ title: "", description: "", date: new Date().toISOString().split("T")[0] })
      setImagePreview("")
      setImageFile(null)
      setIsEditing(false)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setCurrentEvent({ title: "", description: "", date: "" })
    setImagePreview("")
    setImageFile(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentEvent({ ...currentEvent, [name]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let imageUrl = currentEvent.imageUrl || ""

      // Upload image if a new one is selected
      if (imageFile) {
        const storageRef = ref(storage, `events/${Date.now()}_${imageFile.name}`)
        const snapshot = await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      const eventData = {
        title: currentEvent.title,
        description: currentEvent.description,
        date: new Date(currentEvent.date),
        updatedAt: serverTimestamp(),
      }

      // Only add imageUrl if it exists
      if (imageUrl) {
        eventData.imageUrl = imageUrl
      }

      if (isEditing) {
        // Update existing event
        const eventRef = doc(db, "events", currentEvent.id)
        await updateDoc(eventRef, eventData)
      } else {
        // Add new event
        eventData.createdAt = serverTimestamp()
        await addDoc(collection(db, "events"), eventData)
      }

      handleCloseModal()
      fetchEvents()
    } catch (error) {
      console.error("Error saving event: ", error)
      alert("Failed to save event. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteDoc(doc(db, "events", id))
        fetchEvents()
      } catch (error) {
        console.error("Error deleting event: ", error)
        alert("Failed to delete event. Please try again.")
      }
    }
  }

  return (
    <>
      <style>
        {`
          .admin-header {
            background-color: #343a40;
            color: white;
            padding: 15px 0;
            margin-bottom: 30px;
          }
          
          .admin-container {
            padding: 20px;
          }
          
          .admin-card {
            margin-bottom: 30px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
          
          .admin-table {
            white-space: nowrap;
          }
          
          .admin-table td {
            vertical-align: middle;
          }
          
          .admin-image-preview {
            width: 100%;
            height: 200px;
            object-fit: cover;
            margin-bottom: 15px;
            border-radius: 5px;
            background-color: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .admin-image-preview img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          
          .truncate {
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        `}
      </style>

      <div className="admin-header">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">TDITS Admin Panel</h2>
            <div>
              {user && <span className="me-3">Logged in as: {user.email}</span>}
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="admin-container">
        <Card className="admin-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Manage Events</h4>
            <Button variant="primary" onClick={() => handleShowModal()}>
              Add New Event
            </Button>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-4">
                <p>No events found. Click "Add New Event" to create one.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td style={{ width: "100px" }}>
                          <img
                            src={event.imageUrl || "/images/leadership-summit.jpg"}
                            alt={event.title}
                            style={{ width: "80px", height: "50px", objectFit: "cover" }}
                          />
                        </td>
                        <td>{event.title}</td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td className="truncate">{event.description}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleShowModal(event)}
                          >
                            Edit
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Add/Edit Event Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Event" : "Add New Event"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={currentEvent.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Event Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={currentEvent.date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={currentEvent.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Image (Optional)</Form.Label>
                  <div className="admin-image-preview">
                    {imagePreview ? (
                      <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
                    ) : (
                      <div className="text-center text-muted">
                        <p>No image selected</p>
                        <small>Default image will be used</small>
                      </div>
                    )}
                  </div>
                  <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                  <Form.Text className="text-muted">
                    {isEditing && !imageFile
                      ? "Leave empty to keep the current image"
                      : "Leave empty to use default image"}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Event"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default AdminEvents

