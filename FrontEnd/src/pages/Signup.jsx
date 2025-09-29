import React, { useState, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

import { sendOtp } from "../services/Otp";
import OtpStep from "./OtpStep";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(120deg, #a78bfa 0%, #f8fafc 100%);
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 10%;
    left: 60%;
    width: 420px;
    height: 420px;
    background: radial-gradient(circle, #7c3aed55 0%, #fff0 80%);
    filter: blur(40px);
    z-index: 0;
  }
`;

const Form = styled.form`
  width: 420px;
  background: rgba(255, 255, 255, 0.85);
  padding: 40px 32px 32px 32px;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.13);
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 1;
  @media (max-width: 600px) {
    padding: 24px 8px 18px 8px;
    max-width: 98vw;
  }
`;

const Input = styled.input`
  padding: 14px 16px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  font-size: 1rem;
  background: #fafaff;
  transition: border 0.2s;
  width: 100%;
  &:focus {
    border: 1.5px solid #a78bfa;
    outline: none;
  }
`;
const FileInput = styled.input`
  padding: 6px;
`;
const Button = styled.button`
  padding: 14px 0;
  background: linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%);
  }
`;

const Preview = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eee;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  color: #7c3aed;
  font-size: 2.1rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #7c3aed;
  font-size: 1.1rem;
  margin-bottom: 18px;
  text-align: center;
`;

const Signup = () => {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [show, setShow] = useState(false);
  const [preview, setPreview] = useState(null);
  const [err, setErr] = useState("");
  const [step, setStep] = useState(0); // 0 = form, 1 = otp
  const [sending, setSending] = useState(false);

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  // Email validation: must be valid format and common domains
  const checkEmail = React.useCallback((email) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "icloud.com",
      "aol.com",
      "protonmail.com",
      "zoho.com",
      "mail.com",
      "gmx.com",
      "edu.pk",
      "edu.in",
      "edu",
    ];
    if (!emailRegex.test(email)) return false;
    const domain = email.split("@")[1]?.toLowerCase();
    return allowedDomains.some((d) => domain && domain.endsWith(d));
  }, []);

  const checkPassword = React.useCallback((pw) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return passwordRegex.test(pw);
  }, []);

  // Live validation
  React.useEffect(() => {
    setEmailValid(checkEmail(form.email));
  }, [form.email, checkEmail]);
  React.useEffect(() => {
    setPasswordValid(checkPassword(form.password));
  }, [form.password, checkPassword]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!emailValid) {
      setErr("Please enter a valid email address (gmail, yahoo, etc.)");
      window.toast && window.toast.error("Invalid email address");
      return;
    }
    if (!passwordValid) {
      setErr("Password must be 8+ chars, upper/lowercase, digit, special char");
      window.toast && window.toast.error("Weak password");
      return;
    }
    setSending(true);
    try {
      await sendOtp({
        name: form.name,
        email: form.email,
        password: form.password,
        profilePic: preview,
      });
      setStep(1);
      window.toast && window.toast.success("OTP sent to your email");
    } catch (ex) {
      setErr(ex.response?.data?.message || "Failed to send OTP");
      window.toast &&
        window.toast.error(ex.response?.data?.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  // After OTP success, auto-login and go to dashboard
  const handleOtpSuccess = async (res) => {
    // res: { token, user }
    localStorage.setItem("et_token", res.token);
    await login({ email: form.email, password: form.password });
    nav("/dashboard");
  };

  return (
    <Container>
      {step === 0 ? (
        <Form onSubmit={submit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#a78bfa 40%,#7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                boxShadow: "0 2px 12px #a78bfa33",
              }}
            >
              <span
                style={{
                  fontSize: 34,
                  color: "#fff",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                ET
              </span>
            </div>
            <Title style={{ marginBottom: 0 }}>Create Account</Title>
            <Subtitle>Sign up to manage your expenses and income</Subtitle>
          </div>
          <Input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={{
              borderColor:
                form.email.length === 0
                  ? "#e5e7eb"
                  : emailValid
                  ? "#222"
                  : "#ef4444",
              color:
                form.email.length === 0
                  ? undefined
                  : emailValid
                  ? "#222"
                  : "#ef4444",
              background:
                form.email.length === 0
                  ? undefined
                  : emailValid
                  ? undefined
                  : "#fff0f0",
            }}
          />
          <Input
            type="password"
            placeholder="Password (min 8 chars, upper/lowercase, digit, special)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
            style={{
              borderColor:
                form.password.length === 0
                  ? "#e5e7eb"
                  : passwordValid
                  ? "#222"
                  : "#ef4444",
              color:
                form.password.length === 0
                  ? undefined
                  : passwordValid
                  ? "#222"
                  : "#ef4444",
              background:
                form.password.length === 0
                  ? undefined
                  : passwordValid
                  ? undefined
                  : "#fff0f0",
            }}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <label
              style={{
                color: "#7c3aed",
                fontWeight: 600,
                marginBottom: 6,
                fontSize: "1.08rem",
                alignSelf: "center",
              }}
            >
              Profile Picture
            </label>
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: "50%",
                background: "#f3e8ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
                boxShadow: preview ? "0 2px 12px #a78bfa33" : "none",
                border: preview
                  ? "2.5px solid #a78bfa"
                  : "2.5px dashed #a78bfa",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{
                    color: "#a78bfa",
                    fontSize: 32,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    opacity: 0.7,
                  }}
                >
                  ?
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                required
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  left: 0,
                  top: 0,
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
            </div>
            <span
              style={{ color: "#a78bfa", fontSize: "0.98rem", marginBottom: 2 }}
            >
              Click to upload (required)
            </span>
          </div>
          {err && (
            <div
              style={{
                color: "#ef4444",
                border: "1.5px solid #ef4444",
                borderRadius: 6,
                padding: 6,
                width: "100%",
                background: "#fff0f0",
                marginBottom: 8,
              }}
            >
              {err}
            </div>
          )}
          <Button
            type="submit"
            disabled={sending}
            style={{ marginTop: 10, marginBottom: 6 }}
          >
            {sending ? "Sending OTP..." : "SIGN UP"}
          </Button>
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <span style={{ color: "#7c3aed" }}>Already have an account? </span>
            <a
              href="/login"
              style={{
                color: "#7c3aed",
                fontWeight: 600,
                textDecoration: "underline",
                marginLeft: 2,
              }}
            >
              Login
            </a>
          </div>
        </Form>
      ) : (
        <OtpStep email={form.email} onSuccess={handleOtpSuccess} />
      )}
    </Container>
  );
};

export default Signup;
