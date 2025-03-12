// server/routes/events.js
const router = require('express').Router();
const Event = require('../models/Event');
const { facultyOnly } = require('./auth');

// Get all events (available for both students and faculty)
router.get('/', async (req, res) => {
  try {
    // Filter events by department if specified
    const filter = req.query.department ? { department: req.query.department } : {};
    
    const events = await Event.find(filter)
      .sort({ startDate: 1 })
      .populate('createdBy', 'name department -_id');
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name department -_id');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new event (faculty only)
router.post('/', facultyOnly, async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, department } = req.body;
    
    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      department,
      createdBy: req.user.id
    });
    
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an event (faculty only)
router.put('/:id', facultyOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if the faculty created this event or belongs to the same department
    if (event.createdBy.toString() !== req.user.id && 
        event.department !== req.user.department) {
      return res.status(403).json({ 
        message: 'You can only update events you created or from your department' 
      });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an event (faculty only)
router.delete('/:id', facultyOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if the faculty created this event or belongs to the same department
    if (event.createdBy.toString() !== req.user.id && 
        event.department !== req.user.department) {
      return res.status(403).json({ 
        message: 'You can only delete events you created or from your department' 
      });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;