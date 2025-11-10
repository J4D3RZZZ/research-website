import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

// Get all rooms with their bookings attached
export const getRoomsWithBookings = async (req, res) => {
  try {
    const userDepartment = req.user.department; // make sure you have this in your auth middleware

    // Get only rooms in the user's department
    const rooms = await Room.find({ department: req.user.department });

    const bookings = await Booking.find();

    const roomsWithBookings = rooms.map((room) => {
      const roomBookings = bookings
        .filter((b) => b.roomId.toString() === room._id.toString())
        .map((b) => ({
          teacher: b.teacherName,
          section: b.section,
          startTime: b.startTime,
          endTime: b.endTime,
        }));
      return {
        ...room.toObject(),
        bookings: roomBookings,
      };
    });

    res.status(200).json(roomsWithBookings);
  } catch (err) {
    console.error("Error fetching rooms with bookings:", err);
    res.status(500).json({ message: "Error fetching rooms", error: err.message });
  }
};
