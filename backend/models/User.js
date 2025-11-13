import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["teacher", "student"], required: true },
    department: {
      type: String,
      enum: ["CEAT", "CM", "BINDTECH", "COED"],
      required: true,
    },
    isAdmin: { type: Boolean, default: false },
    isApproved: {
      type: String,
      enum: ["pending", "accepted", "rejected", "archived"],
      default: "pending",
    },
    rejected: [
    {
      gmail: String,
      reason: String,
      rejectedBy: String,
      date: Date,
    },
  ],
    verificationCode: { type: Number },
    codeExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
