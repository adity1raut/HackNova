import TimeTable from "../../models/TimeTable.models.js";
import User from "../../models/User.models.js";
import Faculty from '../../models/FacultyUse.models.js';
import express from 'express';

const router = express.Router();

router.get('/api/schedule/:email', async (req, res) => {
    console.log("object")
  try {
    const {  email } = req.params;
    console.log(email);
    let department;
    let year;
    let type;

    const student = await User.findOne({ email: email });
    console.log(student)
    const faculty = await Faculty.findOne({ email: email });
    console.log(faculty)
    if(faculty){
        type = 'faculty';
    }
     if(student){
        type = 'Student';
     }
     console.log(type);
    if (type === 'Student') {
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        department = student.department;
        year = student.year.split(" ")[0]; 

        const timeTable = await TimeTable.find({ branch:department, year });
        console.log(timeTable);
        return res.status(200).json(timeTable[0]);
    } 
    if (type === 'faculty') {
        const allTimeTables = await TimeTable.find();
        let facultySchedule = null;
    
        allTimeTables.forEach(timeTable => {
            let scheduleForFaculty = {
                _id: timeTable._id,
                department: timeTable.branch, 
                year: timeTable.year,
                semester: timeTable.semester,
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: []
            };
    
            ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach(day => {
                const matchedSlots = timeTable[day].filter(slot => slot.facultyEmail === email);
                
                if (matchedSlots.length > 0) {
                    scheduleForFaculty[day].push(...matchedSlots);
                }
            });
    
            // If no schedule is set yet, initialize it with the first valid timetable found
            if (!facultySchedule) {
                facultySchedule = scheduleForFaculty;
            } else {
                // Merge slot data into the existing facultySchedule object
                ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach(day => {
                    facultySchedule[day].push(...scheduleForFaculty[day]);
                });
            }
        });
    
        console.log(facultySchedule);
        return res.status(200).json(facultySchedule);
    }
    
    

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;