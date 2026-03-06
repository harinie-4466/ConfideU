const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const CitizenReport = require('./models/CitizenReport');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB');

        const dummy = new CitizenReport({
            privateKey: 'debug_key',
            caseId: 'CASE-DEBUG-001',
            encodedCaseId: 'Q0FTRS1ERUJVRy0wMDE=',
            evidence: [],
            details: '{"description": "Test"}',
            // Missing status, confidentiality (have defaults)
        });

        console.log('Validating...');
        await dummy.validate();
        console.log('Validation SUCCESS');

        // Optional: Save to see if DB rejects it (unique index etc)
        // await dummy.save();
        // console.log('Save SUCCESS');

    } catch (e) {
        console.error('Validation FAILED:', e);
    } finally {
        mongoose.connection.close();
    }
};

run();
