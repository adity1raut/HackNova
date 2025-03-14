import TimeTable from "../../models/TimeTable.models.js"
import express from 'express';

const router = express.Router();

router.get('/api/get-timetable', async (req, res) => {
    try {
        const allTimeTables = await TimeTable.find();
        res.status(200).json(allTimeTables);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
})

export default router;