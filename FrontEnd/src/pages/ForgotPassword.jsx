import React, { useState } from "react";
import styled from "styled-components";
import { requestPasswordReset } from "../services/Auth";
import { toast } from "../components/Toast";

const Card = styled.div`
  width: 420px;
  padding: 28px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setStatus("sent");
      toast.success("Password reset email sent");
    } catch (ex) {
      toast.error(ex.response?.data?.message || "Failed to send reset email");
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
        {status === "" ? (
          <form onSubmit={submit}>
            <h3>Forgot your password?</h3>
            <p>Enter your account email and we'll send a reset link.</p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
            <div style={{ marginTop: 12 }}>
              <button
                style={{
                  padding: "10px 14px",
                  background: "#6b21a8",
                  color: "#fff",
                  borderRadius: 8,
                }}
              >
                Send reset email
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h3>Check your inbox</h3>
            <p>If an account exists for that email we've sent a reset link.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
