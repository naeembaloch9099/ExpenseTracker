import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/Transactions";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import AddIncome from "./pages/AddIncome";
import AddExpense from "./pages/AddExpense";
import IconPicker from "./pages/IconPicker";
import DeleteConfirm from "./pages/DeleteConfirm";
import NotFound from "./pages/NotFound";
import { AuthContext } from "./context/Authcontext";

/**
 * Simple protected route wrapper
 */
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <TransactionsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/income"
        element={
          <PrivateRoute>
            <Income />
          </PrivateRoute>
        }
      />
      <Route
        path="/expense"
        element={
          <PrivateRoute>
            <Expense />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-income"
        element={
          <PrivateRoute>
            <AddIncome />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-expense"
        element={
          <PrivateRoute>
            <AddExpense />
          </PrivateRoute>
        }
      />
      <Route
        path="/icon-picker"
        element={
          <PrivateRoute>
            <IconPicker />
          </PrivateRoute>
        }
      />
      <Route
        path="/delete-confirm"
        element={
          <PrivateRoute>
            <DeleteConfirm />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
