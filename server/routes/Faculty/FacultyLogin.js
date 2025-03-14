import express from 'express';
import Faculty from "../../models/FacultyUse.models.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';

dotenv.config();
const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max-size
    }
});

// Faculty Login Route
router.post('/api/faculty/login', async (req, res) => {
    const { email, password, type } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password'
        });
    }

    try {
        // Find faculty and include password field
        const faculty = await Faculty.findOne({ email }).select('+password');

        if (!faculty) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify user type if provided
        if (type && faculty.type !== type) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user type'
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, faculty.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if faculty is verified
        if (!faculty.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Please verify your account'
            });
        }

        // Generate token
        const token = jwt.sign(
            {
                userId: faculty._id,
                email: faculty.email,
                type: faculty.type
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Prepare user data (exclude sensitive information)
        const userData = {
            name: faculty.name,
            email: faculty.email,
            type: faculty.type,
            department: faculty.department,
            designation: faculty.designation,
            position: faculty.position,
            profileImage: faculty.profileImage,
            specialization: faculty.specialization
        };

        res.status(200).json({
            success: true,
            token,
            user: userData,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error, please try again later'
        });
    }
});

// Update Faculty Profile with Image Upload
router.put('/api/faculty/profile/:email', upload.single('profileImage'), async (req, res) => {
    try {
        const { email } = req.params;
        const {
            name,
            department,
            designation,
            position,
            type
        } = req.body;

        const faculty = await Faculty.findOne({ email });

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found'
            });
        }

        // Update fields if provided
        if (name) faculty.name = name;
        if (department) faculty.department = department;
        if (designation) faculty.designation = designation;
        if (position) faculty.position = position;
        if (type) faculty.type = type;

        // Handle profile image upload
        if (req.file) {
            try {
                // Upload to cloudinary
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'faculty_profiles',
                    width: 300,
                    crop: "scale",
                    resource_type: 'auto'
                });

                // Delete old image from cloudinary if exists
                if (faculty.profileImage) {
                    const publicId = faculty.profileImage.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`faculty_profiles/${publicId}`);
                }

                // Update profile image URL
                faculty.profileImage = result.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(400).json({
                    success: false,
                    message: 'Error uploading image'
                });
            }
        }

        await faculty.save();

        res.status(200).json({
            success: true,
            data: faculty,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error, please try again later'
        });
    }
});

// Get Faculty Profile
router.get('/api/faculty/profile/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const faculty = await Faculty.findOne({ email }).select('-password');

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found'
            });
        }

        res.status(200).json({
            success: true,
            data: faculty
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error, please try again later'
        });
    }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File is too large. Maximum size is 5MB'
            });
        }
    }
    next(error);
});

export default router;