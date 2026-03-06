const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        // Unified User Model
        req.user = await User.findById(decoded.id).select('-passwordHash -passwordSalt');

        if (!req.user) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }

        // Attach RBAC helpers
        req.userRole = req.user.role;
        req.orgType = req.user.organisationType;
        req.orgName = req.user.organisationName;

        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        return res.status(401).json({ success: false, error: 'Not authorized token failed' });
    }
};

exports.optionalProtect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = await User.findById(decoded.id).select('-passwordHash -passwordSalt');
        if (req.user) {
            req.userRole = req.user.role;
            req.orgType = req.user.organisationType;
            req.orgName = req.user.organisationName;
        }
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};


