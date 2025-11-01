import express from "express";
const router = express.Router();

// Temporary route for testing
router.get("/", (req, res) => {
  res.send("API route working!");
});

export default router;
