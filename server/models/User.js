const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Shared Fields
    role: {
        type: String,
        required: true,
        enum: ['citizen', 'in-organisation', 'as-organisation', 'admin']
    },
    email: { type: String, unique: true, sparse: true }, // Not all roles might force email as username, but required for contact
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    // Role-Specific Fields (Nullable/Optional)
    privateKey: { type: String, unique: true, sparse: true }, // Citizen & In-Organisation
    organisationName: { type: String }, // In-Organisation & As-Organisation
    organisationType: {
        type: String,
        enum: ['school', 'corporate', 'ngo', 'police']
    }, // As-Organisation & In-Organisation (derived)

    // Explicitly disabling ID field if we want to rely on _id, but mongoose does that by default.
    // User requested "other columns would be null", which works naturally with Mongoose documents not setting them.
});

module.exports = mongoose.model('User', userSchema);
