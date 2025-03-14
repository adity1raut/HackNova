import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  year: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'], 
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  faculty: {
    type: String,
    required: true,
  },
  files: [{
    url: { type: String },
    filename: { type: String },
    fileType: { type: String },
  }],
  secondFile: {
    url: { type: String }, // Optional second file URL
    filename: { type: String },
    fileType: { type: String },
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  file: {
    url: { type: String },
    filename: { type: String },
    fileType: { type: String },
  },
  status: {
    type: String,
    enum: ['submitted', 'graded', 'in-progress'], // Limits the possible values for status
    default: 'in-progress' // Default status when an assignment is created
  },
  // Add this to explicitly declare the field without uniqueness constraint
  student_email: {
    type: String,
    // No unique constraint
  }
});

// Explicitly remove any existing index on student_email
assignmentSchema.index({ student_email: 1 }, { unique: false });

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;