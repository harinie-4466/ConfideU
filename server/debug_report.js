const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('DB Connection Error:', err);
        process.exit(1);
    }
};

const mockRes = {
    status: function (code) {
        this.statusCode = code;
        return this;
    },
    json: function (data) {
        console.log(`Response [${this.statusCode}]:`, JSON.stringify(data, null, 2));
    }
};

const runDebug = async () => {
    await connectDB();

    // Require Controller (Relative to server/)
    const reportController = require('./controllers/reportController');

    // Mock User (Citizen)
    // Note: We need a valid privateKey if the schema requires it
    const privateKey = "DEBUG_KEY_" + Date.now();

    const mockReq = {
        user: {
            role: 'citizen',
            privateKey: privateKey,
            _id: 'debug_user_id'
        },
        body: {
            crimeDate: '2023-01-01',
            crimeVenue: 'Debug Venue',
            personCommitted: 'Debug Suspect',
            personDesignation: 'Debug Role',
            personOrganisation: 'Debug Org',
            incidentDescription: 'This is a debug report submission.',
            evidenceFiles: [],
            category: 'Fraud',
            confidentialityType: 'high',
            informPolice: false,
            otherDetails: 'None'
        }
    };

    console.log('--- STARTING REPORT CREATION DEBUG ---');
    try {
        await reportController.createReport(mockReq, mockRes);
    } catch (e) {
        console.error("FATAL ERROR IN SCRIPT:", e);
    }

    console.log('--- END DEBUG ---');
    setTimeout(() => process.exit(0), 2000);
};

runDebug();
