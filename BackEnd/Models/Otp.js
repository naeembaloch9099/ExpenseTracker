import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  name: { type: String },
  password: { type: String },
  profilePic: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 min expiry
});

export default mongoose.model("Otp", OtpSchema);
