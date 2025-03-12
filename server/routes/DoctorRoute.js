import express from 'express';
import { body, validationResult } from 'express-validator';
import Docter from '../models/Docter.model.js';

const router = express.Router();

// Validation middleware
const validateDocter = [
    body('ower_id')
        .notEmpty()
        .withMessage('Owner ID is required'),
    
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .matches(/.+\@.+\..+/)
        .withMessage('Invalid email format'),
    
    body('phone')
        .notEmpty()
        .withMessage('Phone is required'),
    
    body('ilness')
        .notEmpty()
        .withMessage('Illness is required'),
    
    body('time')
        .notEmpty()
        .withMessage('Time is required'),
    
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Invalid date format')
];

// Create new appointment
router.post('/api/docters', validateDocter, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const docter = new Docter(req.body);
        await docter.save();

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: docter
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating appointment',
            error: error.message
        });
    }
});

// Get all appointments
router.get('/api/docters', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const docters = await Docter.find()
            .populate('ower_id', 'name email')
            .sort({ date: 1, time: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Docter.countDocuments();

        res.status(200).json({
            success: true,
            data: docters,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalAppointments: total,
                appointmentsPerPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
});

// Get single appointment
router.get('/api/docters/:id', async (req, res) => {
    try {
        const docter = await Docter.findById(req.params.id)
            .populate('ower_id', 'name email');

        if (!docter) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: docter
        });
        // console.log(docter);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching appointment',
            error: error.message
        });
    }
});

// Update appointment
router.put('/api/docters/:id', validateDocter, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const docter = await Docter.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!docter) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            data: docter
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating appointment',
            error: error.message
        });
    }
});

// Delete appointment
router.delete('/api/docters/:id', async (req, res) => {
    try {
        const docter = await Docter.findByIdAndDelete(req.params.id);

        if (!docter) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting appointment',
            error: error.message
        });
    }
});

// Get appointments by date range
router.get('/api/docters/range/:startDate/:endDate', async (req, res) => {
    try {
        const { startDate, endDate } = req.params;

        const docters = await Docter.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        })
        .populate('ower_id', 'name email')
        .sort({ date: 1, time: 1 });

        res.status(200).json({
            success: true,
            data: docters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
});

export default router;