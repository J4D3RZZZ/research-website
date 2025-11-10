import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Verify logged-in user
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full user info from JWT to req.user
    req.user = decoded; // decoded should include id, role, department, isAdmin
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// ✅ Verify admin only
export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error during admin verification." });
  }
};

// ✅ Verify student only
export const verifyStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied. Students only." });
  }
  next();
};

// ✅ Verify teacher only
export const verifyTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied. Teachers only." });
  }
  next();
};
