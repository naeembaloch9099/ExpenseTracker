import express from "express";
import {
  register,
  login,
  getProfile,
  sendOtp,
  verifyOtpAndRegister,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  deleteAccount,
} from "../Controllers/authController.js";
import { protect } from "../Middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndRegister);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteAccount);

export default router;
