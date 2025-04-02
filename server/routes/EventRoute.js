import express from 'express';
import { body, validationResult } from 'express-validator';
import Event from '../models/Event.models.js';
import User from '../models/User.models.js';

const router = express.Router();

// Create a new event
router.post(
    '/api/events',
    [
        body('event_name').notEmpty().withMessage('Event name is required'),
        body('event_description').notEmpty().withMessage('Event description is required'),
        body('event_date').isISO8601().toDate().withMessage('Invalid event date'),
        body('event_location').notEmpty().withMessage('Event location is required'),
        body('organizer_email').isEmail().withMessage('Invalid organizer email')
    ],
    async (req, res) => {
        try {
            console.log('Request Body:', req.body); // Log the request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('Validation Errors:', errors.array()); // Log validation errors
                return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
            }        

            const organizer = await User.findOne({ email: req.body.organizer_email });
            if (!organizer) {
                return res.status(404).json({ success: false, message: 'Organizer not found' });
            }

            const event = new Event({ ...req.body, organizer: organizer._id });
            await event.save();

            res.status(201).json({ success: true, message: 'Event created successfully', data: event });
        } catch (error) {
            console.error('Error creating event:', error.message); // Log the error
            res.status(500).json({ success: false, message: 'Error creating event', error: error.message });
        }
    }
);

// Get all events with filters and pagination
router.get('/api/events', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {};
        
        if (req.query.search) {
            filter.event_name = { $regex: req.query.search, $options: 'i' };
        }
        if (req.query.startDate && req.query.endDate) {
            filter.event_date = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
        }

        const events = await Event.find(filter).populate('organizer', 'name email').sort({ event_date: 1 }).skip(skip).limit(limit);
        const total = await Event.countDocuments(filter);

        res.status(200).json({ success: true, data: events, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching events', error: error.message });
    }
});

// Get a single event by ID
router.get('/api/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name email');
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching event', error: error.message });
    }
});

// Update event details
router.put('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, message: 'Event updated successfully', data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating event', error: error.message });
    }
});

// Delete an event
router.delete('/api/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting event', error: error.message });
    }
});

// Error-handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!', error: err.message });
});

export default router;
