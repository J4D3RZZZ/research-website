import User from "../models/User.js";
import Room from "../models/Room.js";
import { sendEmail } from "../utils/sendEmail.js";

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

// Reject user
export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = "rejected";
    await user.save();

    // Send rejection email
    await sendEmail(
      user.email,
      "Account Rejected",
      `<p>Hi ${user.username}, your account has been rejected by the admin.</p>`
    );

    res.json({ message: `User ${user.username} rejected.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// Toggle admin
export const toggleAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ message: `${user.username} admin status is now ${user.isAdmin}`, isAdmin: user.isAdmin });
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
