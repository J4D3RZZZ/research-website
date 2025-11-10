import express from "express";
import { register, verifyEmail, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyEmail);
router.post("/login", login);

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out successfully" });
});

export default router;
