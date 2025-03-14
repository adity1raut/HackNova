import express from 'express';
import Faculty from '../../models/FacultyUse.models.js';
import dotenv from 'dotenv';
import transporter from "../../config/NodeMailer.js";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

dotenv.config();
const router = express.Router();

// Store for both OTP and temporary faculty data
const otpStore = new Map();
const tempFacultyStore = new Map();

// Clear expired data periodically
setInterval(() => {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(email);
            tempFacultyStore.delete(email);
        }
    }
}, 5 * 60 * 1000);

// Generate OTP
const generateOTP = () => {
    const otp = crypto.randomInt(100000, 999999).toString();
    return {
        code: otp,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    };
};

// Validate faculty input
const validateFacultyInput = (data) => {
    const errors = {};
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
    }
    
    // Email validation for SGGS domain
    if (!data.email || !data.email.endsWith('@sggs.ac.in')) {
        errors.email = 'Please use a valid SGGS email address (@sggs.ac.in)';
    }
    
    // Type validation
    const validTypes = ['faculty', 'secretary', 'club' , "admin" , "doctor"];
    if (!data.type || !validTypes.includes(data.type)) {
        errors.type = 'Invalid account type';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Send OTP Endpoint
router.post('/api/faculty/send-otp', async (req, res) => {
    try {
        const { 
            name, 
            email, 
            type = 'faculty'
        } = req.body;

        // Validate input
        const validation = validateFacultyInput(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                errors: validation.errors
            });
        }

        // Check if faculty already exists
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            return res.status(400).json({
                success: false,
                message: 'Faculty member with this email already exists'
            });
        }

        // Generate and store OTP
        const otpData = generateOTP();
        otpStore.set(email, otpData);

        // Store faculty data temporarily
        tempFacultyStore.set(email, {
            name: name.trim(),
            email: email.toLowerCase(),
            type
        });

        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Faculty Registration',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome to Faculty Registration Portal</h2>
                    <p>Your One-Time Password (OTP) for registration is:</p>
                    <h3 style="background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 5px;">
                        ${otpData.code}
                    </h3>
                    <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
                    <p>If you did not request this registration, please ignore this email.</p>
                </div>
            `
        };

        // Send email and log OTP (remove in production)
        await transporter.sendMail(mailOptions);
        console.log(`OTP for ${email}: ${otpData.code}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully. Please verify to continue registration.'
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending OTP. Please try again.'
        });
    }
});

// Verify OTP and Complete Registration
router.post('/api/faculty/verify-and-register', async (req, res) => {
    try {
        const { 
            email, 
            otp, 
            password, 
            confirmPassword
        } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Check if OTP exists
        const otpData = otpStore.get(email);
        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found or OTP expired. Please request a new one.'
            });
        }

        // Verify OTP
        if (otpData.code !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Check if OTP has expired
        if (Date.now() > otpData.expiresAt) {
            otpStore.delete(email);
            tempFacultyStore.delete(email);
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        }

        // Validate password
        if (!password || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        // Confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Get stored faculty data
        const facultyData = tempFacultyStore.get(email);
        if (!facultyData) {
            return res.status(400).json({
                success: false,
                message: 'Registration data not found. Please start registration again.'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save faculty
        const faculty = new Faculty({
            ...facultyData,
            password: hashedPassword,
            isVerified: true
        });

        await faculty.save();

        // Clear stored data
        otpStore.delete(email);
        tempFacultyStore.delete(email);

        res.status(201).json({
            success: true,
            message: 'Faculty registration completed successfully. You can now login.'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during registration. Please try again.'
        });
    }
});

// Resend OTP Endpoint
router.post('/api/faculty/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Check if temporary faculty data exists
        const facultyData = tempFacultyStore.get(email);
        if (!facultyData) {
            return res.status(400).json({
                success: false,
                message: 'Registration data not found. Please start registration again.'
            });
        }

        // Generate new OTP
        const otpData = generateOTP();
        otpStore.set(email, otpData);

        // Send new OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your New OTP for Faculty Registration',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>New OTP for Faculty Registration</h2>
                    <p>Your new One-Time Password (OTP) is:</p>
                    <h3 style="background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 5px;">
                        ${otpData.code}
                    </h3>
                    <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
                    <p>If you did not request this OTP, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`New OTP for ${email}: ${otpData.code}`);

        res.status(200).json({
            success: true,
            message: 'New OTP has been sent to your email.'
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending new OTP. Please try again.'
        });
    }
});

export default router;