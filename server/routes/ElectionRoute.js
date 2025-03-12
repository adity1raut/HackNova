import express from 'express';
import bcrypt from 'bcrypt';
import transporter from '../config/NodeMailer.js';
import User from '../models/User.models.js';

const router = express.Router();
const OTP_EXPIRATION_TIME = 60 * 1000; // 1 minute in milliseconds

// Store for OTPs and verified users with proper typing
const otpStore = new Map();
const verifiedUsers = new Map();

// Route to send OTP
router.post('/api/election/send-otp', async (req, res) => {
    const { email } = req.body;
    
    try {
        // Check if email exists, but don't expose password in select
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }
        
        // Generate a secure 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP with timestamp
        otpStore.set(email, {
            otp,
            createdAt: Date.now(),
            attempts: 0 // Track verification attempts
        });
        
        // Set OTP expiration
        setTimeout(() => {
            otpStore.delete(email);
        }, OTP_EXPIRATION_TIME);
        
        console.log(otp)
        // Send email with OTP only (remove password from email)
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Your Election Verification OTP',
            text: `Welcome to the Election 2k25 of SGGS Nanded!

Your verification OTP is: ${otp}

This OTP will expire in 1 minute.
For security reasons, do not share this OTP with anyone.`,
            html: `
                <h2>Welcome to the Election 2k25 of SGGS Nanded!</h2>
                <p>Your verification OTP is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 1 minute.</p>
                <p style="color: red;">For security reasons, do not share this OTP with anyone.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent successfully' });
        
    } catch (error) {
        console.error('Error in send-otp:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// Route to verify OTP and initiate password verification
router.post('/api/election/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    
    try {
        // Get OTP data
        const otpData = otpStore.get(email);
        if (!otpData) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }
        
        // Increment attempt counter
        otpData.attempts += 1;
        
        // Check for too many attempts (max 3)
        if (otpData.attempts > 3) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'Too many failed attempts. Please request a new OTP.' });
        }
        
        // Verify OTP
        if (otpData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        
        // Check OTP expiration
        if (Date.now() - otpData.createdAt >= OTP_EXPIRATION_TIME) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Get user details after OTP verification
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Store verified user data in memory
        verifiedUsers.set(email, {
            verified: true,
            rollno: user.rollno,
            timestamp: Date.now()
        });

        // Remove OTP data after successful verification
        otpStore.delete(email);

        // Return success with minimal user data
        res.json({
            message: 'OTP verified successfully',
            rollno: user.rollno
        });

    } catch (error) {
        console.error('Error in verify-otp:', error);
        res.status(500).json({ message: 'Verification failed' });
    }
});

// Route to verify password
router.post('/api/election/verify-password', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Check if user is OTP verified
        const verifiedUser = verifiedUsers.get(email);
        if (!verifiedUser || !verifiedUser.verified) {
            return res.status(401).json({ message: 'Please verify OTP first' });
        }

        // Check if verification session is still valid (15 minutes)
        if (Date.now() - verifiedUser.timestamp > 15 * 60 * 1000) {
            verifiedUsers.delete(email);
            return res.status(401).json({ message: 'Verification session expired' });
        }

        // Get user with password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Verify password using bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Update verified user data with additional verification
        verifiedUsers.set(email, {
            ...verifiedUser,
            passwordVerified: true
        });

        res.json({
            message: 'Password verified successfully',
            rollno: user.rollno
        });

    } catch (error) {
        console.error('Error in verify-password:', error);
        res.status(500).json({ message: 'Password verification failed' });
    }
});

// Route to verify roll number
router.post('/api/election/verify-rollno', async (req, res) => {
    const { email, rollno } = req.body;
    
    try {
        // Check if user is fully verified
        const verifiedUser = verifiedUsers.get(email);
        if (!verifiedUser || !verifiedUser.verified || !verifiedUser.passwordVerified) {
            return res.status(401).json({ message: 'Complete OTP and password verification first' });
        }

        // Verify roll number matches
        if (verifiedUser.rollno !== rollno) {
            return res.status(400).json({ message: 'Invalid roll number' });
        }

        // Get user details for final verification
        const user = await User.findOne({ email, rollno })
            .select('name email rollno');

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Clear verification data after successful verification
        verifiedUsers.delete(email);
        
        // Return success with minimal user data
        res.json({
            message: 'Verification complete',
            user: {
                name: user.name,
                email: user.email,
                rollno: user.rollno
            }
        });

    } catch (error) {
        console.error('Error in verify-rollno:', error);
        res.status(500).json({ message: 'Roll number verification failed' });
    }
});


export default router;