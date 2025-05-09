import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { GraduationCap, LogOut } from "lucide-react";
import { useAuth } from "./AuthContext";

const UniversityFinder = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [scores, setScores] = useState({});
  const [recommendedUniversities, setRecommendedUniversities] = useState([]);
  const [questions, setQuestions] = useState({
    location: "",
    domain: "",
    scholarship: "",
    research: "",
    societies: "",
    internationalSupport: "",
    ranking: "",
  });

  const [locations, setLocations] = useState([]);
  const [domains, setDomains] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    Papa.parse("/universities.csv", {
      download: true,
      header: true,
      complete: (result) => {
        if (!result.data || result.data.length === 0) return;

        const cleanedData = result.data.filter((row) => row["University Name"]); // Ensuring non-empty rows
        setData(cleanedData);

        setLocations([...new Set(cleanedData.map((row) => row.Location))]);
        setDomains([...new Set(cleanedData.map((row) => row["Educational Domains"]))]);
        setScholarships([...new Set(cleanedData.map((row) => row["Scholarships Available"]))]);
        setSocieties([...new Set(cleanedData.map((row) => row.Societies))]);
        setRankings([...new Set(cleanedData.map((row) => row.Rankings))]);

        const initialScores = {};
        cleanedData.forEach((row) => {
          initialScores[row["University Name"]] = 0;
        });
        setScores(initialScores);
      },
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestions((prev) => ({ ...prev, [name]: value }));
  };

  const calculateScores = () => {
    if (!data.length) return;

    const newScores = { ...scores };
    const maxPossibleScore = 7;

    data.forEach((row) => {
      let score = 0;

      if (row.Location && row.Location === questions.location) score += 1;
      if (row["Educational Domains"] && row["Educational Domains"] === questions.domain) score += 1;
      if (
        questions.scholarship === "yes" &&
        row["Scholarships Available"] &&
        row["Scholarships Available"].toLowerCase().includes("merit")
      )
        score += 1;
      if (
        questions.research === "yes" &&
        row["Research Opportunities"] &&
        row["Research Opportunities"].toLowerCase().includes("research")
      )
        score += 1;
      if (row.Societies && row.Societies === questions.societies) score += 1;
      if (
        row["International Support"] &&
        row["International Support"].toLowerCase() === questions.internationalSupport.toLowerCase()
      )
        score += 1;
      if (row.Rankings && row.Rankings.toString() === questions.ranking.toString()) score += 1;

      const matchPercentage = (score / maxPossibleScore) * 100;
      newScores[row["University Name"]] = matchPercentage;
    });

    setScores(newScores);
    recommendUniversities(newScores);
  };

  const recommendUniversities = (scores) => {
    const sortedUniversities = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, score]) => ({ name, score }));

    setRecommendedUniversities(sortedUniversities);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const prevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const questionComponents = [
    { label: "Preferred Location", name: "location", options: locations },
    { label: "Educational Domain", name: "domain", options: domains },
    { label: "Need Scholarships?", name: "scholarship", options: ["yes", "no"] },
    { label: "Research Opportunities Important?", name: "research", options: ["yes", "no"] },
    { label: "Preferred Societies", name: "societies", options: societies },
    { label: "Need International Support?", name: "internationalSupport", options: ["yes", "no"] },
    { label: "Preferred Ranking", name: "ranking", options: rankings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">University Finder</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Find Your Perfect University</h2>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            {questionComponents[currentQuestionIndex].label}
          </label>
          <select
            name={questionComponents[currentQuestionIndex].name}
            value={questions[questionComponents[currentQuestionIndex].name]}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Option</option>
            {questionComponents[currentQuestionIndex].options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="flex justify-between mt-8">
            <button onClick={prevQuestion} disabled={currentQuestionIndex === 0} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">
              Previous
            </button>
            {currentQuestionIndex < questionComponents.length - 1 ? (
              <button onClick={nextQuestion} className="bg-indigo-600 text-white py-2 px-4 rounded-lg">
                Next
              </button>
            ) : (
              <button onClick={calculateScores} className="bg-indigo-600 text-white py-2 px-4 rounded-lg">
                Find My University Match
              </button>
            )}
          </div>

          {/* Display Recommended Universities */}
          {recommendedUniversities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Universities</h2>
              <div className="space-y-4">
                {recommendedUniversities.map((uni, index) => (
                  <div key={index} className="p-4 bg-indigo-50 rounded-lg">
                    <h3 className="text-lg font-bold text-indigo-600">{uni.name}</h3>
                    <p className="text-gray-600">Match Score: {uni.score.toFixed(2)}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityFinder;