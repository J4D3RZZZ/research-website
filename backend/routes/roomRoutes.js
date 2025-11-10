import express from "express";
import { getRoomsWithBookings } from "../controllers/roomController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all rooms with bookings (only for user's department)
router.get("/", verifyToken, getRoomsWithBookings);

export default router;
