import express from 'express';
import User from '../models/User.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import authenticateToken from '../middleware/Auth.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const login = async (req, res) => {
  const { email, password, rollno } = req.body;
  
  console.log('Login attempt:', { email, rollno });

  try {
      const user = await User.findOne({ email });
      
      if (!user) {
          return res.status(400).json({ 
              success: false,
              message: 'Invalid credentials' 
          });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ 
              success: false,
              message: 'Invalid credentials' 
          });
      }

      const token = jwt.sign(
          { 
              userId: user._id, 
              email: user.email,
              rollNumber: user.rollno 
          },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      res.status(200).json({ 
          success: true, 
          token,
          email: user.email,
          rollNumber: user.rollno
      });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
          success: false,
          message: 'Server error' 
      });
  }
};

// Route to fetch user data by email
router.get("/api/user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
}
)

const profile = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: true, message: 'Roll number is required.' });
    }

    const user = await User.findOne({ email }).select('-password').lean();
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found.' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: true, message: 'Server error, please try again later.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, branch, year } = req.body;
    const profileImage = req.file;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found.' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (branch) user.branch = branch;
    if (year) user.year = year;
    if (profileImage) {
      const uploadResponse = await cloudinary.uploader.upload(profileImage.path, {
        folder: 'profile_pictures',
        use_filename: true,
        unique_filename: false,
      });
      user.profile = uploadResponse.secure_url;
    }

    await user.save();

    res.status(200).json({ success: true, message: 'Profile updated successfully.', data: user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: true, message: 'Server error, please try again later.' });
  }
};

router.post('/api/student/login', login);
router.get('/api/profile/:email', authenticateToken, profile);
router.put('/api/profile/:email', authenticateToken, upload.single('profileImage'), updateProfile);

export default router;