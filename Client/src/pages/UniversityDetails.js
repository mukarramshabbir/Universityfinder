"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { fetchUniversityData } from "../services/universityService"
import { useAuth } from "../contexts/AuthContext"
import { Bookmark, BookmarkCheck } from "lucide-react"

function UniversityDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, updateUser } = useAuth()
  const [university, setUniversity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchUniversityData()
        
        
        const foundUniversity = data.find(uni => String(uni._id) === id)
        
        if (foundUniversity) {
          setUniversity(foundUniversity)
          setIsBookmarked(currentUser?.bookmarks?.includes(foundUniversity._id) || false)
        } else {
          setError("University not found")
        }
        setLoading(false)
      } catch (err) {
        setError("Failed to load university data")
        setLoading(false)
      }
    }

    loadData()
  }, [id, currentUser])

  const toggleBookmark = async () => {
    if (!currentUser) {
      navigate("/login")
      return
    }

    const bookmarks = currentUser.bookmarks || []
    const universityId = String(university._id)
    let newBookmarks

    if (isBookmarked) {
      // Remove bookmark
      newBookmarks = bookmarks.filter(id => id !== universityId)
    } else {
      // Add bookmark
      newBookmarks = [...bookmarks, universityId]
    }

    // Update user's bookmarks
    await updateUser({ ...currentUser, bookmarks: newBookmarks })
    setIsBookmarked(!isBookmarked)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Loading... ⏳</div>
      </div>
    )
  }

  if (error || !university) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || "University not found"} 😕
      </div>
    )
  }

  // Parse clubs and societies
  const clubs = university.Clubs_Societies ? university.Clubs_Societies.split(",").map((club) => club.trim()) : []

  // Parse scholarships
  const scholarships = university.Scholarship_Availability
    ? university.Scholarship_Availability.split(",").map((scholarship) => scholarship.trim())
    : []

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-64 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-6xl">🏛️</span>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{university.Name}</h1>
                <p className="text-xl text-gray-600">📍 {university.Location}</p>
              </div>
              <button
                onClick={toggleBookmark}
                className={`inline-flex items-center px-4 py-2 rounded-lg transition duration-150 ease-in-out ${
                  isBookmarked
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isBookmarked ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    Bookmarked
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    Bookmark
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">📊 Key Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="w-32 text-gray-600">🏆 Ranking</span>
                    <span className="font-medium">{university.Ranking}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-600">👨‍🏫 Student to Faculty</span>
                    <span className="font-medium">{university.Student_to_Faculty_Ratio}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-600">💼 Employment Rate</span>
                    <span className="font-medium">{university.Employment_Rate_After_Graduation}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-600">🌎 International Students</span>
                    <span className="font-medium">{university.International_Student_Population}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-600">🏠 On-Campus Housing</span>
                    <span className="font-medium">{university.On_Campus_Accommodation}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-600">🔬 Research</span>
                    <span className="font-medium">{university.Research_Opportunities}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-600">✈️ Exchange Program</span>
                    <span className="font-medium">{university.Exchange_Students_Acceptance}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">💰 Tuition & Financial Aid</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="w-32 text-gray-600">🎓 Undergraduate</span>
                    <span className="font-medium">{university.UG_Tuition_Fee}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-600">🎓🎓 Masters</span>
                    <span className="font-medium">{university.Masters_Tuition_Fee}</span>
                  </div>
                </div>

                {scholarships.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">🏆 Scholarships</h3>
                    <ul className="space-y-2">
                      {scholarships.map((scholarship, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">•</span>
                          {scholarship}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {clubs.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">🎭 Clubs & Societies</h2>
                <div className="flex flex-wrap gap-2">
                  {clubs.map((club, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {club}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center space-x-4">
              <Link
                to="/questionnaire"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out"
              >
                Find More Universities
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <button
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out"
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(university.Name)}`, "_blank")}
              >
                Visit Website
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UniversityDetails
