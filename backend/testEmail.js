import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: "YOUR_EMAIL@gmail.com", // replace with your Gmail to receive
      subject: "Test Email",
      text: "If you get this email, nodemailer works!",
    });
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

sendTestEmail();
