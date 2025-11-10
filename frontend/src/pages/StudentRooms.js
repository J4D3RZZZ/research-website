import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentRooms({ user }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

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

      const deptRooms = res.data.filter((room) => room.department === user.department);
      setRooms(deptRooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchRooms();
}, [user.department]);


  if (loading) return <div>Loading rooms...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>Room Availability ({user.department})</h2>
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
