const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userIdentifier: { type: String }, // Email or Private Key used
    role: { type: String },
    status: { type: String, enum: ['access granted', 'access denied'] },
    ip: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoginLog', loginLogSchema);
