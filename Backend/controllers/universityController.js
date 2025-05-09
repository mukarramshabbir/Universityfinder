const University = require('../models/university');

// Fetch all universities from the database
exports.getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find();
    res.status(200).json({ universities });
  } catch (err) {
    console.error("❌ Error fetching universities:", err);
    res.status(500).json({ message: "Error fetching universities" });
  }
};
