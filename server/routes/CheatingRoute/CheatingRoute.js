import express from 'express';
import Cheating from '../../models/CheatingSchema.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Create Express Router
const router = express.Router();

// POST route to submit a new cheating report
// Route to create a new cheating report
router.post('/api/cheating', upload.single('proof'), async (req, res) => {
  try {
    const { name, reason, email, reportedBy, action } = req.body;

    // Validate required fields
    if (!name || !reason || !email || !reportedBy || !req.file || !action) {
      return res.status(400).json({ message: 'All fields are required, including proof image and action' });
    }

    // Upload the image to Cloudinary
    const uploadStream = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    let result;
    try {
      result = await uploadStream(req.file.buffer);
    } catch (uploadError) {
      console.error('Error uploading to Cloudinary:', uploadError);
      return res.status(500).json({ message: 'Error uploading proof image' });
    }

    // Create a new cheating report with the Cloudinary URL
    const newCheatingReport = new Cheating({
      name,
      reason,
      email,
      proof: result.secure_url, // Store the Cloudinary URL
      reportedBy,
      action, // Include action from request body
    });

    // Save the report to the database
    await newCheatingReport.save();

    res.status(201).json({ message: 'Cheating report submitted successfully', data: newCheatingReport });
  } catch (error) {
    console.error('Error submitting cheating report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route to fetch all cheating reports
router.get('/api/cheating', async (req, res) => {
  try {
    const cheatingReports = await Cheating.find({});
    res.status(200).json(cheatingReports);
  } catch (error) {
    console.error('Error fetching cheating reports:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
