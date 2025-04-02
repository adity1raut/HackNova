import mongoose from 'mongoose';

const eventBookingSchema = new mongoose.Schema({
    faculty_information: {
        organizingFaculty: { type: String, required: true },
        facultyDepartment: { type: String, required: true },
        facultyEmail: { type: String, required: true, match: /.+\@.+\..+/ },
        facultyPhone: { type: String, required: true }
    },
    event_information: {
        eventName: { type: String, required: true },
        eventDescription: { type: String, required: true },
        eventLocation: { type: String, required: true }
    },
    event_schedule: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        expectedAttendees: { type: Number, required: true }
    },
    additional_information: {
        websiteDisplay: { type: String, required: true },
        additionalRequirements: { type: String, default: '' }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    admin_remarks: {
        type: String,
        default: ''
    },
    reviewed_by: {
        type: String,
        default: null
    },
    reviewed_at: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Event = mongoose.model('EventBooking', eventBookingSchema);

export default Event;