const mongoose = require('mongoose');
const path = require('path');
// Use resolve for safety
const envPath = path.resolve(__dirname, '.env');
console.log('Loading .env from:', envPath);
require('dotenv').config({ path: envPath });

const run = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing from env');
        }
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected!');

        console.log('--- Checking User Collection (First 1) ---');
        const User = require('./models/User');
        const user = await User.findOne({});
        console.log('User found:', user ? user._id : 'None');

        console.log('--- Checking CitizenReport (Last 3) ---');
        const CitizenReport = require('./models/CitizenReport');
        const reports = await CitizenReport.find().sort({ createdAt: -1 }).limit(3);
        reports.forEach(r => console.log(`Report: ${r._id}, CaseID: ${r.caseId}`));

        // Security Log
        const SecurityLog = require('./models/SecurityLog');
        const logs = await SecurityLog.find().sort({ timestamp: -1 }).limit(5);
        console.log('--- Last 5 Security Logs ---');
        logs.forEach(l => console.log(`[${l.eventType}] ${l.status}: ${l.details.substring(0, 50)}...`));

    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    }
};

run();
