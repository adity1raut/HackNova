import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import FacultyAvailability from '../../models/Faculty.models.js';

const router = express.Router();

// Enhanced time slot validation
const validateTimeSlots = (timeSlots) => {
    if (!Array.isArray(timeSlots)) return false;
    
    return timeSlots.every(slot => {
        if (!slot.start || !slot.end) return false;
        
        // Enhanced time format validation (HH:MM AM/PM)
        const timeFormat = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
        if (!timeFormat.test(slot.start) || !timeFormat.test(slot.end)) return false;
        
        // Convert times to comparable format
        const startTime = new Date(`1970/01/01 ${slot.start}`);
        const endTime = new Date(`1970/01/01 ${slot.end}`);
        
        // Ensure end time is after start time
        if (endTime <= startTime) return false;
        
        // Ensure slots are within reasonable hours (e.g., 8 AM to 8 PM)
        const minTime = new Date(`1970/01/01 8:00 AM`);
        const maxTime = new Date(`1970/01/01 8:00 PM`);
        return startTime >= minTime && endTime <= maxTime;
    });
};

// Create faculty availability
router.post(
    '/api/faculty-availability',
    [
        body('name').trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),
        body('email').isEmail()
            .normalizeEmail()
            .withMessage('Valid email is required'),
        body('phone').trim()
            .matches(/^\+?[\d\s-]{10,}$/)
            .withMessage('Valid phone number is required'),
        body('department').trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Department must be between 2 and 50 characters'),
        body('designation').trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Designation must be between 2 and 50 characters'),
        body('dayOfWeek')
            .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
            .withMessage('Valid day of week is required'),
        body('availableTimeSlots').isArray()
            .withMessage('Time slots must be an array')
            .custom(slots => {
                if (!validateTimeSlots(slots)) {
                    throw new Error('Invalid time slot format or hours');
                }
                return true;
            })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            // Check for existing faculty availability on same day
            const existingAvailability = await FacultyAvailability.findOne({
                email: req.body.email,
                dayOfWeek: req.body.dayOfWeek
            });

            if (existingAvailability) {
                return res.status(409).json({
                    success: false,
                    message: 'Faculty availability already exists for this day'
                });
            }

            const facultyAvailability = new FacultyAvailability(req.body);
            await facultyAvailability.save();

            res.status(201).json({
                success: true,
                message: 'Faculty availability created successfully',
                data: facultyAvailability
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating faculty availability',
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
);


router.get('/api/faculty-availability', async (req, res) => {
    try {
        const availabilities = await FacultyAvailability.find();
        res.status(200).json(availabilities);
    } catch (error) {
        console.error('Error fetching faculty availability:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// router.get('/api/faculty-availability/email/:email', async (req, res) => {
//     try {
//         const email = req.params.email;

//         // Validate email format (optional, but recommended)
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid email format'
//             });
//         }

//         const availability = await FacultyAvailability.findOne({ email: email });

//         if (!availability) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Faculty availability not found for this email'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: availability
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching faculty availability by email',
//             error: error.message,
//             details: process.env.NODE_ENV === 'development' ? error.stack : undefined
//         });
//     }
// });

// Get all faculty availabilities with enhanced filtering and pagination

export default router;