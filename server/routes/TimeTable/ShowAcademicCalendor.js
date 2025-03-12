import express from "express";
import Semester from "../../models/Semester.js";

const router = express.Router();

// Get the current active semester
router.get("/api/getCurrentSemester", async (req, res) => {
    console.log("object")
  try {
    const semester = await Semester.findOne({ isActive: true });

    if (!semester) {
      return res.status(404).json({ message: "No active semester found." });
    }

    res.json({
      semester,
      isActive: semester.isActive,
    });
  } catch (error) {
    console.error("Error fetching semester:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
