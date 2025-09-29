// src/services/Auth.js
import axios from "axios";

const API = "http://localhost:5000/api";

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
