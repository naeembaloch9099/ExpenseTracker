import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { resetPassword } from "../services/Auth";
import { toast } from "../components/Toast";

const Card = styled.div`
  width: 420px;
  padding: 28px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
`;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid reset link");
      nav("/login");
    }
  }, [token, email, nav]);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be 6+ chars");
    if (password !== confirm) return toast.error("Passwords do not match");
    try {
      await resetPassword(email, token, password);
      toast.success("Password updated. Please login.");
      nav("/login");
    } catch (ex) {
      toast.error(ex.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card>
        <h3>Set a new password</h3>
        <form onSubmit={submit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              marginBottom: 8,
            }}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              marginBottom: 12,
            }}
          />
          <button
            style={{
              padding: "10px 14px",
              background: "#6b21a8",
              color: "#fff",
              borderRadius: 8,
            }}
          >
            Update password
          </button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
