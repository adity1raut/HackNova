import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.models.js';
import transporter from '../config/NodeMailer.js';

const router = express.Router();
const otpStore = new Map(); // Store OTPs in memory (email: { otp, expiresAt, attempts })

// Endpoint for requesting a password reset OTP
router.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User with this email does not exist'
            });
        }

        // Check if an OTP already exists and hasn't expired
        const existingOtp = otpStore.get(email);
        if (existingOtp && existingOtp.expiresAt > Date.now()) {
            const timeLeft = Math.ceil((existingOtp.expiresAt - Date.now()) / 1000);
            return res.status(429).json({
                success: false,
                message: `Please wait ${timeLeft} seconds before requesting a new OTP`
            });
        }

        const otp = crypto.randomInt(1000, 9999).toString();
        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 3 * 60 * 1000, // 3 minutes
            attempts: 0
        });

        await transporter.sendMail({
            from: 'araut7798@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is ${otp}. It is valid for 3 minutes.`,
        });

        console.log('OTP sent successfully:', otp);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP. Please try again later.'
        });
    }
});

router.post('/api/verify-otp', (req, res) => {
    try {
        const { email, otp } = req.body;

        console.log("Received OTP verification request:", { email, otp }); // Log the received data

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Both email and OTP are required"
            });
        }

        const storedOtpData = otpStore.get(email); // Get OTP data by email
        console.log("Stored OTP Data:", storedOtpData); // Log the stored OTP data

        // Check if OTP exists
        if (!storedOtpData) {
            return res.status(404).json({
                success: false,
                message: "No OTP found. Please request a new OTP"
            });
        }

        // Check if OTP has expired
        if (storedOtpData.expiresAt < Date.now()) {
            otpStore.delete(email);
            return res.status(401).json({
                success: false,
                message: "OTP has expired. Please request a new OTP"
            });
        }

        // Check maximum attempts
        if (storedOtpData.attempts >= 3) {
            otpStore.delete(email);
            return res.status(429).json({
                success: false,
                message: "Maximum attempts reached. Please request a new OTP"
            });
        }

        // Increment attempts
        storedOtpData.attempts += 1;
        otpStore.set(email, storedOtpData);

        // Verify OTP
        if (storedOtpData.otp !== otp) { // Compare stored OTP with the provided OTP
            const remainingAttempts = 3 - storedOtpData.attempts;
            return res.status(401).json({
                success: false,
                message: `Invalid OTP. ${remainingAttempts} attempts remaining`
            });
        }

        // OTP verified successfully
        otpStore.delete(email);
        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify OTP. Please try again"
        });
    }
});


router.post('/api/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email and new password are required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User with this email does not exist'
            });
        }

        // Password validation
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update password. Please try again'
        });
    }
});

export default router;
