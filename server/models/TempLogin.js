const mongoose = require('mongoose');

const tempLoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    role: { type: String, required: true }, // 'admin' or 'org_user'
    tempToken: { type: String, required: true }, // Short lived token
    expiresAt: { type: Date, default: () => Date.now() + 10 * 60 * 1000 } // 10 mins
});

module.exports = mongoose.model('TempLogin', tempLoginSchema);
