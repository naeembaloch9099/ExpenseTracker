import React, { createContext, useState, useEffect, useContext } from "react";
import * as IncomeAPI from "../services/Income";
import * as ExpenseAPI from "../services/Expense";
import { toast } from "../components/Toast";
import { AuthContext } from "./Authcontext";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage (set after login)
  const token = localStorage.getItem("et_token");

  // Fetch incomes and expenses from backend
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          IncomeAPI.getIncomes(token),
          ExpenseAPI.getExpenses(token),
        ]);
        setIncomes(
          Array.isArray(incomeRes) ? incomeRes : incomeRes.incomes || []
        );
        setExpenses(
          Array.isArray(expenseRes) ? expenseRes : expenseRes.expenses || []
        );
        setError(null);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [token, user]);

  // CRUD operations
  const addIncome = async (item) => {
    try {
      const res = await IncomeAPI.addIncome(item, token);
      setIncomes((prev) => [res, ...prev]);
      // Optionally refresh from backend for consistency
      try {
        const latest = await IncomeAPI.getIncomes(token);
        setIncomes(Array.isArray(latest) ? latest : latest.incomes || []);
      } catch {}
    } catch (err) {
      setError("Failed to add income");
    }
  };

  const updateIncome = async (id, item) => {
    try {
      const res = await IncomeAPI.updateIncome(id, item, token);
      setIncomes((prev) =>
        prev.map((i) => (i._id === id || i.id === id ? res : i))
      );
      toast.success("Income updated successfully!");
    } catch (err) {
      setError("Failed to update income");
      toast.error("Failed to update income");
    }
  };
  const removeIncome = async (id) => {
    try {
      await IncomeAPI.deleteIncome(id, token);
      setIncomes((prev) => prev.filter((i) => (i._id || i.id) !== id));
      toast.success("Income deleted successfully!");
    } catch (err) {
      setError("Failed to delete income");
      toast.error("Failed to delete income");
    }
  };
  const addExpense = async (item) => {
    try {
      const res = await ExpenseAPI.addExpense(item, token);
      setExpenses((prev) => [res._id ? res : res.expense, ...prev]);
    } catch (err) {
      setError("Failed to add expense");
    }
  };

  const updateExpense = async (id, item) => {
    try {
      const res = await ExpenseAPI.updateExpense(id, item, token);
      setExpenses((prev) =>
        prev.map((e) => (e._id === id || e.id === id ? res : e))
      );
      toast.success("Expense updated successfully!");
    } catch (err) {
      setError("Failed to update expense");
      toast.error("Failed to update expense");
    }
  };
  const removeExpense = async (id) => {
    try {
      await ExpenseAPI.deleteExpense(id, token);
      setExpenses((prev) => prev.filter((e) => (e._id || e.id) !== id));
      toast.success("Expense deleted successfully!");
    } catch (err) {
      setError("Failed to delete expense");
      toast.error("Failed to delete expense");
    }
  };

  const totals = {
    totalIncome: Array.isArray(incomes)
      ? incomes.reduce((s, i) => s + Number(i.amount || 0), 0)
      : 0,
    totalExpense: Array.isArray(expenses)
      ? expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
      : 0,
    balance:
      (Array.isArray(incomes)
        ? incomes.reduce((s, i) => s + Number(i.amount || 0), 0)
        : 0) -
      (Array.isArray(expenses)
        ? expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
        : 0),
  };

  return (
    <GlobalContext.Provider
      value={{
        incomes,
        expenses,
        addIncome,
        updateIncome,
        removeIncome,
        addExpense,
        updateExpense,
        removeExpense,
        totals,
        loading,
        error,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
