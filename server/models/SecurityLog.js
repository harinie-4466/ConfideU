const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    eventType: {
        type: String,
        required: true,
        enum: ['LOGIN_ATTEMPT', 'CASE_ACCESS', 'EVIDENCE_UPLOAD', 'EVIDENCE_ACCESS', 'EVIDENCE_VERIFICATION', 'CASE_CREATION']
    },
    userIdentifier: { type: String }, // Email, Private Key, or 'system'
    role: { type: String },
    status: {
        type: String,
        required: true,
        enum: ['VERIFIED', 'CORRUPTED', 'MATCHED', 'NOT MATCHED', 'SIGNATURE VERIFIED', 'SIGNATURE INVALID', 'ENCRYPTION VERIFIED', 'DATA CORRUPTED', 'INFO']
    },
    details: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed } // Flexible object for storing hashes, keys, IDs
});

module.exports = mongoose.model('SecurityLog', securityLogSchema);
