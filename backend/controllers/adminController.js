// controllers/AdminController.js
import User from "../models/User.js";
import Room from "../models/Room.js";
import { sendEmail } from "../utils/sendEmail.js"; // import the email utility

// ✅ Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Approve user
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = "accepted";
    await user.save();

    // Send email notification
    try {
      await sendEmail(
        user.email,
        "CVMS Account Approved",
        `<p>Hi ${user.username}, your CVMS account has been approved. You can now log in.</p>`
      );
      console.log(`Approval email sent to ${user.email}`);
    } catch (err) {
      console.error("Error sending approval email:", err);
    }

    res.status(200).json({ message: `User ${user.username} approved successfully!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Reject user
export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = "rejected";
    await user.save();

    // Send email notification
    try {
      await sendEmail(
        user.email,
        "CVMS Account Rejected",
        `<p>Hi ${user.username}, your CVMS account has been rejected. Please contact admin for details.</p>`
      );
      console.log(`Rejection email sent to ${user.email}`);
    } catch (err) {
      console.error("Error sending rejection email:", err);
    }

    res.json({ message: `${user.username} has been rejected.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Archive user
export const archiveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: "archived" });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: `User ${user.username} archived.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create a room
export const createRoom = async (req, res) => {
  try {
    const { name, location, department, images, usage, capacity } = req.body;

    const existingRoom = await Room.findOne({ name });
    if (existingRoom) return res.status(400).json({ message: "Room already exists" });

    const newRoom = new Room({ name, location, department, images, usage, capacity });
    await newRoom.save();

    res.status(201).json({ message: "Room created successfully", room: newRoom });
  } catch (err) {
    res.status(500).json({ message: "Error creating room", error: err.message });
  }
};
