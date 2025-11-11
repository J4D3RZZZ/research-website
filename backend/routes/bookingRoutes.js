import express from "express";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get rooms with their bookings
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();

    // Attach bookings to each room
    const roomsWithBookings = await Promise.all(
      rooms.map(async (room) => {
        const bookings = await Booking.find({ roomId: room._id });
        return { ...room.toObject(), bookings };
      })
    );

    res.status(200).json(roomsWithBookings);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ message: "Error fetching rooms", error: err });
  }
});

router.post("/book", verifyToken, async (req, res) => {
  try {
    const { roomId, teacherName, startTime, endTime, section } = req.body;

    // teacher fallback using token
    const teacher = teacherName || req.user.username;
    const teacherId = req.user._id; // ✅ define teacherId here

    console.log("Booking request received:", req.body);
    console.log("Teacher ID:", teacherId);

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      roomId,
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
        { startTime: { $lte: new Date(startTime) }, endTime: { $gte: new Date(endTime) } },
      ],
    });

    if (overlapping) {
      return res.status(400).json({ message: "Room is already booked for the selected time." });
    }

    // ✅ Create the booking properly
    const booking = new Booking({
      roomId,
      teacherId, // ✅ add this safely
      teacherName: teacher,
      startTime,
      endTime,
      section,
    });

    await booking.save();

    res.status(201).json({ message: "Room booked successfully!", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Error booking room", error: err.message });
  }
});

export default router;
