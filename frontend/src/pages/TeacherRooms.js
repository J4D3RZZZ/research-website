import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherRooms({ user }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    roomId: "",
    startTime: "",
    endTime: "",
    section: "",
  });

  // Fetch rooms for teacher's department
  useEffect(() => {
  const fetchRooms = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Logging inside async function
      console.log("Rooms from backend:", res.data);
      res.data.forEach(r =>
        console.log(r.name, r.department, r.bookings)
      );

      const deptRooms = res.data.filter(
        (room) => room.department === user.department
      );
      setRooms(deptRooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchRooms();
}, [user.department]);


  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Booking function
  const handleBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/rooms/book",
        { ...formData, teacher: user.username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Room booked successfully!");

      // Refresh rooms after booking
      const res = await axios.get("http://localhost:5000/api/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const deptRooms = res.data.filter(
        (room) => room.department === user.department
      );
      setRooms(deptRooms);
    } catch (err) {
      console.error("Booking failed:", err);
      alert(err.response?.data?.message || "Booking failed!");
    }
  };

  if (loading) return <div>Loading rooms...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>Teacher Dashboard ({user.department})</h2>

      {/* Booking form */}
      <form
        onSubmit={handleBook}
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <select
          name="roomId"
          value={formData.roomId}
          onChange={handleChange}
          required
        >
          <option value="">Select Room</option>
          {rooms.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="section"
          placeholder="Section"
          value={formData.section}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />
        <button type="submit">Book Room</button>
      </form>

      {/* Rooms list */}
      {rooms.length === 0 ? (
        <p>No rooms available for your department.</p>
      ) : (
        rooms.map((room) => (
          <div
            key={room._id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
              borderRadius: 6,
            }}
          >
            <strong>{room.name}</strong>
            <ul>
              {room.bookings.length === 0 ? (
                <li>Available</li>
              ) : (
                room.bookings.map((b, i) => (
                  <li key={i}>
                    Occupied by Prof. {b.teacher} |{" "}
                    {new Date(b.startTime).toLocaleTimeString()} -{" "}
                    {new Date(b.endTime).toLocaleTimeString()} | {b.section}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
