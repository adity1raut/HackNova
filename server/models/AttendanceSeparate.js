import mongoose from "mongoose";

const AttendanceSeparateSchema = new mongoose.Schema({
    subject: { type: String, required: true }, // Subject Name
    date: { type: Date, required: true, default: Date.now }, // Lecture Date & Time
    facultyEmail: { type: String, required: true }, // Faculty's Email
    year: { 
        type: String, 
        enum: ["First Year", "Second Year", "third Year", "Fourth Year"], 
        required: true 
    }, // Academic Year
    presentStudents: [{ type: String, required: true }], // Array of Present Students' Emails
    absentStudents: [{ type: String, required: true }] // Array of Absent Students' Emails
});

const Attendance = mongoose.model("Attendance", AttendanceSeparateSchema);
export default Attendance;
