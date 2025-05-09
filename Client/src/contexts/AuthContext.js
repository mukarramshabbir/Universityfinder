"use client"

import { createContext, useContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Create admin user if it doesn't exist
    const storedUsers = JSON.parse(localStorage.getItem("users")) || []
    const adminUser = {
      id: 1,
      username: "admin",
      email: "admin@admin.com",
      password: "admin",
      bookmarks: [],
      isAdmin: true
    }

    // Check if admin exists, if not add it
    if (!storedUsers.some(user => user.username === "admin")) {
      const updatedUsers = [adminUser]
      setUsers(updatedUsers)
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    } else {
      setUsers(storedUsers)
    }

    const storedUser = JSON.parse(localStorage.getItem("currentUser"))
    if (storedUser) {
      setCurrentUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    )
    if (user) {
      setCurrentUser(user)
      localStorage.setItem("currentUser", JSON.stringify(user))
      return true
    }
    return false
  }

  const register = (username, email, password) => {
    if (users.some((u) => u.username === username)) {
      return false
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      bookmarks: [],
      isAdmin: false
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setCurrentUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
  }

  const updateUser = (updatedUserData) => {
    setCurrentUser(updatedUserData)
    localStorage.setItem("currentUser", JSON.stringify(updatedUserData))
    
    const updatedUsers = users.map(user => 
      user.id === updatedUserData.id ? updatedUserData : user
    )
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
  }

  const deleteUser = (userId) => {
    if (!currentUser?.isAdmin) return false
    
    const updatedUsers = users.filter(user => user.id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    
    if (currentUser.id === userId) {
      logout()
    }
    return true
  }

  const value = {
    currentUser,
    users,
    login,
    register,
    logout,
    updateUser,
    deleteUser
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
