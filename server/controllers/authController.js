const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // unified table
const LoginLog = require('../models/LoginLog'); // logs
const TempLogin = require('../models/TempLogin'); // for MFA
const SecurityLog = require('../models/SecurityLog'); // logs

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send Email using Nodemailer
const sendEmail = async (email, otp) => {
    // Console log for fallback/debugging
    console.log('================================================');
    console.log(`[MFA] OTP for ${email}: ${otp}`);
    console.log('================================================');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials (EMAIL_USER/EMAIL_PASS) not found in .env. Email not sent.');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or use 'host' and 'port' if using standard SMTP
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'ConfideU - Your Login OTP',
            text: `Your OTP for ConfideU login is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2563eb;">ConfideU Login</h2>
                    <p>Your One-Time Password (OTP) is:</p>
                    <h1 style="background: #f3f4f6; padding: 10px; display: inline-block; border-radius: 5px;">${otp}</h1>
                    <p>This OTP is valid for 10 minutes.</p>
                    <p style="font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
                   </div>`
        });

        console.log(`[Email] OTP sent successfully to ${email}`);
    } catch (err) {
        console.error('[Email] Failed to send OTP email:', err);
    }
};

// @desc    Register a user (Table 1: User Table)
exports.register = async (req, res) => {
    try {
        const { email, password, role, organisationType, organisationName, privateKey } = req.body;

        // Validation for existing users
        let existsQuery = [];
        if (email) existsQuery.push({ email });
        if (privateKey) existsQuery.push({ privateKey });

        if (existsQuery.length > 0) {
            const exists = await User.findOne({ $or: existsQuery });
            if (exists) return res.status(400).json({ success: false, error: 'User/Email/Key already exists' });
        }

        // Hash Password & Salt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Prepare User Object (Fields null by default if not set)
        const userData = {
            role,
            passwordHash,
            passwordSalt: salt
        };

        if (email) userData.email = email;
        if (privateKey) userData.privateKey = privateKey;
        if (organisationName) userData.organisationName = organisationName;
        if (organisationType) userData.organisationType = organisationType;

        // For specific roles, enforce certain fields
        if (role === 'citizen') {
            // userData already has what it needs from inputs
        } else if (role === 'in-organisation') {
            // In-Org needs Org Name & Type
        } else if (role === 'as-organisation') {
            // As-Org needs Org Name & Type
        } else if (role === 'admin') {
            // Admin needs email
        }

        const newUser = await User.create(userData);

        // Direct Login response (Token) for SFA roles if needed, 
        // OR just success message.
        // User requested: login matches table 1 -> Access Granted/Denied -> MFA.
        // So let's stick to standard flow: Register -> Login.

        if (role === 'citizen' || role === 'in-organisation') {
            // Auto-login or return key? User usually wants key returned if generated logic was here, 
            // but currently key comes from frontend generated or backend.
            // Codebase had frontend generating it.
            const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
            return res.status(201).json({ success: true, data: { ...newUser._doc, token } });
        }

        res.status(201).json({ success: true, data: { message: 'Registered. Please login.' } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Login (Table 1 check -> Table 2 Log -> MFA)
exports.login = async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    let logStatus = 'access denied';
    let userIdentifier = '';

    try {
        let { email, password, role, privateKey, organisationName, organisationType } = req.body;

        // Sanitize
        if (email) email = email.trim();
        if (privateKey) privateKey = privateKey.trim();
        if (organisationName) organisationName = organisationName.trim();
        if (password) password = password.trim();

        userIdentifier = email || privateKey || 'unknown';

        // 1. Find User in Table 1 (User)
        let query = {};
        if (role === 'citizen') {
            if (!privateKey) throw new Error('Private Key required');
            query = { role: 'citizen', privateKey };
        } else if (role === 'in-organisation') {
            if (!privateKey || !organisationName) throw new Error('Private Key and Org Name required');
            query = { role: 'in-organisation', privateKey, organisationName };
            // Use type if provided to be strict, or just name
            if (organisationType) query.organisationType = organisationType;
        } else if (role === 'as-organisation') {
            if (!email) throw new Error('Email required');
            query = { role: 'as-organisation', email };
            // As-Org might be strict on org name too if needed, but email is unique usually
        } else if (role === 'admin') {
            if (!email) throw new Error('Email required');
            query = { role: 'admin', email };
        }

        const user = await User.findOne(query);

        if (!user) {
            await LoginLog.create({ userIdentifier, role, status: 'access denied', ip });
            return res.status(401).json({ success: false, error: 'Access Denied (User not found)' });
        }



        // ... inside login function ...

        // 2. Verify Password (Salt is stored but bcrypt.compare uses the hash's salt internally)
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        // Security Logging: Re-hash entered password with the stored salt to show in logs
        console.log('[Debug] Verifying password...');

        let enteredPasswordHash = 'N/A';
        if (user.passwordSalt) {
            enteredPasswordHash = await bcrypt.hash(password, user.passwordSalt);
        } else {
            console.log('[Warning] No salt found for user, cannot generate verification hash.');
            enteredPasswordHash = 'MISSING_SALT';
        }

        console.log('================================================');
        console.log('[Security] Password Hashing Verification');
        console.log(`[Stored]  Hash: ${user.passwordHash}`);
        console.log(`[Stored]  Salt: ${user.passwordSalt || 'MISSING'}`);
        console.log(`[Entered] Hash: ${enteredPasswordHash}`);
        console.log(`[Result]  ${isMatch ? 'MATCHED' : 'NOT MATCHED'}`);
        console.log('================================================');

        await SecurityLog.create({
            eventType: 'LOGIN_ATTEMPT',
            userIdentifier: userIdentifier,
            role: role,
            status: isMatch ? 'MATCHED' : 'NOT MATCHED',
            details: 'Password Hash Verification',
            metadata: {
                storedHash: user.passwordHash,
                storedSalt: user.passwordSalt || 'MISSING',
                enteredHash: enteredPasswordHash
            }
        });

        if (!isMatch) {
            await LoginLog.create({ userIdentifier, role, status: 'access denied', ip });
            return res.status(401).json({ success: false, error: 'Access Denied (Password mismatch)' });
        }

        // 3. Access Granted
        logStatus = 'access granted';
        await LoginLog.create({ userId: user._id, userIdentifier, role, status: logStatus, ip });

        // 4. MFA Flow
        // User said: "Access Granted... after which MFA with OTP comes"
        // For ALL roles or just some? Previous requirements said MFA for Admin/As-Org.
        // Let's assume MFA for Admin/As-Org. Citizen/In-Org usually SFA (Direct).
        // BUT user prompt said: "Access granted... after which MFA... role specific dashboard".
        // This implies MFA might be for everyone?
        // Let's keep SFA for Citizen/In-Org for now (usability) unless forced.
        // Actually, user said "if that too succeeds lead to a role specific dashboard".
        // I will keep SFA for Citizen and In-Org for simplicity/experience, and MFA for Admin/As-Org.

        if (role === 'citizen' || role === 'in-organisation') {
            const token = jwt.sign({
                id: user._id,
                role: user.role,
                organisationName: user.organisationName,
                organisationType: user.organisationType
            }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

            return res.json({ success: true, data: { ...user._doc, token }, message: 'Access Granted' });
        }

        // MFA for others
        const otp = generateOTP();
        const tempToken = crypto.randomBytes(32).toString('hex');

        await TempLogin.create({
            email: user.email,
            otp,
            role,
            tempToken
        });

        await sendEmail(user.email, otp);

        res.json({
            success: true,
            mfaRequired: true,
            tempToken,
            message: 'Access Granted. OTP sent.'
        });

    } catch (err) {
        console.error(err);
        // Log generic failure
        await LoginLog.create({ userIdentifier, role, status: 'access denied', ip });
        res.status(401).json({ success: false, error: err.message || 'Access Denied' });
    }
};

// @desc    Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { tempToken, otp } = req.body;

        console.log('================================================');
        console.log('[MFA] OTP Verification Attempt');
        console.log(`[Client] TempToken: ${tempToken}`);
        console.log(`[Client] OTP:       ${otp}`);

        const tempLogin = await TempLogin.findOne({ tempToken, otp });

        console.log(`[Result] Found Record: ${!!tempLogin}`);

        if (!tempLogin) {
            console.log('[Status] FAILED - Invalid Token or OTP');
            console.log('================================================');
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        console.log(`[Status] SUCCESS - OTP Verified for ${tempLogin.email}`);
        console.log('================================================');

        const user = await User.findOne({ email: tempLogin.email, role: tempLogin.role });
        if (!user) return res.status(400).json({ success: false, error: 'User not found' });

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                organisationName: user.organisationName,
                organisationType: user.organisationType
            },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        await TempLogin.deleteOne({ _id: tempLogin._id });

        res.json({ success: true, data: { ...user._doc, token } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.getMe = async (req, res) => {
    res.status(200).json({ success: true, data: req.user });
};
