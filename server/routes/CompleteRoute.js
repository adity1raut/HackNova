import express from 'express';
import mongoose from 'mongoose';
import Complents from '../models/Complents.model.js';

const router = express.Router();

// POST route to submit a new complaint
router.post('/api/complaints', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                message: 'All fields are required: name, email, subject, message' 
            });
        }
        
        const newComplaint = new Complents({
            name,
            email,
            subject,
            message,
            status: 'unread'
        });
        
        await newComplaint.save();
        
        res.status(201).json({
            message: 'Complaint submitted successfully',
            data: newComplaint
        });
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/api/complaints/users', async (req, res) => {
    try {
        const complaints = await Complents.find(); // Fetch all complaints
        console.log('complaints:', complaints);
        res.json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Failed to fetch complaints' });
    }
});
// GET route to retrieve all complaints
router.get('/api/complaints', async (req, res) => {
    try {
        const complaints = await Complents.find().sort({ createdAt: -1 });
        res.status(200).json({
            message: 'Complaints retrieved successfully',
            data: complaints
        });
    } catch (error) {
        console.error('Error retrieving complaints:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PATCH route to update complaint status
router.patch('/api/complaints/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks, updatedBy } = req.body;

        // Validate complaint ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid complaint ID format'
            });
        }

        // Validate status
        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be either "approved" or "rejected"'
            });
        }

        // Find the complaint first
        const complaint = await Complents.findById(id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        // Prevent updating if already approved or rejected
        if (complaint.status !== 'unread') {
            return res.status(400).json({
                success: false,
                message: `Cannot update status. Complaint is already ${complaint.status}`
            });
        }

        // Update the complaint
        const updatedComplaint = await Complents.findByIdAndUpdate(
            id,
            {
                status,
                statusUpdatedAt: new Date(),
                statusUpdatedBy: updatedBy || 'system',
                remarks: remarks || null
            },
            {
                new: true,
                runValidators: true
            }
        );

        // Send email notification (implement your email service)
        // await sendStatusUpdateEmail(complaint.email, status, remarks);

        res.status(200).json({
            success: true,
            message: 'Complaint status updated successfully',
            data: updatedComplaint
        });

    } catch (error) {
        console.error('Error updating complaint status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Helper route to get complaints by status
router.get('/api/complaints/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        
        if (!['unread', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status parameter'
            });
        }

        const complaints = await Complents.find({ status }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: `Complaints with status '${status}' retrieved successfully`,
            count: complaints.length,
            data: complaints
        });

    } catch (error) {
        console.error('Error retrieving complaints:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

export default router;
