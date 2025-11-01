import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["teacher", "student"], required: true },
    isAdmin: { type: Boolean, default: false },
    isApproved: { type: String, enum: ["pending", "accepted", "rejected", "archived"], default: "pending" },
    verificationCode: { type: Number },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
