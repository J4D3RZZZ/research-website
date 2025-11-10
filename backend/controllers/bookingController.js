import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

export const getRoomsWithBookings = async (req, res) => {
  try {
    const userDepartment = req.user.department;

    // Only rooms in the user's department
    const rooms = await Room.find({ department: userDepartment });

    // All bookings
    const bookings = await Booking.find();

    // Attach bookings to rooms
    const roomsWithBookings = rooms.map(room => {
      const roomBookings = bookings
        .filter(b => b.roomId.toString() === room._id.toString())
        .map(b => ({
          teacher: b.teacherName,
          startTime: b.startTime,
          endTime: b.endTime,
          section: b.section
        }));
      return { ...room.toObject(), bookings: roomBookings };
    });

    res.status(200).json(roomsWithBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching rooms with bookings", error: err });
  }
};
