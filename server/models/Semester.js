import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  date: { type: String, required: true },  // YYYY-MM-DD format
  description: { type: String, default: "" },
  type: { type: String, enum: ["normal", "holiday", "exam"], default: "normal" },
});

const semesterSchema = new mongoose.Schema({
  startDate: { type: String, required: true }, // YYYY-MM-DD format
  endDate: { type: String, required: true },   // YYYY-MM-DD format
  isActive: { type: Boolean, default: true },  // Only one active semester allowed
  calendar: [eventSchema], // List of academic events (holidays, exams, normal days)
});

const Semester = mongoose.model("Semester", semesterSchema);

export default Semester;
