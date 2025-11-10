import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

export const getRoomsWithBookings = async (req, res) => {
  try {
    const userDepartment = req.user.department; // make sure JWT has department

    // Only fetch rooms for this department
    const rooms = await Room.find({ department: userDepartment });
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
    console.error(err);
    res.status(500).json({ message: "Error fetching rooms with bookings", error: err });
  }
};
