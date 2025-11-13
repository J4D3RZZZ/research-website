// backend/models/Rejection.js
import mongoose from "mongoose";

const RejectedUserSchema = new mongoose.Schema({
  username: String,
  email: String,
  role: String,
  department: String,
  rejectedBy: String,
  reason: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("RejectedUser", RejectedUserSchema);
