// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users and rooms
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, roomsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users"),
          axios.get("http://localhost:5000/api/rooms"),
        ]);
        setUsers(usersRes.data);
        setRooms(roomsRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUserAction = async (userId, action) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/users/${userId}`,
        { action }
      );
      alert(res.data.message);

      // Refresh users
      const updatedUsers = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(updatedUsers.data);
    } catch (err) {
      console.error("Error updating user:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error updating user");
    }
  };

  if (loading) return <div>Loading admin dashboard...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>Admin Dashboard</h2>

      <h3>Users</h3>
      <table border="1" cellPadding="6" cellSpacing="0" style={{ width: "100%", marginBottom: "30px" }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.department}</td>
              <td>{u.isApproved}</td>
              <td>
                {u.isApproved !== "accepted" && (
                  <button onClick={() => handleUserAction(u._id, "accept")}>Accept</button>
                )}
                {u.isApproved !== "rejected" && (
                  <button onClick={() => handleUserAction(u._id, "reject")}>Reject</button>
                )}
                {u.isApproved !== "archived" && (
                  <button onClick={() => handleUserAction(u._id, "archive")}>Archive</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Room Bookings</h3>
      {rooms.map((room) => (
        <div key={room._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "6px" }}>
          <strong>{room.name}</strong>
          <ul>
            {room.bookings.length === 0 && <li>No bookings</li>}
            {room.bookings.map((b, i) => (
              <li key={i}>
                Prof. {b.teacher} | {b.startTime} - {b.endTime} | {b.section}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
