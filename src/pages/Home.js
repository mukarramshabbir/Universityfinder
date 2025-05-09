"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { GraduationCap, Search, Bookmark, MessageSquare } from "lucide-react"

export default function Home() {
  const { currentUser } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {!currentUser ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <GraduationCap className="w-12 h-12 text-indigo-600" />
              <h1 className="text-5xl font-bold text-gray-900">UK University Finder</h1>
            </div>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Discover your perfect university match in the UK with our intelligent matching system
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300">
                <Search className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Your Match</h3>
                <p className="text-gray-600">Take our questionnaire to find universities that perfectly match your preferences</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300">
                <Bookmark className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Favorites</h3>
                <p className="text-gray-600">Bookmark your favorite universities and compare them side by side</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300">
                <MessageSquare className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Answers</h3>
                <p className="text-gray-600">Ask questions and get answers from our community of students and experts</p>
              </div>
            </div>

            <div className="space-x-4">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 border border-blue-600 text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition duration-200 shadow-lg hover:shadow-xl"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6">Welcome Back, {currentUser.username}!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Continue your university search journey
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <Link to="/questionnaire" className="block">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 rounded-xl text-white hover:shadow-lg transition-all transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold mb-4">Find Universities</h2>
                <p>Take our personalized questionnaire to discover your perfect university match</p>
              </div>
            </Link>
            <Link to="/questions" className="block">
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-8 rounded-xl text-white hover:shadow-lg transition-all transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold mb-4">Browse Questions</h2>
                <p>Explore and participate in discussions about universities</p>
              </div>
            </Link>
            <Link to="/questions" className="block">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-8 rounded-xl text-white hover:shadow-lg transition-all transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold mb-4">Ask Questions</h2>
                <p>Get answers from students and university representatives</p>
              </div>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="text-4xl font-bold text-blue-600 mb-2">{currentUser.bookmarks?.length || 0}</div>
              <h3 className="text-lg font-medium">Bookmarked Universities</h3>
              <Link to="/profile" className="text-blue-600 hover:underline text-sm mt-2 inline-block">View all →</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="text-4xl font-bold text-purple-600 mb-2">{currentUser.questionnaireTaken || 0}</div>
              <h3 className="text-lg font-medium">Times Taken Quiz</h3>
              <Link to="/questionnaire" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Take again →</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="text-4xl font-bold text-green-600 mb-2">{currentUser.questions?.length || 0}</div>
              <h3 className="text-lg font-medium">Questions Asked</h3>
              <Link to="/questions" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Ask a question →</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 