import express from "express";
import Semester from "../../models/Semester.js";
import TimeTable from "../../models/TimeTable.models.js";
import User from "../../models/User.models.js";

const router = express.Router();

// 🟢 **Start a New Semester**
router.post("/api/startSemester", async (req, res) => {
  try {
    const { startDate, endDate, calendar, events } = req.body;

    // Ensure no active semester already exists
    const existingSemester = await Semester.findOne({ isActive: true });
    if (existingSemester) {
      return res.status(400).json({ message: "An active semester already exists." });
    }

    console.log(calendar,events)
    // Create semester with the given calendar and events
    const newSemester = new Semester({
      startDate,
      endDate,
      isActive: true,
      calendar: calendar.map((date) => ({
        date:date.date,
        description: events[date.date]?.description || "",
        type: events[date.date]?.type || "normal",
      })),
    });

    await newSemester.save();
    res.status(201).json({ message: "Semester started successfully!", semester: newSemester });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error starting semester", error });
  }
});

// 🔵 **Get the Current Active Semester**
router.get("/api/getCurrentSemester", async (req, res) => {
  try {
    const semester = await Semester.findOne({ isActive: true });
    if (!semester) {
      return res.status(404).json({ message: "No active semester found." });
    }
    res.json({ semester });
  } catch (error) {
    res.status(500).json({ message: "Error fetching semester", error });
  }
});

// 🟡 **Update Semester Dates & Events**
router.put("/api/updateSemester", async (req, res) => {
  try {
    const { startDate, endDate, calendar, events } = req.body;
    const semester = await Semester.findOne({ isActive: true });

    if (!semester) {
      return res.status(404).json({ message: "No active semester found to update." });
    }

    // Update semester details
    console.log(calendar,events)
    semester.startDate = startDate;
    semester.endDate = endDate;
    semester.calendar = calendar.map((date) => ({
      date:date.date,
      description: events[date.date]?.description || "",
      type: events[date.date]?.type || "normal",
    }));

    await semester.save();
    res.json({ message: "Semester updated successfully!", semester });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error updating semester", error });
  }
});

// 🔴 **End the Current Semester**
router.post("/api/endSemester", async (req, res) => {
  try {
    const {isYearDone}=req.body;
    const semester = await Semester.findOne({ isActive: true });
   
    if (!semester) {
      return res.status(404).json({ message: "No active semester found." });
    }

    semester.isActive = false;
    await semester.save();

    await TimeTable.deleteMany({});
    if(isYearDone){
      const allUsers = await User.find();
      allUsers.forEach(async (user) => {
        if(user.year=="FE"){
          user.year = "SE";
        }else if(user.year=="SE"){
          user.year = "TE";
        }
        else if(user.year=="TE"){
          user.year = "BE";
        }else if(user.year=="BE"){
          user.year = "alumini";
        }
        await user.save();
      });
    }


    res.json({ message: "Semester ended successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error ending semester", error });
  }
});

export default router;
