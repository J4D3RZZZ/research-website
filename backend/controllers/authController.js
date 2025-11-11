import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password, role, department } = req.body;

    if (!["teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ message: "Username or email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      department,
      isApproved: "pending",
      verificationCode,
      codeExpiry,
      isVerified: false,
    });

    await newUser.save();

    // Send email with code
    await sendEmail(
      email,
      "Verify Your Email Address",
      `<h2>Welcome, ${username}!</h2>
       <p>Your verification code is: <b>${verificationCode}</b></p>
       <p>It expires in 10 minutes.</p>`
    );

    res.status(201).json({
    message: "User registered successfully! Please verify your email.",
    userId: newUser._id,
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { userId, code } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "Already verified" });

    if (!user.codeExpiry || user.codeExpiry < new Date()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    if (parseInt(code) !== user.verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.codeExpiry = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("[BACKEND] Verification error:", error);
    res.status(500).json({ message: "Error verifying email", error });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { loginField, password } = req.body;
    const user = await User.findOne({
      $or: [{ username: loginField }, { email: loginField }],
    });

    console.log("[LOGIN DEBUG] User found:", user ? user.username : "none", "Dept:", user?.department);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first." });
    if (user.isApproved !== "accepted") return res.status(403).json({ message: "Account pending admin approval." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    console.log("[LOGIN DEBUG] User department:", user.department);

    const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
    department: user.department,
    isAdmin: user.isAdmin,
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email, role: user.role, department: user.department, isAdmin: user.isAdmin },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};
