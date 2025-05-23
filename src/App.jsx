import { Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import About from "./pages/About"
import Gallery from "./pages/Gallery"
import Events from "./pages/Events"
import Membership from "./pages/Membership"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import AdminEvents from "./pages/AdminEvents"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  // Check if the current path is an admin route
  const isAdminRoute = () => {
    return window.location.pathname.startsWith("/admin")
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Only show Header and Footer for non-admin routes */}
      {!isAdminRoute() && <Header />}

      <main className={`flex-grow-1 ${isAdminRoute() ? "p-0" : ""}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/events" element={<Events />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/admin" element={<Navigate to="/admin/events" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!isAdminRoute() && <Footer />}
    </div>
  )
}

export default App

