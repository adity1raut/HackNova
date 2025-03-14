import TimeTable from "../../models/TimeTable.models.js";
import express from "express";
import mongoose from "mongoose";
import moment from "moment"; // For time comparison
import User from "../../models/User.models.js";

const router = express.Router();

router.get("/api/getAttendanceForVisualiation/:studentEmail", async (req, res) => {
    console.log("object")
    try {
        const { studentEmail } = req.params;
        console.log(studentEmail);
    
        const userData = await User.findOne({ email: studentEmail });
        if (!userData) {
            return res.status(404).json({ message: "Student not found" });
        }
        console.log(userData.attendance);
        return res.status(200).json({ attendance: userData.attendance });

    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;