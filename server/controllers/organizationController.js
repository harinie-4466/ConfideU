const User = require('../models/User');

// @desc    Get all organizations (Aggregated or by Type)
// @route   GET /api/organizations
exports.getOrganizations = async (req, res) => {
    try {
        const { type } = req.query;
        let query = { role: 'as-organisation' };

        if (type) {
            query.organisationType = type;
        }

        const orgs = await User.find(query).select('-passwordHash -passwordSalt -privateKey'); // Exclude secrets

        // Map to frontend expected format if needed, or just return
        // Frontend likely expects: name, type, contact info.
        // User model has: organisationName, organisationType, email.

        const mappedOrgs = orgs.map(org => ({
            _id: org._id,
            name: org.organisationName,
            type: org.organisationType,
            email: org.email,
            contactPerson: 'Admin' // Placeholder or add to User schema
        }));

        res.status(200).json({ success: true, count: mappedOrgs.length, data: mappedOrgs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create Org
// @route   POST /api/organizations
exports.createOrganization = async (req, res) => {
    try {
        // This might be used by Admin to manually create orgs
        // Effectively same as Registering an As-Organisation user
        // We'll redirect to Auth Register or duplicate logic here?
        // Let's just create a User entry.

        const { type, name, email, password } = req.body; // Password needed if creating a user

        // If password not provided, generate temp? 
        // Or assume this API is just for listing used by frontend, and creation happens via Register.
        // User requirements didn't specify Admin creating Orgs manually via this API, usually Register page.
        // But if this endpoint exists, let's make it work or deprecate.

        // For now, return error if password missing, else create User.
        if (!password) return res.status(400).json({ success: false, error: 'Password required to create Organization User' });

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            role: 'as-organisation',
            email,
            passwordHash,
            passwordSalt: salt,
            organisationName: name,
            organisationType: type
        });

        res.status(201).json({ success: true, data: newUser });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
