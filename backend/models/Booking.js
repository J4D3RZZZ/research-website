import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teacherName: String,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  section: String,
});

export default mongoose.model("Booking", bookingSchema);
