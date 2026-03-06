const Notification = require('../models/Notification');

// @desc    Get notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const { role, id, organisationName } = req.user;
        let query = {};

        if (role === 'as-organisation') {
            // Get notifications for this specific org
            // Organization ID might be the MongoDB _id of the Org, or the user ID if acting as one.
            // Based on context, recipientId usually matches the Org ID or User ID.
            // Let's assume recipientId matches User's Organisation ID or User ID.
            query = { recipientId: req.user.organizationId || req.user.id };
        } else if (role === 'admin') {
            query = { recipientRole: 'admin' };
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private (Internal/Admin)
exports.createNotification = async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        res.status(201).json({ success: true, data: notification });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Mark as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
