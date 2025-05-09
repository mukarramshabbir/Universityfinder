const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');

// Route to get all universities
router.get('/', universityController.getAllUniversities);

module.exports = router;
