import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    lastdate: {
        type: String,
    },
    status: {
        type: String,
        default: "pending",
    },
}, {
    timestamps: true,
});

export default mongoose.model("Booking", BookingSchema);
