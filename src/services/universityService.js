import axios from "axios"

export async function fetchUniversityData() {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/universities`) // Adjust URL if needed
    console.log(response.data)
    return response.data.universities || [] // Assuming backend returns { universities: [...] }
  } catch (error) {
    console.error("Error fetching university data from MongoDB:", error)
    return []
  }
}


// Update the recommendUniversities function to handle the new preferences
export function recommendUniversities(universities, preferences) {
  if (!universities || universities.length === 0) {
    return []
  }

  // Calculate match score for each university
  const scoredUniversities = universities.map((university) => {
    let score = 0
    let maxPossibleScore = 0

    // Location preference - region
    if (preferences.locationRegion && preferences.locationRegion !== "Any Region") {
      maxPossibleScore += 3
      // Simple check if the university location contains the region name
      if (university.Location.toLowerCase().includes(preferences.locationRegion.toLowerCase())) {
        score += 3
      }
    }

    // Location preference - specific city
    if (preferences.location) {
      maxPossibleScore += 3
      if (university.Location.toLowerCase().includes(preferences.location.toLowerCase())) {
        score += 3
      }
    }

    // Tuition fee preference for undergraduate
    if (preferences.maxUgTuition && (preferences.studyLevel === "undergraduate" || preferences.studyLevel === "both")) {
      maxPossibleScore += 2
      const feeText = university.UG_Tuition_Fee
      const domesticFeeMatch = feeText.match(/£([\d,]+)/)
      if (domesticFeeMatch) {
        const fee = Number.parseInt(domesticFeeMatch[1].replace(",", ""))
        if (fee <= preferences.maxUgTuition) {
          score += 2
        }
      }
    }

    // Tuition fee preference for masters
    if (preferences.maxMastersTuition && (preferences.studyLevel === "masters" || preferences.studyLevel === "both")) {
      maxPossibleScore += 2
      const feeText = university.Masters_Tuition_Fee
      const domesticFeeMatch = feeText.match(/£([\d,]+)/)
      if (domesticFeeMatch) {
        const fee = Number.parseInt(domesticFeeMatch[1].replace(",", ""))
        if (fee <= preferences.maxMastersTuition) {
          score += 2
        }
      }
    }

    // On-campus accommodation
    if (preferences.onCampusAccommodation) {
      maxPossibleScore += 1
      if (university.On_Campus_Accommodation === "Yes") {
        score += 1
      }
    }

    // Exchange students acceptance
    if (preferences.exchangeProgram) {
      maxPossibleScore += 1
      if (university.Exchange_Students_Acceptance === "Yes") {
        score += 1
      }
    }

    // Ranking preference
    if (preferences.minRanking) {
      maxPossibleScore += 2
      const ranking = Number.parseInt(university.Ranking)
      if (!isNaN(ranking) && ranking <= preferences.minRanking) {
        score += 2
      }
    }

    // Research opportunities
    if (preferences.researchOpportunities) {
      maxPossibleScore += 1
      if (university.Research_Opportunities === "Yes") {
        score += 1
      }
    }

    // Scholarship availability
    if (preferences.scholarshipNeeded) {
      maxPossibleScore += 2
      if (university.Scholarship_Availability && university.Scholarship_Availability !== "No") {
        score += 2
      }
    }

    // Employment rate
    if (preferences.minEmploymentRate) {
      maxPossibleScore += 2
      const employmentRate = Number.parseInt(university.Employment_Rate_After_Graduation)
      if (!isNaN(employmentRate) && employmentRate >= preferences.minEmploymentRate) {
        score += 2
      }
    }

    // Student to faculty ratio
    if (preferences.studentFacultyRatio) {
      maxPossibleScore += 1
      const ratio = university.Student_to_Faculty_Ratio
      const numericRatio = Number.parseInt(ratio.split(":")[0])

      if (preferences.studentFacultyRatio === "low" && numericRatio <= 15) {
        score += 1
      } else if (preferences.studentFacultyRatio === "medium" && numericRatio > 15 && numericRatio <= 25) {
        score += 1
      } else if (preferences.studentFacultyRatio === "high" && numericRatio > 25) {
        score += 1
      }
    }

    // International student population
    if (preferences.internationalStudentPercentage) {
      maxPossibleScore += 1
      const population = university.International_Student_Population
      const percentage = Number.parseInt(population)

      if (preferences.internationalStudentPercentage === "low" && percentage < 15) {
        score += 1
      } else if (preferences.internationalStudentPercentage === "medium" && percentage >= 15 && percentage <= 30) {
        score += 1
      } else if (preferences.internationalStudentPercentage === "high" && percentage > 30) {
        score += 1
      }
    }

    // Club interests
    if (preferences.clubInterests && preferences.clubInterests.length > 0) {
      maxPossibleScore += 2
      let clubScore = 0
      const clubsText = university.Clubs_Societies || ""

      preferences.clubInterests.forEach((interest) => {
        if (clubsText.toLowerCase().includes(interest.toLowerCase())) {
          clubScore += 0.5 // Partial score for each matching interest
        }
      })

      // Cap the club score at 2
      score += Math.min(clubScore, 2)
    }

    // Calculate percentage match (if no preferences were set, default to 0)
    const normalizedScore = maxPossibleScore > 0 ? score / maxPossibleScore : 0

    return {
      ...university,
      score: normalizedScore,
    }
  })

  // Sort by score (highest first)
  return scoredUniversities.sort((a, b) => b.score - a.score)
}
