const mongoose = require('mongoose');

const adminProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    organisationDetails: { type: String }, // Placeholder structure
    contactDetails: { type: String },
    // Add other admin specific details here
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminProfile', adminProfileSchema);
