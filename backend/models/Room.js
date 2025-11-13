import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  teacher: String,
  section: String,
  startTime: String,
  endTime: String,
});

const RoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    department: { type: String, enum: ["CEAT", "CM", "BINDTECH", "COED"], required: true },
    images: [{ type: String }], // store image URLs
    usage: { type: String, required: true }, // e.g., "Lecture", "Lab", "Meeting"
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
