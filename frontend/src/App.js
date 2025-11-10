import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StudentRooms from "./pages/StudentRooms";
import TeacherRooms from "./pages/TeacherRooms";
import Register from "./pages/Register";
import ConfirmCode from "./pages/ConfirmCode";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/Login";
import axios from "axios";
import AdminDashboard from "./pages/AdminDashboard";
import Landing from "./pages/Landing";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <BrowserRouter>
      {user && (
        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            background: "#ff6b6b",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )}

      <Routes>
        <Route
          path="/student"
          element={
            user?.role === "student" ? (
              <StudentRooms user={user} />
            ) : (
              <Navigate to="/unauthorized" replace />
            )
          }
        />
        <Route
          path="/teacher"
          element={
            user?.role === "teacher" ? (
              <TeacherRooms user={user} />
            ) : (
              <Navigate to="/unauthorized" replace />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm/:userId" element={<ConfirmCode />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
