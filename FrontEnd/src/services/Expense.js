// src/services/Expense.js
import axios from "axios";

const API = "http://localhost:5000/api";

export const getExpenses = async (token) => {
  const { data } = await axios.get(`${API}/expense`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const addExpense = async (expense, token) => {
  const { data } = await axios.post(`${API}/expense`, expense, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteExpense = async (id, token) => {
  const { data } = await axios.delete(`${API}/expense/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateExpense = async (id, expense, token) => {
  const { data } = await axios.put(`${API}/expense/${id}`, expense, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
