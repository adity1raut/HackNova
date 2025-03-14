import mongoose from 'mongoose';

const leaveApplicationSchema = new mongoose.Schema({
    student_information: {
        roll_no: { type: String, required: true },
        student_name: { type: String, required: true },
        student_email: { type: String, required: true, match: /.+\@.+\..+/ }
    },
    parent_information: {
        parent_name: { type: String, required: true },
        parent_email: { type: String, required: true, match: /.+\@.+\..+/ }
    },
    leave_details: {
        reason_for_leave: { type: String, required: true },
        leave_start_date: { type: Date, required: true },
        leave_end_date: { type: Date, required: true }
    },
    additional_information: {
        comments: { type: String, default: '' }
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

const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);

export default LeaveApplication;
