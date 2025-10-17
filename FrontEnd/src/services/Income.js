// src/services/Income.js
import axios from "axios";

// Use Vite env var VITE_API_URL if provided. Fallback to localhost for same-machine dev.
const API = import.meta?.env?.VITE_API_URL || "http://localhost:5000/api";

export const getIncomes = async (token) => {
  const { data } = await axios.get(`${API}/income`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const addIncome = async (income, token) => {
  const { data } = await axios.post(`${API}/income`, income, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteIncome = async (id, token) => {
  const { data } = await axios.delete(`${API}/income/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateIncome = async (id, income, token) => {
  const { data } = await axios.put(`${API}/income/${id}`, income, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
