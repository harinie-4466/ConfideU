const mongoose = require('mongoose');
const path = require('path');
const CitizenReport = require(path.join(__dirname, 'server/models/CitizenReport'));
const InOrgReport = require(path.join(__dirname, 'server/models/InOrgReport'));
require('dotenv').config({ path: path.join(__dirname, 'server/.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/confideu', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

const inspectReports = async () => {
    await connectDB();

    console.log('\n--- LATEST CITIZEN REPORT ---');
    const citizenReport = await CitizenReport.findOne().sort({ createdAt: -1 });
    if (citizenReport) {
        console.log(`ID: ${citizenReport._id}`);
        console.log('Evidence Array Raw:');
        console.log(JSON.stringify(citizenReport.evidence, null, 2));
    } else {
        console.log('No Citizen Reports found.');
    }

    console.log('\n--- LATEST IN-ORG REPORT ---');
    const inOrgReport = await InOrgReport.findOne().sort({ createdAt: -1 });
    if (inOrgReport) {
        console.log(`ID: ${inOrgReport._id}`);
        console.log('Evidence Array Raw:');
        console.log(JSON.stringify(inOrgReport.evidence, null, 2));
    } else {
        console.log('No In-Org Reports found.');
    }

    process.exit();
};

inspectReports();
