import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
    {
  title: 
  { type: String,
     required: true 
  },
  subject: 
  { type: String,
     required: true 
  },
  date:
  { type: Date,
   required: true
 },
  details:
   { type: String,
   required: true },
  image: 
  { type: String }, // Path to the uploaded image
});

export default mongoose.model("Notices", noticeSchema)
