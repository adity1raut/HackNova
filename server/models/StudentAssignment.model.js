import mongoose from 'mongoose';

const studentAssignmentSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  email: {  // Changed from student ID to email
    type: String,
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  grade: {
    type: String,
  },
  feedback: {
    type: String
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
  }
}, { timestamps: true });

const StudentAssignment = mongoose.model('StudentAssignment', studentAssignmentSchema);

export default StudentAssignment;