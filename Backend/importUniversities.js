require('dotenv').config({path: "./config.env"});
const mongoose = require('mongoose');
const XLSX = require('xlsx');

// ✅ Connect to the correct database "University"
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas.");
}).catch(err => console.error("❌ Connection error:", err));

// ✅ Define Schema (mapped keys)
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

// ✅ Read Excel File
const workbook = XLSX.readFile('Universities.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(sheet);

// ✅ Map column names
const mappedData = rawData.map(row => ({
  Name: row['University Name'],
  Location: row['Location'],
  UG_Tuition_Fee: row['Tuition Fees (UG)'],
  Masters_Tuition_Fee: row['Tuition Fees (PG)'],
  Scholarship_Availability: row['Scholarships Available'],
  educationalDomains: row['Educational Domains'],
  Clubs_Societies: row['Societies'],
  International_Support: row['International Support'],
  Research_Opportunities: row['Research Opportunities'],
  Ranking: row['Rankings'],
  On_Campus_Accommodation: row['On_Campus_Accommodation'],
  Exchange_Students_Acceptance: row['Exchange_Students_Acceptance'],
  Student_to_Faculty_Ratio: row['Student_to_Faculty_Ratio'],
  Employment_Rate_After_Graduation: row['Employment_Rate_After_Graduation'],
  International_Student_Population: row['International_Student_Population']
}));

// ✅ Import to MongoDB
async function importData() {
  try {
    await University.deleteMany(); // optional
    await University.insertMany(mappedData);
    console.log("✅ Data uploaded to 'UniversityFinder' collection.");
  } catch (err) {
    console.error("❌ Upload error:", err);
  } finally {
    mongoose.connection.close();
  }
}

importData();
