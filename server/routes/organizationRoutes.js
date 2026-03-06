const express = require('express');
const { getOrganizations, createOrganization } = require('../controllers/organizationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// router.use(protect); // Optional: protect all routes

router.route('/')
    .get(getOrganizations)
    .post(createOrganization);

module.exports = router;
