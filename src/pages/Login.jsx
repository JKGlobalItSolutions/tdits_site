"use client"

import { useState } from "react"
import { Card, Form, Button, Alert } from "react-bootstrap"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "./firebase-config"
import { useNavigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/admin/events")
    } catch (error) {
      console.error("Error signing in: ", error)
      setError("Failed to sign in. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>
        {`
          .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f8f9fa;
            padding: 20px;
          }
          
          .login-card {
            max-width: 450px;
            width: 100%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: none;
          }
          
          .login-header {
            background-color: #0d6efd;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0.375rem 0.375rem 0 0;
          }
          
          .login-form {
            padding: 30px;
          }
          
          .login-button {
            width: 100%;
            padding: 10px;
            margin-top: 20px;
          }
        `}
      </style>

      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <h2>TDITS Admin Login</h2>
            <p className="mb-0">Sign in to manage events</p>
          </div>
          <Card.Body className="login-form">
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="login-button" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default Login

