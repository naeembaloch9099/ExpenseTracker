import React, { useState, useContext } from "react";
import { toast } from "../components/Toast";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";

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

const Card = styled.form`
  width: 370px;
  background: rgba(255, 255, 255, 0.85);
  padding: 38px 28px 28px 28px;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.13);
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 1;
`;

const Input = styled.input`
  padding: 13px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: #fafaff;
  transition: border 0.2s;
  width: 100%;
  &:focus {
    border: 1.5px solid #a78bfa;
    outline: none;
  }
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
  box-shadow: 0 2px 8px #a78bfa22;
  &:hover {
    background: linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%);
  }
`;

const Login = () => {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      toast.success("Login successful!");
      nav("/dashboard");
    } catch (ex) {
      setErr(ex.message || "Login failed");
      toast.error(ex.message || "Login failed");
    }
  };

  return (
    <Container>
      <Card onSubmit={submit}>
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
          <h2
            style={{
              color: "#7c3aed",
              fontWeight: 700,
              fontSize: "2.1rem",
              margin: 0,
              marginBottom: 4,
            }}
          >
            Welcome Back
          </h2>
          <p
            style={{
              color: "#7c3aed",
              fontSize: "1.1rem",
              marginBottom: 18,
              textAlign: "center",
            }}
          >
            Please enter your details to log in
          </p>
        </div>
        <Input
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
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
        <Button type="submit">LOGIN</Button>
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <span style={{ color: "#7c3aed" }}>Don't have an account? </span>
          <Link
            to="/signup"
            style={{
              color: "#7c3aed",
              fontWeight: 600,
              textDecoration: "underline",
              marginLeft: 2,
            }}
          >
            Sign Up
          </Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
