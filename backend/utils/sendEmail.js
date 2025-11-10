import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables immediately
dotenv.config({ path: "./backend/.env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"CVMS Website" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error; // important: throw so controller knows if sending failed
  }
};
