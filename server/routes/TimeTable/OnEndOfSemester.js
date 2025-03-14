import express from "express";
import cron from "node-cron";
import Semester from "../../models/Semester.js";
import User from "../../models/User.models.js";
import TimeTable from "../../models/TimeTable.models.js";

const router = express.Router();

/**
 * Function to check if the semester has ended and delete data
 * This function:
 * 1. Finds the most recent semester
 * 2. Checks if it has ended
 * 3. If ended, deletes timetables, resets user attendance, and marks semester as inactive
 */
const onEndOfSem = async () => {
  try {
    const latestSemester = await Semester.findOne().sort({ endDate: -1 });
    
    if (!latestSemester) {
      console.log(`[${new Date().toISOString()}]  No semester found.`);
      return;
    }
    
    const now = new Date();
    const semesterEndDate = new Date(latestSemester.endDate); // Convert stored date to Date object
    
    if (latestSemester.isActive === false) {
      console.log(`[${new Date().toISOString()}] Semester is already inactive. Skipping cleanup.`);
      return;
    }
    
    if (semesterEndDate <= now) {
      console.log(`[${new Date().toISOString()}] Semester has ended. Running cleanup...`);
      await TimeTable.deleteMany({});
      console.log(`[${new Date().toISOString()}] All timetables deleted.`);
      await User.updateMany({}, { $unset: { attendance: "" } });
      console.log(`[${new Date().toISOString()}] All user attendance records removed.`);
      await Semester.updateOne({ _id: latestSemester._id }, { $set: { isActive: false } });
      console.log(`[${new Date().toISOString()}] Semester marked as inactive.`);
    } else {
      console.log(`[${new Date().toISOString()}] Semester is still ongoing. No cleanup needed.`);
    }
  } catch (error) {
    console.error("❌ Error during semester cleanup:", error);
  }
};

/**
 * Manual API route to trigger semester cleanup
 * This can be called via POST request to manually run the cleanup process
 */
router.post("/end-semester", async (req, res) => {
  try {
    await onEndOfSem();
    res.status(200).json({ 
      success: true,
      message: "Semester cleanup completed successfully (if applicable)." 
    });
  } catch (error) {
    console.error("Error in end-semester route:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete semester cleanup",
      error: error.message
    });
  }
});

/**
 * Route to check semester status
 * Returns information about the current semester and its end date
 */
router.get("/status", async (req, res) => {
  try {
    const latestSemester = await Semester.findOne().sort({ endDate: -1 });
    
    if (!latestSemester) {
      return res.status(404).json({
        success: false,
        message: "No semester found" 
      });
    }
    
    const now = new Date();
    const semesterEndDate = new Date(latestSemester.endDate);
    const daysRemaining = Math.ceil((semesterEndDate - now) / (1000 * 60 * 60 * 24));
    
    res.status(200).json({
      success: true,
      data: {
        semesterId: latestSemester._id,
        name: latestSemester.name,
        isActive: latestSemester.isActive,
        endDate: latestSemester.endDate,
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        hasEnded: semesterEndDate <= now
      }
    });
  } catch (error) {
    console.error("Error checking semester status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check semester status",
      error: error.message
    });
  }
});

/**
 * Initialize scheduler for automatic semester cleanup
 * This sets up a daily job to check if the semester has ended
 */
const initSemesterScheduler = () => {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running scheduled semester end check...`);
    await onEndOfSem();
  });
  
  console.log(`[${new Date().toISOString()}] Semester end scheduler initialized`);
};

// Initialize the scheduler when this module is imported
initSemesterScheduler();

// Export the router as default export
export default router;

// Export the utility functions as named exports
export { onEndOfSem, initSemesterScheduler };