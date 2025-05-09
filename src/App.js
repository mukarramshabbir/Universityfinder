"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { QuestionsProvider } from "./contexts/QuestionsContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Questionnaire from "./pages/Questionnaire"
import UniversityDetails from "./pages/UniversityDetails"
import Profile from "./pages/Profile"
import Bookmarks from "./pages/Bookmarks"
import Questions from "./pages/Questions"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Admin from "./pages/Admin"
import UniversityList from './pages/UniversityList';
import "./App.css"

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <QuestionsProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-8 px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/questionnaire"
                  element={
                    <ProtectedRoute>
                      <Questionnaire />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/:id"
                  element={
                    <ProtectedRoute>
                      <UniversityDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookmarks"
                  element={
                    <ProtectedRoute>
                      <Bookmarks />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/allUniversity"
                  element={
                    <ProtectedRoute>
                      <UniversityList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/questions"
                  element={
                    <ProtectedRoute>
                      <Questions />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </div>
          </div>
        </Router>
      </QuestionsProvider>
    </AuthProvider>
  )
}

export default App
