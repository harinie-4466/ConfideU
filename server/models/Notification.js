const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientRole: { type: String, required: true }, // 'as-organisation' or 'admin'
    recipientId: { type: String, required: true }, // User ID or Org ID
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'info' },
    relatedCaseId: { type: String },
    read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
