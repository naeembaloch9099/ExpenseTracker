// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
import User from "../Models/User.js";
import Otp from "../Models/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import ResetToken from "../Models/ResetToken.js";
// SMTP config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fa21-bce-100@cuilahore.edu.pk",
    pass: "lwlh bjdu uvgh rmar",
  },
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOtp = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });
    const otp = generateOtp();
    await Otp.findOneAndDelete({ email }); // Remove any previous OTPs
    await Otp.create({ email, otp, name, password, profilePic });
    await transporter.sendMail({
      from: "Expense Tracker <fa21-bce-100@cuilahore.edu.pk>",
      to: email,
      subject: "Your OTP for Expense Tracker Signup",
      text: `Your OTP is: ${otp}`,
      html: `<h2>Your OTP is: <b>${otp}</b></h2>`,
    });
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

export const verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpDoc = await Otp.findOne({ email });
    if (!otpDoc || otpDoc.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    // Register user
    const hash = await bcrypt.hash(otpDoc.password, 10);
    const user = await User.create({
      name: otpDoc.name,
      email: otpDoc.email,
      password: hash,
      profilePic: otpDoc.profilePic,
    });
    await Otp.deleteOne({ email });
    // Auto-login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, profilePic });
    res.status(201).json({
      message: "User registered",
      user: { id: user._id, name, email, profilePic: user.profilePic },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Request password reset: create token, persist, and email user a link
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "No account found with email" });

    // create a secure token
    const token = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // remove previous tokens for this email
    await ResetToken.deleteMany({ email });
    await ResetToken.create({ email, token, expiresAt });

    const resetLink = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const html = `<div style="font-family: Arial, sans-serif; color:#111">
      <h2>Password reset request</h2>
      <p>Hello ${user.name || "user"},</p>
      <p>We received a request to reset your Expense Tracker password. Click the button below to set a new password. This link expires in 1 hour.</p>
      <p style="text-align:center; margin:30px 0"><a href="${resetLink}" style="background:#6b21a8;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;">Reset Password</a></p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <p>Thanks,<br/>Expense Tracker Team</p>
    </div>`;

    await transporter.sendMail({
      from: "Expense Tracker <fa21-bce-100@cuilahore.edu.pk>",
      to: email,
      subject: "Expense Tracker — Password Reset",
      html,
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send reset email", error: err.message });
  }
};

// Reset password: verify token & expiry, update user's password
export const resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password)
      return res.status(400).json({ message: "Missing fields" });

    const doc = await ResetToken.findOne({ email, token });
    if (!doc || doc.expiresAt < new Date())
      return res.status(400).json({ message: "Invalid or expired token" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    await user.save();

    // remove used tokens
    await ResetToken.deleteMany({ email });

    res.json({ message: "Password updated" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to reset password", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, profilePic } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name) user.name = name;
    if (profilePic) user.profilePic = profilePic;
    await user.save();
    res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Account deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete account", error: err.message });
  }
};
