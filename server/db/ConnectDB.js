import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb://localhost:27017/myDatabase",
        );
        console.log("MongoDB connected...");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;