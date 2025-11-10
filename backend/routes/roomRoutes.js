import express from "express";
import { getRoomsWithBookings } from "../controllers/roomController.js";

const router = express.Router();

router.get("/", getRoomsWithBookings);

export default router;
