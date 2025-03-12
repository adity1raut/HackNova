import mongoose from "mongoose";
import moment from "moment"; // For time calculations

// Define time slot schema
const timeTableSlotSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    facultyEmail: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/i.test(value);
            },
            message: "Time must be in the format HH:MM AM/PM"
        }
    },
    endTime: {
        type: String
    }
});

// Middleware to calculate `endTime` before saving
timeTableSlotSchema.pre("save", function (next) {
    if (this.time) {
        this.endTime = moment(this.time, "hh:mm A").add(1, "hour").format("hh:mm A");
    }
    next();
});

// Function to check uniqueness of time slots
const validateUniqueTimeSlots = function (slots) {
    if (!Array.isArray(slots)) return false; // Ensure input is an array
    const timeSet = new Set(slots.map(slot => slot.time));
    return timeSet.size === slots.length;
};

// Define timetable schema
const timeTableSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true,
        enum: ["first", "second", "third", "fourth"]
    },
    department: {
        type: String,
        required: true,
        enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"]
    },
    semester: {
        type: String,
        required: true,
        enum: ["first", "second"]
    },
    monday: {
        type: [timeTableSlotSchema],
        default: [],
        validate: {
            validator: validateUniqueTimeSlots,
            message: "Time slots must be unique for Monday."
        }
    },
    tuesday: {
        type: [timeTableSlotSchema],
        default: [],
        validate: {
            validator: validateUniqueTimeSlots,
            message: "Time slots must be unique for Tuesday."
        }
    },
    wednesday: {
        type: [timeTableSlotSchema],
        default: [],
        validate: {
            validator: validateUniqueTimeSlots,
            message: "Time slots must be unique for Wednesday."
        }
    },
    thursday: {
        type: [timeTableSlotSchema],
        default: [],
        validate: {
            validator: validateUniqueTimeSlots,
            message: "Time slots must be unique for Thursday."
        }
    },
    friday: {
        type: [timeTableSlotSchema],
        default: [],
        validate: {
            validator: validateUniqueTimeSlots,
            message: "Time slots must be unique for Friday."
        }
    }
});

export default mongoose.model("TimeTable", timeTableSchema);
