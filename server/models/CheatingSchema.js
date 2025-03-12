import mongoose from 'mongoose';

const cheatingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100
  },
  reason: {
    type: String,
    required: true,
    maxLength: 1000
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Email validation
  },
  proof: {
    type: String, // URL to the proof image stored in Cloudinary
    required: true
  },
  reportedBy: {
    type: String,
    required: true,
    maxLength: 100
  },
  action :{
    type: String,
    enum: ['Exam Performance Cancellation(EPC)', 'Subject Performance Cancellation(SPC)', 'Whole Performance Cancellation(WPC)'],
    default: 'pending'
  } ,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Cheating = mongoose.model('Cheating', cheatingSchema);

export default Cheating;
