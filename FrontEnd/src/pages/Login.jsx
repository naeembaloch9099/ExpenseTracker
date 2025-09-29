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
  background: #f8fafc;
`;

const Card = styled.form`
  width: 360px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;
const Button = styled.button`
  background: #7c3aed;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
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
        <h2>Welcome Back</h2>
        <p>Please enter your details to log in</p>
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
        {err && <div style={{ color: "red" }}>{err}</div>}
        <Button type="submit">LOGIN</Button>
        <div style={{ textAlign: "center" }}>
          <span>Don't have an account? </span>
          <Link to="/signup">SignUp</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
