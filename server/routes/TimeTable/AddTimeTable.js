import TimeTable from "../../models/TimeTable.models.js"
import express from 'express';

const router = express.Router();

router.post('/api/add-timetable', async (req, res) => {
    console.log("Received Request");

    try {
        const { year, department, semester, timetable } = req.body;
        console.log("Request Body:", JSON.stringify(req.body, null, 2)); // Debugging log

        // Validate required fields
        if (!year || !department || !semester || !timetable || typeof timetable !== "object") {
            return res.status(400).json({ error: "All required fields must be provided correctly" });
        }

        // Define allowed days
        const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
        
        // Helper function to check for duplicate time slots in a single day
        const validateUniqueTimeSlots = (slots) => {
            if (!Array.isArray(slots)) return false; // Ensure it's an array
            const timeSet = new Set(slots.map(slot => slot.time));
            return timeSet.size === slots.length;
        };

        // Format timetable data properly
        let formattedTimetable = {};
        for (let day of daysOfWeek) {
            formattedTimetable[day] = Array.isArray(timetable[day]) ? [...timetable[day]] : [];
            
            // Validate for duplicate time slots
            if (!validateUniqueTimeSlots(formattedTimetable[day])) {
                return res.status(400).json({ error: `Duplicate time slots found on ${day}` });
            }
        }

        // Ensure formattedTimetable is properly structured
        console.log("Formatted Timetable:", JSON.stringify(formattedTimetable, null, 2));

        // Create and save new timetable
        const existingTimetable = await TimeTable.findOne({ year, department, semester });
        if (existingTimetable) {
            return res.status(400).json({ error: "A timetable for this year, department, and semester already exists." });
        }
        const newTimetable = new TimeTable({
            year,
            department,
            semester,
            monday: formattedTimetable.monday,
            tuesday: formattedTimetable.tuesday,
            wednesday: formattedTimetable.wednesday,
            thursday: formattedTimetable.thursday,
            friday: formattedTimetable.friday
        });

        await newTimetable.save();
        res.status(201).json({ message: "TimeTable created successfully", newTimetable });

    } catch (error) {
        console.error("Error creating TimeTable:", error);
        res.status(500).json({ error: "An error occurred while creating the TimeTable" });
    }
});



export default router;
