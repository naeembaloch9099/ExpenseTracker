// src/services/Otp.js
import axios from "axios";

// Use Vite env var VITE_API_URL if provided. Fallback to localhost for same-machine dev.
const API = import.meta?.env?.VITE_API_URL || "http://localhost:5000/api";

export const sendOtp = async (payload) => {
  const { data } = await axios.post(`${API}/auth/send-otp`, payload);
  return data;
};

export const verifyOtp = async (email, otp) => {
  const { data } = await axios.post(`${API}/auth/verify-otp`, { email, otp });
  return data;
};
