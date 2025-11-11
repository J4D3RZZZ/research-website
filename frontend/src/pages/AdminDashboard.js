// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      const now = new Date();
      const updatedRooms = res.data.map((room) => {
        const activeBookings = (room.bookings ?? []).filter((b) => new Date(b.endTime) > now);
        return { ...room, bookings: activeBookings };
      });
      setRooms(updatedRooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers();
    fetchRooms();
    setLoading(false);

    const interval = setInterval(() => {
      fetchUsers();
      fetchRooms();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleUserAction = async (userId, action) => {
    try {
      let url;
      if (action === "accept") url = `http://localhost:5000/api/admin/approve/${userId}`;
      else if (action === "reject") url = `http://localhost:5000/api/admin/reject/${userId}`;
      else if (action === "archive") url = `http://localhost:5000/api/admin/archive/${userId}`;
      else if (action === "toggle-admin") url = `http://localhost:5000/api/admin/toggle-admin/${userId}`;

      const res = await axios.put(url);
      alert(res.data.message);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error updating user");
    }
  };

  if (loading) return <div>Loading admin dashboard...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "50px auto" }}>
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
                <button onClick={() => handleUserAction(u._id, "toggle-admin")}>Toggle Admin</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Room Bookings</h3>
      {rooms.map((room) => (
        <div
          key={room._id}
          style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "6px" }}
        >
          <strong>{room.name}</strong> ({room.department})
          <ul>
            {(room.bookings ?? []).length === 0 && <li>No active bookings</li>}
            {(room.bookings ?? []).map((b, i) => (
              <li key={i}>
                Prof. {b.teacherName} |{" "}
                {new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                {new Date(b.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} | Section: {b.section}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
