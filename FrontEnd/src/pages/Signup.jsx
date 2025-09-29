import React, { useState, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { sendOtp } from "../services/Otp";
import OtpStep from "./OtpStep";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #f3e8ff 0%, #f8fafc 100%);
`;

const Form = styled.form`
  width: 420px;
  background: #fff;
  padding: 40px 32px 32px 32px;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
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
          <Title>Create Account</Title>
          <Subtitle>Sign up to manage your expenses and income</Subtitle>
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
          <div style={{ position: "relative", width: "100%" }}>
            <Input
              type={show ? "text" : "password"}
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
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              style={{
                position: "absolute",
                right: 10,
                top: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <label style={{ alignSelf: "flex-start", color: "#7c3aed" }}>
            Profile Picture (optional)
          </label>
          <FileInput type="file" accept="image/*" onChange={onFile} />
          {preview && <Preview src={preview} alt="preview" />}
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
          <Button type="submit" disabled={sending}>
            {sending ? "Sending OTP..." : "SIGN UP"}
          </Button>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <span>Already have an account? </span>
            <a href="/login">Login</a>
          </div>
        </Form>
      ) : (
        <OtpStep email={form.email} onSuccess={handleOtpSuccess} />
      )}
    </Container>
  );
};

export default Signup;
