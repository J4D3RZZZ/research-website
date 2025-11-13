// backend/controllers/adminController.js
import User from "../models/User.js";
import Room from "../models/Room.js";
import { sendEmail } from "../utils/sendEmail.js";
import RejectedUser from "../models/Rejection.js";

// GET all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve user
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = "accepted";
    await user.save();

    // Send approval email
    await sendEmail(
      user.email,
      "Account Approved",
      `<p>Hi ${user.username}, your account has been approved by the admin.</p>`
    );

    res.json({ message: `User ${user.username} approved successfully!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Reject User

export const rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: "Rejection reason is required" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Save rejection log in separate collection
    await RejectedUser.create({
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
      rejectedBy: req.user.username,
      reason,
    });

    // Delete the user so they can re-register
    await User.findByIdAndDelete(user._id);

    // Send rejection email
    await sendEmail(
      user.email,
      "Account Rejected",
      `<p>Hi ${user.username}, your account has been rejected by the admin.</p>
       <p>Reason: ${reason}</p>`
    );

    res.json({ message: `User ${user.username} rejected and deleted successfully!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRejectedUsers = async (req, res) => {
  try {
    const rejectedUsers = await RejectedUser.find().sort({ date: -1 });
    res.json(rejectedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Archive user
export const archiveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: "archived" });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: `User ${user.username} archived.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create room
export const createRoom = async (req, res) => {
  try {
    const { name, location, department, images, usage } = req.body;

    const existingRoom = await Room.findOne({ name });
    if (existingRoom) return res.status(400).json({ message: "Room already exists" });

    const newRoom = new Room({ name, location, department, images, usage });
    await newRoom.save();

    res.status(201).json({ message: "Room created successfully", room: newRoom });
  } catch (err) {
    res.status(500).json({ message: "Error creating room", error: err.message });
  }
};
