import express from "express";
import cron from "node-cron";
import Semester from "../../models/Semester.js";
import User from "../../models/User.models.js";
import TimeTable from "../../models/TimeTable.models.js";

const router = express.Router();

// Function to check if the semester has ended and delete data
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



// Manual API route to trigger cleanup
// router.post("/end-semester", async (req, res) => {
//   await onEndOfSem();
//   res.status(200).json({ message: "Semester cleanup completed successfully (if applicable)." });
// });

export default onEndOfSem;
