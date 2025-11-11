import express from "express";
import {
  getUsers,
  approveUser,
  rejectUser,
  archiveUser,
  toggleAdmin,
  getRooms,
  createRoom,
} from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// USERS
router.get("/users", verifyToken, verifyAdmin, getUsers);
router.put("/approve/:id", verifyToken, verifyAdmin, approveUser);
router.put("/reject/:id", verifyToken, verifyAdmin, rejectUser);
router.put("/archive/:id", verifyToken, verifyAdmin, archiveUser);
router.put("/toggle-admin/:id", verifyToken, verifyAdmin, toggleAdmin); // toggle admin status

// ROOMS
router.get("/rooms", verifyToken, verifyAdmin, getRooms);
router.post("/rooms", verifyToken, verifyAdmin, createRoom);

// Export default so server.js can import it easily
export default router;
