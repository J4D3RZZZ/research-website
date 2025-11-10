import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

export const getRoomsWithBookings = async (req, res) => {
  try {
    console.log("REQ USER:", req.user);
    const userDept = req.user?.department; // from token
    if (!userDept) return res.status(400).json({ message: "No department found in token" });

    console.log("User department:", userDept);

    // 🔥 Only get rooms that belong to user's department
    const rooms = await Room.find({ department: userDept });

    // Get all bookings
    const bookings = await Booking.find();

    // Attach bookings to each room
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

    console.log("Rooms with bookings:", roomsWithBookings);

    res.status(200).json(roomsWithBookings);
  } catch (err) {
    console.error("Error fetching rooms with bookings:", err);
    res.status(500).json({ message: "Error fetching rooms", error: err.message });
  }
};
