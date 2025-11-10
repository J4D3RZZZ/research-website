import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        loginField,
        password,
      });

      // Save token in localStorage
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);

      alert("Login successful!");

      // Redirect based on role
      if (response.data.user.role === "teacher") {
        navigate("/teacher");
      } else if (response.data.user.role === "student") {
        navigate("/student");
      } else if (response.data.user.isAdmin) {
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: "50px auto", display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        type="text"
        placeholder="Username or Email"
        value={loginField}
        onChange={(e) => setLoginField(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
