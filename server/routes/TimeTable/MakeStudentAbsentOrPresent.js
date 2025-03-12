import TimeTable from "../../models/TimeTable.models.js";
import express from "express";
import mongoose from "mongoose";
import moment from "moment"; // For time comparison
import User from "../../models/User.models.js";
import Attendance from "../../models/AttendanceSeparate.js";

const router = express.Router();

router.post("/api/makeStudentAbsentOrPresent", async (req, res) => {
  try {
    const { studentEmail, subject, isPresent,facultyEmail,year } = req.body;
    console.log(studentEmail, subject, isPresent,facultyEmail,year);
    const userData = await User.findOne({ email: studentEmail });
    if (!userData) {
      return res.status(404).json({ message: "Student not found" });
    }
    let count = 0;
    for (let i = 0; i < userData.attendance.length; i++) {
      if (userData.attendance[i].subject === subject) {
        count++;

        userData.attendance[i].totalDays =
          Number(userData.attendance[i].totalDays) + 1;
        if (isPresent === false) {
          userData.attendance[i].presentDays =
            Number(userData.attendance[i].presentDays) - 1;
        } else {
          userData.attendance[i].presentDays =
            Number(userData.attendance[i].presentDays) + 1;
        }
        break;
      }
    }
    if (count === 0) {
      if (isPresent === true) {
        userData.attendance.push({
          subject: subject,
          presentDays: 1,
          totalDays: 1,
        });
      } else {
        userData.attendance.push({
          subject: subject,
          presentDays: 0,
          totalDays: 1,
        });
      }
    }
    await userData.save();
    const today = new Date().toISOString().split("T")[0]; // Get current date (YYYY-MM-DD)

    // Check if attendance has already been marked today
    const attendanceEntry = await Attendance.findOne({
      subject,
      facultyEmail,
      year,
      date: { $gte: new Date(today), $lt: new Date(today + "T23:59:59.999Z") },
    });

    if (attendanceEntry) {
      if (
        attendanceEntry.presentStudents.includes(studentEmail) ||
        attendanceEntry.absentStudents.includes(studentEmail)
      ) {
        return res.status(400).json({ message: "Attendance already recorded for this student." });
      }

      // Update existing attendance entry
      if (isPresent) {
        attendanceEntry.presentStudents.push(studentEmail);
      } else {
        attendanceEntry.absentStudents.push(studentEmail);
      }

      await attendanceEntry.save();
    } else {
      // Create new attendance entry if not found
      const newAttendance = new Attendance({
        subject,
        facultyEmail,
        year,
        date: new Date(),
        presentStudents: isPresent ? [studentEmail] : [],
        absentStudents: !isPresent ? [studentEmail] : [],
      });

      await newAttendance.save();
    }
   const attendanceData=await Attendance.findOne({subject,facultyEmail,year,date: { $gte: new Date(today), $lt: new Date(today + "T23:59:59.999Z") }})
    return res.status(200).json({ message: "Attendance updated successfully",data:attendanceData });
  } catch (error) {
    console.error("Error making student absent or present:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
