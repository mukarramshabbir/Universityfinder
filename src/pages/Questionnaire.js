"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { fetchUniversityData, recommendUniversities } from "../services/universityService"
import { useAuth } from "../contexts/AuthContext"

function Questionnaire() {
  const navigate = useNavigate()
  const { currentUser, updateUser } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [universities, setUniversities] = useState([])
  const [preferences, setPreferences] = useState({
    location: "",
    locationRegion: "",
    maxUgTuition: "",
    maxMastersTuition: "",
    onCampusAccommodation: false,
    exchangeProgram: false,
    minRanking: "",
    researchOpportunities: false,
    scholarshipNeeded: false,
    minEmploymentRate: "",
    studentFacultyRatio: "",
    internationalStudentPercentage: "",
    clubInterests: [],
    studyLevel: "undergraduate",
  })
  const [results, setResults] = useState([])

  // UK regions for dropdown
  const ukRegions = [
    "Any Region",
    "London",
    "South East",
    "South West",
    "East of England",
    "East Midlands",
    "West Midlands",
    "Yorkshire and the Humber",
    "North East",
    "North West",
    "Scotland",
    "Wales",
    "Northern Ireland",
  ]

  // Common club categories
  const clubCategories = [
    "Sports",
    "Arts & Culture",
    "Academic",
    "Community Service",
    "Technology",
    "Business",
    "Media",
    "International",
    "Religious",
    "Political",
  ]

  useEffect(() => {
    async function loadData() {
      const data = await fetchUniversityData()
      console.log("Fetched Universities:", data) 
      setUniversities(data)
      setLoading(false)
    }

    loadData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setPreferences({
      ...preferences,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleClubInterestChange = (category) => {
    const updatedInterests = [...preferences.clubInterests]

    if (updatedInterests.includes(category)) {
      // Remove if already selected
      const index = updatedInterests.indexOf(category)
      updatedInterests.splice(index, 1)
    } else {
      // Add if not selected
      updatedInterests.push(category)
    }

    setPreferences({
      ...preferences,
      clubInterests: updatedInterests,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const recommended = recommendUniversities(universities, preferences)
      setResults(recommended)
      
      // Update user's questionnaire count and save preferences
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          questionnaireTaken: (currentUser.questionnaireTaken || 0) + 1,
          lastQuestionnairePreferences: preferences, // Save the preferences
          lastQuestionnaireDate: new Date().toISOString() // Save the date
        }
        await updateUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
      
      setStep(5)
    } catch (error) {
      console.error("Error getting recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Loading... ⏳</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect University 🎓</h1>
          <p className="text-xl text-gray-600">Answer a few questions to discover universities that match your preferences</p>
        </div>

        {step < 5 && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex-1">
                  <div className={`h-2 rounded-full ${step >= stepNum ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`text-sm font-medium mt-2 ${step >= stepNum ? 'text-blue-600' : 'text-gray-400'}`}>
                    {stepNum === 1 && 'Location 🌍'}
                    {stepNum === 2 && 'Finances 💰'}
                    {stepNum === 3 && 'Facilities 🏫'}
                    {stepNum === 4 && 'Academics 📚'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Preferences 🌍</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Region in the UK 🗺️</label>
                  <select
                    name="locationRegion"
                    value={preferences.locationRegion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    {ukRegions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Specific City (Optional) 🏙️</label>
                  <input
                    type="text"
                    name="location"
                    value={preferences.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="e.g., London, Manchester, Edinburgh"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Study Level 📝</label>
                  <select
                    name="studyLevel"
                    value={preferences.studyLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="undergraduate">Undergraduate 🎓</option>
                    <option value="masters">Masters 🎓🎓</option>
                    <option value="both">Both Undergraduate and Masters 🎓🎓🎓</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">International Student Population 🌎</label>
                  <select
                    name="internationalStudentPercentage"
                    value={preferences.internationalStudentPercentage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">No preference</option>
                    <option value="low">Low (Less than 15%) 🧑‍🎓</option>
                    <option value="medium">Medium (15-30%) 🧑‍🎓🧑‍🎓</option>
                    <option value="high">High (More than 30%) 🧑‍🎓🧑‍🎓🧑‍🎓</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Considerations 💰</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Maximum Undergraduate Tuition Fee 💷</label>
                  <select
                    name="maxUgTuition"
                    value={preferences.maxUgTuition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">No preference</option>
                    <option value="9250">Up to £9,250 (Standard UK/EU fee)</option>
                    <option value="15000">Up to £15,000</option>
                    <option value="20000">Up to £20,000</option>
                    <option value="25000">Up to £25,000</option>
                    <option value="30000">Up to £30,000</option>
                  </select>
                </div>

                {(preferences.studyLevel === "masters" || preferences.studyLevel === "both") && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Maximum Masters Tuition Fee 💷💷</label>
                    <select
                      name="maxMastersTuition"
                      value={preferences.maxMastersTuition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    >
                      <option value="">No preference</option>
                      <option value="10000">Up to £10,000</option>
                      <option value="15000">Up to £15,000</option>
                      <option value="20000">Up to £20,000</option>
                      <option value="25000">Up to £25,000</option>
                      <option value="30000">Up to £30,000</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="scholarshipNeeded"
                    checked={preferences.scholarshipNeeded}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                  />
                  <label className="text-sm font-medium text-gray-700">Scholarship availability is important 🏆</label>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Facilities & Programs 🏫</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="onCampusAccommodation"
                    checked={preferences.onCampusAccommodation}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                  />
                  <label className="text-sm font-medium text-gray-700">On-campus accommodation is important 🏠</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="exchangeProgram"
                    checked={preferences.exchangeProgram}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                  />
                  <label className="text-sm font-medium text-gray-700">Exchange program availability is important ✈️</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="researchOpportunities"
                    checked={preferences.researchOpportunities}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                  />
                  <label className="text-sm font-medium text-gray-700">Research opportunities are important 🔬</label>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Clubs & Societies Interests 🎭</label>
                  <div className="grid grid-cols-2 gap-3">
                    {clubCategories.map((category) => (
                      <label
                        key={category}
                        className={`flex items-center space-x-2 p-3 rounded-lg border transition duration-200 cursor-pointer ${
                          preferences.clubInterests.includes(category)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={preferences.clubInterests.includes(category)}
                          onChange={() => handleClubInterestChange(category)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                        />
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Academics & Career 📚</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">University Ranking Preference 🏆</label>
                  <select
                    name="minRanking"
                    value={preferences.minRanking}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">No preference</option>
                    <option value="10">Top 10</option>
                    <option value="20">Top 20</option>
                    <option value="50">Top 50</option>
                    <option value="100">Top 100</option>
                    <option value="150">Top 150</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Minimum Employment Rate After Graduation 💼</label>
                  <select
                    name="minEmploymentRate"
                    value={preferences.minEmploymentRate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">No preference</option>
                    <option value="70">At least 70%</option>
                    <option value="75">At least 75%</option>
                    <option value="80">At least 80%</option>
                    <option value="85">At least 85%</option>
                    <option value="90">At least 90%</option>
                    <option value="95">At least 95%</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Student to Faculty Ratio 👨‍🏫</label>
                  <select
                    name="studentFacultyRatio"
                    value={preferences.studentFacultyRatio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">No preference</option>
                    <option value="low">Low ratio (better individual attention) 👨‍🏫👩‍🎓</option>
                    <option value="medium">Medium ratio 👨‍🏫👩‍🎓👩‍🎓</option>
                    <option value="high">High ratio (larger classes) 👨‍🏫👩‍🎓👩‍🎓👩‍🎓</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🎉 Your Recommended Universities</h2>

              {results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 mb-4">No universities match your criteria. Try adjusting your preferences. 😕</p>
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                  >
                    Start Over 🔄
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {results.slice(0, 5).map((university) => (
                    <div
                      key={university._id}
                      className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-900">{university.Name} 🏛️</h3>
                          <div className="space-y-1 text-gray-600">
                            <p className="flex items-center">
                              <span className="mr-2">📍</span>
                              {university.Location}
                            </p>
                            <p className="flex items-center">
                              <span className="mr-2">🏆</span>
                              Ranking: {university.Ranking}
                            </p>
                            <p className="flex items-center">
                              <span className="mr-2">💰</span>
                              UG Tuition: {university.UG_Tuition_Fee}
                            </p>
                            <p className="flex items-center">
                              <span className="mr-2">💼</span>
                              Employment Rate: {university.Employment_Rate_After_Graduation}%
                            </p>
                          </div>
                        </div>
                        <div className="bg-blue-100 text-blue-800 font-bold rounded-full h-20 w-20 flex items-center justify-center text-center p-2">
                          {Math.round(university.score * 100)}%
                          <br />
                          Match
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => navigate(`/university/${university._id}`)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                        >
                          View Details
                          <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition duration-200"
                >
                  Start Over 🔄
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                >
                  Back to Dashboard 🏠
                </button>
              </div>
            </div>
          )}

          {step < 5 && (
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg ${
                  step === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                } transition duration-200`}
              >
                ⬅️ Previous
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                >
                  Next ➡️
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition duration-200"
                >
                  Get Recommendations 🔍
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Questionnaire
