const mongoose = require('mongoose');

const inOrgReportSchema = new mongoose.Schema({
    privateKey: { type: String, required: true }, // Link to In-Org User
    caseId: { type: String, required: true, unique: true }, // Plain Case ID
    encodedCaseId: { type: String, required: true, unique: true },

    organisationName: { type: String, required: true }, // The org this report belongs to
    organisationType: { type: String },

    informPolice: { type: Boolean, default: false }, // Critical for visibility logic

    // Encryption Metadata
    evidence: [{
        name: String,
        mimeType: String,
        size: Number,
        storedFileName: String,
        data: String, // Encrypted Base64 Content
        // Security Fields
        encryptedAesKey: { type: String },
        iv: { type: String },
        fileHash: { type: String },
        signature: { type: String }
    }],

    // Report Data
    details: { type: String },
    status: { type: String, default: 'pending' },
    confidentiality: { type: String, enum: ['low', 'high'], default: 'high' },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InOrgReport', inOrgReportSchema);
