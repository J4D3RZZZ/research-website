import express from "express";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

const router = express.Router();

// Create a booking
router.post("/", async (req, res) => {
  try {
    const { roomId, teacherId, teacherName, startTime, endTime, section } = req.body;

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      roomId,
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
        { startTime: { $lte: new Date(startTime) }, endTime: { $gte: new Date(endTime) } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ message: "Room is already booked for the selected time." });
    }

    const booking = new Booking({ roomId, teacherId, teacherName, startTime, endTime, section });
    await booking.save();

    res.status(201).json({ message: "Room booked successfully!", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Error booking room", error: err });
  }
});

// Get all bookings (for rooms page)
router.get("/", async (req, res) => {
  try {
    // Populate room info if needed
    const bookings = await Booking.find().populate("roomId", "name");
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Error fetching bookings", error: err });
  }
});

export default router;
