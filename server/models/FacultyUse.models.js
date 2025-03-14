import mongoose from 'mongoose';
import { type } from 'os';

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  specialization:{
    type:String 
  },
  department: {
    type: String,
  },
  designation: {
    type: String,
  },
  type: {
    type: String,
    enum: ['faculty', 'secretary', 'club' , "doctor", "admin"],
    default: 'faculty'
  },
  position: {
    type: String
  },
  profileImage: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;
