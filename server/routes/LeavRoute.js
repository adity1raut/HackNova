import express from 'express';
import { body, validationResult } from 'express-validator';
import LeaveApplication from '../models/Leav.models.js';
import User from '../models/User.models.js';

const router = express.Router();


router.post(
    '/api/leave-applications',
    [
        body('student_information.roll_no').notEmpty().withMessage('Roll number is required'),
        body('student_information.student_name').notEmpty().withMessage('Student name is required'),
        body('student_information.student_email').isEmail().withMessage('Invalid student email'),
        body('parent_information.parent_name').notEmpty().withMessage('Parent name is required'),
        body('parent_information.parent_email').isEmail().withMessage('Invalid parent email'),
        body('leave_details.reason_for_leave').notEmpty().withMessage('Reason for leave is required'),
        body('leave_details.leave_start_date').isISO8601().toDate().withMessage('Invalid start date'),
        body('leave_details.leave_end_date').isISO8601().toDate().withMessage('Invalid end date')
            .custom((endDate, { req }) => {
                const startDate = new Date(req.body.leave_details.leave_start_date);
                if (new Date(endDate) < startDate) {
                    throw new Error('End date must be after start date');
                }
                return true;
            }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('Validation errors:', errors.array());
                return res.status(400).json({ 
                    success: false,
                    message: 'Validation failed', 
                    errors: errors.array() 
                });
            }

            const student = await User.findOne({ email: req.body.student_information.student_email });
            if (!student) {
                console.log('Student not found for email:', req.body.student_information.student_email);
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            console.log('Student found:', student);

            const leaveApplication = new LeaveApplication({
                ...req.body,
                status: 'pending',
                admin_remarks: '',
                reviewed_by: null,
                reviewed_at: null,
                additional_information: {
                    comments: req.body.additional_information?.comments || ''
                }
            });
            
            await leaveApplication.save();
            
            res.status(201).json({ 
                success: true,
                message: 'Leave application created successfully', 
                data: leaveApplication 
            });
        } catch (error) {
            console.log('Error creating leave application:', error.message);
            res.status(400).json({ 
                success: false,
                message: 'Error creating leave application', 
                error: error.message 
            });
        }
    }
);

// Get all leave applications with filters and pagination
router.get('/api/leave-applications', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Build filter object
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.search) {
            filter.$or = [
                { 'student_information.student_name': { $regex: req.query.search, $options: 'i' } },
                { 'student_information.student_email': { $regex: req.query.search, $options: 'i' } }
            ];
        }
        
        // Date range filter
        if (req.query.startDate && req.query.endDate) {
            filter['leave_details.leave_start_date'] = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        const leaveApplications = await LeaveApplication.find(filter)
            .populate('student_information.roll_no', 'name email')
            .populate('reviewed_by', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await LeaveApplication.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: leaveApplications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching leave applications', 
            error: error.message 
        });
    }
});

// Get a single leave application by ID
router.get('/api/leave-applications/:id', async (req, res) => {
    try {
        const leaveApplication = await LeaveApplication.findById(req.params.id)
            .populate('student_information.roll_no', 'name email')
            .populate('reviewed_by', 'name email');

        if (!leaveApplication) {
            return res.status(404).json({ 
                success: false,
                message: 'Leave application not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            data: leaveApplication 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching leave application', 
            error: error.message 
        });
    }
});

// Get leave applications by status
router.get('/api/leave-applications/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status parameter'
            });
        }

        const leaveApplications = await LeaveApplication.find({ status })
            .populate('student_information.roll_no', 'name email')
            .populate('reviewed_by', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await LeaveApplication.countDocuments({ status });

        res.status(200).json({
            success: true,
            data: leaveApplications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching leave applications by status',
            error: error.message
        });
    }
});

// Update leave application status (for admin)
router.patch('/api/leave-applications/:id/status', [
    body('status')
        .isIn(['approved', 'rejected'])
        .withMessage('Status must be either approved or rejected'),
    body('admin_remarks')
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Admin remarks must not be empty if provided')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const { status, admin_remarks } = req.body;

        const leaveApplication = await LeaveApplication.findById(id);

        if (!leaveApplication) {
            return res.status(404).json({
                success: false,
                message: 'Leave application not found'
            });
        }

        if (leaveApplication.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Leave application is already ${leaveApplication.status}`
            });
        }

        const updatedApplication = await LeaveApplication.findByIdAndUpdate(
            id,
            {
                status,
                admin_remarks: admin_remarks || '',
                reviewed_by: req.user?._id || null,
                reviewed_at: new Date()
            },
            { new: true }
        ).populate('student_information.roll_no', 'name email')
         .populate('reviewed_by', 'name email');

        res.status(200).json({
            success: true,
            message: `Leave application ${status} successfully`,
            data: updatedApplication
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating leave application status',
            error: error.message
        });
    }
});

// Update leave application details
router.put('/api/leave-applications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const leaveApplication = await LeaveApplication.findById(id);
        
        if (!leaveApplication) {
            return res.status(404).json({ 
                success: false,
                message: 'Leave application not found' 
            });
        }

        // Prevent updating if already approved/rejected
        if (leaveApplication.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot update application that is already ${leaveApplication.status}`
            });
        }

        const updatedApplication = await LeaveApplication.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        ).populate('student_information.roll_no', 'name email');

        res.status(200).json({ 
            success: true,
            message: 'Leave application updated successfully', 
            data: updatedApplication 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: 'Error updating leave application', 
            error: error.message 
        });
    }
});

// Delete a leave application
router.delete('/api/leave-applications/:id', async (req, res) => {
    try {
        const leaveApplication = await LeaveApplication.findById(req.params.id);

        if (!leaveApplication) {
            return res.status(404).json({ 
                success: false,
                message: 'Leave application not found' 
            });
        }

        if (leaveApplication.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot delete application that is already ${leaveApplication.status}`
            });
        }

        await LeaveApplication.findByIdAndDelete(req.params.id);

        res.status(200).json({ 
            success: true,
            message: 'Leave application deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error deleting leave application', 
            error: error.message 
        });
    }
});

// Error-handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!', 
        error: err.message 
    });
});

export default router;