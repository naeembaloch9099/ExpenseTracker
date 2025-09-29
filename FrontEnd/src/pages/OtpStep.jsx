import React, { useState } from "react";
import styled from "styled-components";
import { verifyOtp } from "../services/Otp";

const OtpWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.1);
  padding: 40px 32px 32px 32px;
  max-width: 420px;
  margin: 32px auto;
`;
const OtpInput = styled.input`
  font-size: 2rem;
  letter-spacing: 0.5rem;
  text-align: center;
  width: 180px;
  padding: 12px;
  border-radius: 8px;
  border: 1.5px solid #a78bfa;
  margin-bottom: 18px;
`;
const Button = styled.button`
  padding: 12px 0;
  background: linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
`;

const OtpStep = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr("");
    try {
      const res = await verifyOtp(email, otp);
      onSuccess(res);
    } catch (ex) {
      setErr(ex.response?.data?.message || "Invalid OTP");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OtpWrapper>
      <h2>Verify Email</h2>
      <p>Enter the 6-digit OTP sent to your email</p>
      <form onSubmit={submit} style={{ width: "100%" }}>
        <OtpInput
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          required
        />
        {err && <div style={{ color: "red", marginBottom: 8 }}>{err}</div>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Verifying..." : "Verify & Continue"}
        </Button>
      </form>
    </OtpWrapper>
  );
};

export default OtpStep;
