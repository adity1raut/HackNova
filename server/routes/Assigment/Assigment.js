import express from 'express';
import Assignment from '../../models/Create-assignment.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Faculty from '../../models/FacultyUse.models.js';
import { v2 as cloudinary } from 'cloudinary';
const router = express.Router();
import { CloudinaryStorage } from 'multer-storage-cloudinary';



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'assignments', // Optional: You can specify a folder in Cloudinary where files will be stored
    allowed_formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xlsx', 'txt', 'zip'],
    resource_type: 'auto', // Automatically detect the resource type (e.g., image, video, document)
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});


const findFacultyByEmail = async (email) => {
    try {
      const faculty = await Faculty.findOne({ email });
      return faculty ? faculty.email : null;
    } catch (error) {
      console.error('Error searching for faculty by email:', error);
      throw error;
    }
  };
  
  router.post('/api/create-assignment', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'secondFile', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const { title, description, dueDate, subject, year, teacherEmail } = req.body;
  
      // Find the faculty email based on the email provided
      const facultyEmail = await findFacultyByEmail(teacherEmail);
      if (!facultyEmail) {
        return res.status(404).json({ message: 'Faculty member not found' });
      }
  
      // Create new assignment
      const newAssignment = new Assignment({
        title,
        description,
        dueDate,
        subject,
        year,
        faculty: facultyEmail,
        files: [],
      });
  
      // Handle main file upload (from Cloudinary)
      if (req.files && req.files.file && req.files.file[0]) {
        const file = req.files.file[0]; // File info returned from Cloudinary
        newAssignment.files.push({
          url: file.path, // Cloudinary file URL
          filename: file.filename, // Cloudinary filename
          fileType: file.mimetype.split('/')[1], // File type (e.g., pdf, docx)
        });
      }
  
      // Handle second file upload (from Cloudinary)
      if (req.files && req.files.secondFile && req.files.secondFile[0]) {
        const secondFile = req.files.secondFile[0]; // File info returned from Cloudinary
        newAssignment.secondFile = {
          url: secondFile.path, // Cloudinary file URL
          filename: secondFile.filename, // Cloudinary filename
          fileType: secondFile.mimetype.split('/')[1], // File type (e.g., pdf, docx)
        };
      }
  
      // Save the assignment
      await newAssignment.save();
  
      res.status(201).json({
        message: 'Assignment created successfully',
        assignment: newAssignment,
      });
    } catch (error) {
      console.error('Error creating assignment:', error);
      res.status(500).json({
        message: 'Failed to create assignment',
        error: error.message,
      });
    }
  });
  
// GET route to fetch all assignments
router.get('/api/assignments', async (req, res) => {
    try {
      const assignments = await Assignment.find().sort({ createdAt: -1 });
      
      res.status(200).json(assignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      res.status(500).json({ 
        message: 'Failed to fetch assignments',
        error: error.message 
      });
    }
  });
  
// GET route to fetch assignments by year and subject
router.get('/api/assignments/:year/:subject', async (req, res) => {
  try {
    const { year, subject } = req.params;
    
    const assignments = await Assignment.find({ 
      year: year,
      subject: subject 
    })
    .populate('teacher', 'name email')
    .sort({ dueDate: 1 });
    
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments by filters:', error);
    res.status(500).json({ 
      message: 'Failed to fetch assignments',
      error: error.message 
    });
  }
});

// GET route to fetch a specific assignment by ID
router.get('/api/assignment/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('teacher', 'name email');
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.status(200).json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ 
      message: 'Failed to fetch assignment',
      error: error.message 
    });
  }
});

// PUT route to update an assignment
// PUT route to update an assignment
router.put('/api/assignment/:id', upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'secondFile', maxCount: 1 }
]), async (req, res) => {
  try {
      const assignment = await Assignment.findById(req.params.id);
      
      if (!assignment) {
          return res.status(404).json({ message: 'Assignment not found' });
      }
      
      const { title, description, dueDate, subject, year } = req.body;
      
      // Update fields
      assignment.title = title || assignment.title;
      assignment.description = description || assignment.description;
      assignment.dueDate = dueDate || assignment.dueDate;
      assignment.subject = subject || assignment.subject;
      assignment.year = year || assignment.year;
      
      // Handle main file upload
      if (req.files && req.files.file && req.files.file[0]) {
          const file = req.files.file[0]; // File info returned from Cloudinary
          
          // Delete old file from Cloudinary if it exists
          if (assignment.files && assignment.files.length > 0 && assignment.files[0].filename) {
              try {
                  // Extract public_id from filename or URL if needed
                  const publicId = `assignments/${assignment.files[0].filename.split('.')[0]}`;
                  await cloudinary.uploader.destroy(publicId);
              } catch (deleteError) {
                  console.error('Error deleting old file from Cloudinary:', deleteError);
                  // Continue with the update even if deletion fails
              }
              assignment.files = [];
          }
          
          assignment.files.push({
              url: file.path, // Cloudinary file URL
              filename: file.filename, // Cloudinary filename
              fileType: file.mimetype.split('/')[1], // File type (e.g., pdf, docx)
          });
      }
      
      // Handle second file upload
      if (req.files && req.files.secondFile && req.files.secondFile[0]) {
          const secondFile = req.files.secondFile[0]; // File info returned from Cloudinary
          
          // Delete old second file from Cloudinary if it exists
          if (assignment.secondFile && assignment.secondFile.filename) {
              try {
                  // Extract public_id from filename or URL
                  const publicId = `assignments/${assignment.secondFile.filename.split('.')[0]}`;
                  await cloudinary.uploader.destroy(publicId);
              } catch (deleteError) {
                  console.error('Error deleting old second file from Cloudinary:', deleteError);
                  // Continue with the update even if deletion fails
              }
          }
          
          assignment.secondFile = {
              url: secondFile.path, // Cloudinary file URL
              filename: secondFile.filename, // Cloudinary filename
              fileType: secondFile.mimetype.split('/')[1], // File type (e.g., pdf, docx)
          };
      }
      
      await assignment.save();
      
      res.status(200).json({ 
          message: 'Assignment updated successfully',
          assignment 
      });
  } catch (error) {
      console.error('Error updating assignment:', error);
      res.status(500).json({ 
          message: 'Failed to update assignment',
          error: error.message 
      });
  }
});

router.delete('/api/assignment/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Delete assignment files from Cloudinary
    if (assignment.files && assignment.files.length > 0) {
      for (const file of assignment.files) {
        if (file.filename) {
          try {
            // Extract public_id from filename or URL with PDF-specific handling
            const publicId = file.fileType === 'pdf'
              ? `assignments/pdfs/${file.filename.split('.')[0]}`
              : `assignments/${file.filename.split('.')[0]}`;
              
            await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
          } catch (deleteError) {
            console.error('Error deleting file from Cloudinary:', deleteError);
            // Continue with deletion even if file removal fails
          }
        }
      }
    }
    
    // Delete second file from Cloudinary if exists
    if (assignment.secondFile && assignment.secondFile.filename) {
      try {
        // Extract public_id from filename or URL with PDF-specific handling
        const publicId = assignment.secondFile.fileType === 'pdf'
          ? `assignments/pdfs/${assignment.secondFile.filename.split('.')[0]}`
          : `assignments/${assignment.secondFile.filename.split('.')[0]}`;
          
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      } catch (deleteError) {
        console.error('Error deleting second file from Cloudinary:', deleteError);
        // Continue with deletion even if file removal fails
      }
    }
    
    await Assignment.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ 
      message: 'Failed to delete assignment',
      error: error.message 
    });
  }
});

export default router;