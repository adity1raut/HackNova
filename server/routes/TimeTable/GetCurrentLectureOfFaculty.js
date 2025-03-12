import TimeTable from "../../models/TimeTable.models.js";
import express from "express";
import mongoose from "mongoose";
import moment from "moment";
import User from "../../models/User.models.js";

const router = express.Router();

router.get("/api/getCurrentLecture/:department/:email", async (req, res) => {
    try {
        const { department, email } = req.params;
        console.log(department, email);

        // Get current day and time
        const currentDay = moment().format("dddd").toLowerCase(); // e.g., "monday"
        const currentTime = moment().format("h:mm A"); // Ensure correct format

        // Fetch timetable based on department
        const allTimeTables = await TimeTable.find({ department });

        if (!allTimeTables || allTimeTables.length === 0) {
            return res.status(404).json({ message: "No timetable found for this department" });
        }

        console.log(`Today is: ${currentDay}, Current Time: `);

        for (const timeTable of allTimeTables) {
            console.log(`Checking timetable for year: ${timeTable[currentDay]}`);
            if (timeTable[currentDay]) {
                for (const slot of timeTable[currentDay]) {
                    // Validate slot time
                    console.log("Slot:", slot);
                    if (!slot.time || !moment(slot.time, "h:mm A").isValid()) {
                        console.log(`Skipping invalid time slot: ${slot.time}`);
                        continue;
                    }

                    const slotStartTime = moment(slot.time, "h:mm A");
                    const slotEndTime = slotStartTime.clone().add(1, "hour"); // Clone to avoid issues

                    console.log(`Checking slot: ${slot.facultyEmail} - ${slotStartTime.format("h:mm A")} to ${slotEndTime.format("h:mm A")}`);
                    console.log(`Current time: ${currentTime}`);

                    if (
                        slot.facultyEmail.trim().toLowerCase() === email.trim().toLowerCase() &&
                        moment(currentTime, "h:mm A").isBetween(slotStartTime, slotEndTime, null, "[)")
                    ) {
                        console.log("✅ Lecture found:", slot);
                        console.log(timeTable.year);
                        
                        // Get students of the same branch and year
                        const allStudents = await User.find({ branch: department, year: `${timeTable.year} Year` });
                        console.log(department, timeTable.year, allStudents.length);

                        return res.status(200).json({ lecture: slot, students: allStudents });
                    }
                }
            }
        }

        return res.status(404).json({ message: "No lecture found at the current time" });

    } catch (error) {
        console.error("Error fetching current lecture:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
