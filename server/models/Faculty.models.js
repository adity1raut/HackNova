import mongoose from "mongoose";

const facultyAvailabilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/
    },
    phone: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    dayOfWeek: {
        type: String,  // e.g., "Monday", "Tuesday", etc.
        required: true
    },
    availableTimeSlots: [{
        start: {
            type: String,  // e.g., "09:00 AM"
            required: true
        },
        end: {
            type: String,  // e.g., "11:00 AM"
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const FacultyAvailability = mongoose.model("FacultyAvailability", facultyAvailabilitySchema);

export default FacultyAvailability;
