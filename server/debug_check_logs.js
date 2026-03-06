const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const SecurityLog = require('./models/SecurityLog');
const CitizenReport = require('./models/CitizenReport');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB');

        console.log('\n--- LATEST SECURITY LOGS ---');
        const logs = await SecurityLog.find().sort({ timestamp: -1 }).limit(5);
        if (logs.length === 0) console.log('No logs found.');
        logs.forEach(l => {
            console.log(`[${l.timestamp.toISOString()}] ${l.eventType} - ${l.status}: ${l.details}`);
        });

        console.log('\n--- LATEST CITIZEN REPORTS ---');
        const reports = await CitizenReport.find().sort({ createdAt: -1 }).limit(3);
        if (reports.length === 0) console.log('No reports found.');
        reports.forEach(r => {
            console.log(`ID: ${r._id}, Case ID: ${r.caseId || 'MISSING'}, Enc Case ID: ${r.encodedCaseId}`);
        });

    } catch (e) {
        console.error('Check FAILED:', e);
    } finally {
        mongoose.connection.close();
    }
};

run();
