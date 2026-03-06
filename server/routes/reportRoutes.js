const express = require('express');
const { createReport, getReports, updateReportStatus, getEvidence, getReportById } = require('../controllers/reportController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

const router = express.Router();

// router.use(protect); // Don't use global protect if we need optional for POST

router.route('/')
    .get(protect, getReports) // GET still needs login? Or checking public/anon reports? Usually View requires Login (Citizen/Org).
    .post(optionalProtect, createReport); // POST can be anonymous

router.get('/:id', protect, getReportById); // Add specific GET ID route
router.put('/:id', updateReportStatus);
router.get('/evidence/:fileId', getEvidence);

module.exports = router;
