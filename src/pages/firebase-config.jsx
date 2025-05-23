// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2G5q-io0CkM48d1yFSzhncFGXKvpG8sc",
  authDomain: "tdits-4b538.firebaseapp.com",
  projectId: "tdits-4b538",
  storageBucket: "tdits-4b538.firebasestorage.app",
  messagingSenderId: "607963336133",
  appId: "1:607963336133:web:f2a97701faba6845030fac",
  measurementId: "G-MZTDKYK9DX",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { app, db, auth, storage }

