import express from "express";
import { getUsers, approveUser, rejectUser, archiveUser } from "../controllers/adminController.js";

const router = express.Router();

// Fetch all users
router.get("/users", getUsers);

// Approve a user
router.put("/approve/:id", approveUser);

// Reject a user
router.put("/reject/:id", rejectUser);

// Archive a user
router.put("/archive/:id", archiveUser);

export default router;
