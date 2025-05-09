require('dotenv').config({path: "./config.env"});
const express = require('express');
const mongoose = require('mongoose');
const universityRoutes = require('./routes/universityRoutes');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas.");
}).catch(err => {
  console.error("❌ Connection error:", err);
});

// Use the university routes
app.use('/api/universities', universityRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
