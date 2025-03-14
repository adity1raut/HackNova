
import mongoose from 'mongoose';

// First, fix the model name
const ComplaintsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'approved', 'rejected'],
        default: 'unread'
    },
    statusUpdatedAt: {
        type: Date
    },
    statusUpdatedBy: {
        type: String
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

const Complaints = mongoose.model('Complaints', ComplaintsSchema)

export default Complaints;