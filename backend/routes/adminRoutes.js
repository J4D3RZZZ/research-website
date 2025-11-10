import express from "express";
import {
  getUsers,
  approveUser,
  rejectUser,
  archiveUser,
  getRooms,
  createRoom,
} from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, getUsers);
router.get("/rooms", verifyToken, verifyAdmin, getRooms);
router.put("/approve/:id", verifyToken, verifyAdmin, approveUser);
router.put("/reject/:id", verifyToken, verifyAdmin, rejectUser);
router.put("/archive/:id", verifyToken, verifyAdmin, archiveUser);
router.post("/rooms", verifyToken, verifyAdmin, createRoom); // <- fixed

export default router;
