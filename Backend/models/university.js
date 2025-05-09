const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    Name: String,
    Location: String,
    UG_Tuition_Fee: String,
    Masters_Tuition_Fee: String,
    Scholarship_Availability: String,
    educationalDomains: String,
    Clubs_Societies: String,
    International_Support: String,
    Research_Opportunities: String,
    Ranking: String,
    On_Campus_Accommodation: String,
    Exchange_Students_Acceptance: String,
    Student_to_Faculty_Ratio: String,
    Employment_Rate_After_Graduation: String,
    International_Student_Population: String
}, { collection: 'UniversityFinder' });

const University = mongoose.model('University', universitySchema);

module.exports = University;
