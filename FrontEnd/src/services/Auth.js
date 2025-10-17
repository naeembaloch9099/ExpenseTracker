// src/services/Auth.js
import axios from "axios";

// Use Vite env var VITE_API_URL if provided (e.g. http://192.168.x.x:5000/api or a tunnel URL).
// Fallback to localhost for local development in the browser on the same machine.
const API = import.meta?.env?.VITE_API_URL || "http://localhost:5000/api";

export const login = async (email, password) => {
  const { data } = await axios.post(`${API}/auth/login`, { email, password });
  return data;
};

export const signup = async (name, email, password, profilePic) => {
  const { data } = await axios.post(`${API}/auth/register`, {
    name,
    email,
    password,
    profilePic,
  });
  return data;
};

export const getProfile = async (token) => {
  const { data } = await axios.get(`${API}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateProfile = async (profile, token) => {
  const { data } = await axios.put(`${API}/auth/profile`, profile, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteAccount = async (token) => {
  const { data } = await axios.delete(`${API}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const logout = () => {
  // Just remove token on frontend
  localStorage.removeItem("et_token");
};

export const requestPasswordReset = async (email) => {
  const { data } = await axios.post(`${API}/auth/request-password-reset`, {
    email,
  });
  return data;
};

export const resetPassword = async (email, token, password) => {
  const { data } = await axios.post(`${API}/auth/reset-password`, {
    email,
    token,
    password,
  });
  return data;
};
