const express = require('express');
const { getNotifications, createNotification, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getNotifications)
    .post(createNotification);

router.put('/:id/read', markAsRead);

module.exports = router;
