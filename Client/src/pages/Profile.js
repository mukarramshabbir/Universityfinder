"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { fetchUniversityData } from "../services/universityService"
import { Link } from "react-router-dom"

export default function Profile() {
  const { currentUser, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookmarkedUniversities, setBookmarkedUniversities] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  })

  useEffect(() => {
    if (!currentUser) {
      navigate("/login")
      return
    }

    setFormData({
      username: currentUser.username,
      email: currentUser.email,
    })

    const loadBookmarkedUniversities = async () => {
      try {
        const data = await fetchUniversityData()
        const bookmarked = data.filter(university => 
          currentUser.bookmarks.includes(university._id)
        )
        setBookmarkedUniversities(bookmarked)
      } catch (err) {
        setError("Failed to load bookmarked universities")
      } finally {
        setLoading(false)
      }
    }

    loadBookmarkedUniversities()
  }, [currentUser, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!formData.username || !formData.email) {
      setError("Please fill in all fields")
      return
    }

    const updatedUser = {
      ...currentUser,
      username: formData.username,
      email: formData.email
    }

    if (updateUser(updatedUser)) {
      setEditMode(false)
    } else {
      setError("Failed to update profile")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                <p className="mt-1 text-lg text-gray-600">Manage your account and bookmarks</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                  {editMode ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Username</p>
                        <p className="mt-1 text-lg text-gray-900">{currentUser.username}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1 text-lg text-gray-900">{currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => setEditMode(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                      >
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Statistics</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Questionnaire Taken</p>
                      <p className="mt-1 text-2xl font-semibold text-blue-600">{currentUser.questionnaireTaken || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Bookmarks</p>
                      <p className="mt-1 text-2xl font-semibold text-blue-600">{bookmarkedUniversities.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Bookmarked Universities</h2>
                  {bookmarkedUniversities.length > 0 ? (
                    <div className="space-y-4">
                      {bookmarkedUniversities.map((university) => (
                        <div
                          key={university._id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200"
                        >
                          <Link to={`/university/${university._id}`} className="block">
                            <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition duration-200">
                              {university.Name}
                            </h3>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <span className="mr-4 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {university.Location}
                              </span>
                              {university.Ranking && (
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  #{university.Ranking}
                                </span>
                              )}
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No bookmarks yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Start by taking the questionnaire to find universities that match your preferences.</p>
                      <div className="mt-6">
                        <Link
                          to="/questionnaire"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                        >
                          Take Questionnaire
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
