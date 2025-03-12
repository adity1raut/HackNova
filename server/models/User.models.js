import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    rollno: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    attendance: [
      {
        subject: { type: String, required: true }, 
        presentDays: { type: Number, default: 0 }, 
        totalDays: { type: Number, default: 0 } 
      }
    ],
    profile: {
      type: String,
      required: true,
      default: "https://res.cloudinary.com/dkxk3h8zi/image/upload/v1625582734/Profile/Profile_Icon_1_zjvz6c.png",
    },
    type :{
        type: String,
        default: "Student",
    },
    branch :{
        type: String,
        default: "None",
    },
    year :{
        type: String,
        default: "None",
    },
    createdAt: {
        type: Date,
        default: Date
    },
    updatedAt: {
        type: Date,
        default: Date
    },
    isvoted :{
      type: Boolean,
      default: false,
    } ,

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
