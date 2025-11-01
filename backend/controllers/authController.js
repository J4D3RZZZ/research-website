import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// === EMAIL SETUP === //
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your App Password (NOT your Gmail password)
  },
});

// === REGISTER === //
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate role
    if (!["teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be teacher or student." });
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Create new user (unapproved + unverified)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      isApproved: "pending", // for admin approval
      verificationCode,
      isVerified: false,
    });

    await newUser.save();

    // Send email with verification code
    await transporter.sendMail({
      from: `"Room Scheduler" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <h2>Welcome, ${username}!</h2>
        <p>Thank you for registering as a <b>${role}</b>.</p>
        <p>Your email verification code is:</p>
        <h1 style="color: #007bff;">${verificationCode}</h1>
        <p>Enter this code in the app to verify your email.</p>
      `,
    });

    res.status(201).json({
      message: "User registered successfully! Please verify your email.",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// === VERIFY EMAIL === //
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "Email already verified" });

    if (user.verificationCode !== parseInt(code)) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying email", error });
  }
};

// === LOGIN === //
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if email verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email before logging in" });
    }

    // Check if approved by admin
    if (user.isApproved !== "accepted") {
      return res.status(403).json({ message: "Your account is pending admin approval" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Create token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true if HTTPS
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
