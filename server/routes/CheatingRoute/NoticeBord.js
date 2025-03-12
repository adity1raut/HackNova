import express from 'express';
import Notice from '../../models/NoticeBord.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage with file size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Validation middleware
const validateNotice = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('date').notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('details').trim().notEmpty().withMessage('Details are required')
];

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'notices',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

// Error handling middleware
const handleErrors = (err, req, res, next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size should be less than 5MB' });
    }
    return res.status(400).json({ message: 'Error uploading file' });
  }
  res.status(500).json({ message: 'Internal server error' });
};

// Routes
router.post('/api/notice',
  upload.single('image'),
  validateNotice,
  async (req, res) => {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, subject, date, details } = req.body;
      let imageUrl = null;

      // Upload image to Cloudinary if it exists
      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
      }

      const notice = new Notice({
        title,
        subject,
        date,
        details,
        image: imageUrl
      });

      await notice.save();
      res.status(201).json(notice);
    } catch (error) {
      console.error('Error creating notice:', error);
      res.status(500).json({ message: 'Error creating notice' });
    }
});

router.get('/api/notice', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-date' } = req.query;
    const notices = await Notice.find()
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Notice.countDocuments();

    res.status(200).json({
      notices,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices' });
  }
});

router.get('/notice/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.status(200).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notice' });
  }
});

router.delete('/notice/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    if (notice.image) {
      const publicId = notice.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`notices/${publicId}`);
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notice' });
  }
});

router.put('/notice/:id',
  upload.single('image'),
  validateNotice,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const notice = await Notice.findById(req.params.id);
      if (!notice) {
        return res.status(404).json({ message: 'Notice not found' });
      }

      const { title, subject, date, details } = req.body;
      let imageUrl = notice.image;

      if (req.file) {
        // Delete old image if it exists
        if (notice.image) {
          const publicId = notice.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`notices/${publicId}`);
        }
        // Upload new image
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
      }

      const updatedNotice = await Notice.findByIdAndUpdate(
        req.params.id,
        {
          title,
          subject,
          date,
          details,
          image: imageUrl
        },
        { new: true }
      );

      res.status(200).json(updatedNotice);
    } catch (error) {
      res.status(500).json({ message: 'Error updating notice' });
    }
});

router.use(handleErrors);

export default router;