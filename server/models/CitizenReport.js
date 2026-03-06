const mongoose = require('mongoose');

const citizenReportSchema = new mongoose.Schema({
    privateKey: { type: String, required: true }, // Link to citizen
    caseId: { type: String, required: true, unique: true }, // Plain Case ID
    encodedCaseId: { type: String, required: true, unique: true },

    // Encryption Metadata
    evidence: [{
        name: String, // Base64 Encoded Name
        mimeType: String,
        size: Number,
        size: Number,
        storedFileName: String, // Kept for legacy reference or virtual filename
        data: String, // Encrypted Base64 Content
        // Security Fields
        encryptedAesKey: { type: String }, // RSA Encrypted AES Key
        iv: { type: String }, // AES Initialization Vector
        fileHash: { type: String }, // SHA-256 Hash
        signature: { type: String } // Digital Signature
    }],

    // Report Data
    details: { type: String }, // Description/Content
    status: { type: String, default: 'pending' },
    confidentiality: { type: String, enum: ['low', 'high'], default: 'high' },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CitizenReport', citizenReportSchema);
