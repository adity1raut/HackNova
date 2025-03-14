import TimeTable from "../../models/TimeTable.models.js"
import express from 'express';

const router = express.Router();

// Update an existing timetable based on year, department, and semester
router.put("/api/edit-timetable", async (req, res) => {
    console.log(req.body)
    const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    try {
        const { year, department, semester,monday,tuesday,wednesday,thursday ,friday} = req.body;

        // Ensure required fields are provided
        if (!year || !department || !semester ) {
            return res.status(400).json({ error: "All required fields must be provided correctly" });
        }

        // Find the timetable based on year, department, and semester
        const existingTimetable = await TimeTable.findOne({ year, department, semester });

        if (!existingTimetable) {
            return res.status(404).json({ error: "Timetable not found for the given criteria" });
        }
        

      
           
                await TimeTable.updateOne(
                    { year, department, semester },  // Find criteria
                    { $set: { "monday":monday,"tuesday":tuesday,"wednesday":wednesday,"thursday":thursday,"friday":friday } } // Update only this specific day
                );
            
       
        const updatedTimetable = await TimeTable.findOne({ year, department, semester });

        res.status(200).json({ message: "Timetable updated successfully", updated: updatedTimetable });
    } catch (error) {
        console.error("Error updating timetable:", error);
        res.status(500).json({ error: "An error occurred while updating the timetable" });
    }
});

export default router;
