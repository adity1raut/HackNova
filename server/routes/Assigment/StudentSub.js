import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Assignment from '../../models/Create-assignment.js';
import StudentAssignment from '../../models/StudentAssignment.model.js';
import User from "../../models/User.models.js"

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route to fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetches all users from the database
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

// Setup Cloudinary storage for student submissions
const submissionStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'student-submissions',
        allowed_formats: ['pdf', 'doc', 'docx', 'txt', 'zip'],
        resource_type: 'auto',
    },
});

// Configure multer for file uploads
const upload = multer({
    storage: submissionStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// POST route for submitting an assignment - removed authentication
router.post('/api/studentAssignments/upload', upload.single('file'), async (req, res) => {
    try {
        // Log the incoming request body for debugging
        console.log('Request Body:', req.body);

        const { assignmentId, feedback, email } = req.body;
        
        // Get email from request body
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Validate input
        if (!assignmentId || !req.file) {
            return res.status(400).json({ message: 'Assignment ID and file are required' });
        }

        // Validate that the assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if the student has already submitted this assignment
        const existingSubmission = await StudentAssignment.findOne({
            email: email,
            assignment: assignmentId
        });

        if (existingSubmission) {
            // Update existing submission
            existingSubmission.file = {
                url: req.file.path,
                filename: req.file.originalname
            };
            existingSubmission.feedback = feedback || '';
            existingSubmission.submissionDate = new Date();
            existingSubmission.status = 'submitted';

            await existingSubmission.save();

            return res.status(200).json({
                message: 'Assignment re-submitted successfully',
                submission: existingSubmission
            });
        }

        // Create a new submission
        const newSubmission = new StudentAssignment({
            email: email,
            assignment: assignmentId,
            file: {
                url: req.file.path,
                filename: req.file.originalname
            },
            feedback: feedback || '',
            submissionDate: new Date(),
            status: 'submitted'
        });

        await newSubmission.save();

        res.status(201).json({
            message: 'Assignment submitted successfully',
            submission: newSubmission
        });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({
            message: 'Failed to submit assignment',
            error: error.message,
        });
    }
});

// GET route to fetch all student assignments for a specific student - removed authentication
router.get('/api/studentAssignments', async (req, res) => {
    try {
        // Get email from query parameters
        const email = req.query.email;
        
        if (!email) {
            return res.status(400).json({ message: 'Email parameter is required' });
        }

        const studentAssignments = await StudentAssignment.find({ email: email })
            .populate('assignment')
            .sort({ submissionDate: -1 });

        res.status(200).json(studentAssignments);
    } catch (error) {
        console.error('Error fetching student assignments:', error);
        res.status(500).json({
            message: 'Failed to fetch student assignments',
            error: error.message
        });
    }
});

// GET route to fetch all available assignments for a student
router.get('/api/assignments/available', async (req, res) => {
    try {
        // Find all assignments that are still due
        const availableAssignments = await Assignment.find({
            dueDate: { $gte: new Date() }
        }).sort({ dueDate: 1 });

        res.status(200).json(availableAssignments);
    } catch (error) {
        console.error('Error fetching available assignments:', error);
        res.status(500).json({
            message: 'Failed to fetch available assignments',
            error: error.message
        });
    }
});

export default router;