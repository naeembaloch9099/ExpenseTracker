// src/pages/AddIncome.jsx
import React, { useState, useContext } from "react";
import { toast } from "../components/Toast";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import IconPickerModal from "../components/IconPickerModel";
import { GlobalContext } from "../context/GlobalState";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  background: #f9fafb;

  @media (max-width: 700px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const FormWrapper = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(59, 53, 94, 0.07);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #374151;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
`;

const Button = styled.button`
  padding: 12px;
  background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

const AddIncome = ({ onClose }) => {
  const { addIncome, error } = useContext(GlobalContext);
  const nav = useNavigate();

  const [form, setForm] = useState({ title: "", amount: "", date: "" });
  const [icon, setIcon] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.title || !form.amount || !form.date) {
      setErr("All fields required");
      toast.error("All fields required");
      return;
    }

    // Convert icon to a safe primitive to avoid huge / circular objects in request
    const safeIcon =
      icon && typeof icon === "object"
        ? icon.name ||
          icon.id ||
          (icon.iconElement && icon.iconElement.props?.children) ||
          ""
        : icon || "";

    const payload = { ...form, icon: safeIcon };

    // Log payload so you can inspect it in DevTools Console -> Network
    console.log("AddIncome -> payload:", payload);

    setSubmitting(true);
    try {
      // call context API
      await addIncome(payload);

      toast.success("Income added successfully!");
      if (onClose) onClose();
      else nav("/income");
    } catch (ex) {
      // Print full error for debugging
      console.error("AddIncome -> caught error:", ex);

      // Try to extract server message (Axios or fetch style)
      const serverMsg =
        ex?.response?.data?.message || // axios
        ex?.response?.data || // axios other
        ex?.message || // generic
        "Failed to add income";

      setErr(serverMsg);
      toast.error(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 900;

  return (
    <Container>
      {!onClose && (
        <Navbar
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          open={sidebarOpen}
        />
      )}
      <Main>
        {!onClose && (
          <Sidebar
            collapsed={isMobile}
            open={sidebarOpen}
            onRequestClose={() => setSidebarOpen(false)}
          />
        )}
        <FormWrapper>
          <Title>Add Income</Title>
          <Form onSubmit={submit}>
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              max={new Date().toISOString().slice(0, 10)}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Button
                type="button"
                onClick={() => setShow(true)}
                style={{
                  width: 44,
                  fontSize: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon
                  ? typeof icon === "string"
                    ? icon
                    : icon.iconElement || icon.name
                  : "\ud83e\ude99"}
              </Button>
              <span>Pick Icon</span>
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Income"}
            </Button>
            {(err || error) && (
              <div style={{ color: "red" }}>{err || error}</div>
            )}
          </Form>
        </FormWrapper>
        {show && (
          <IconPickerModal
            onSelect={(i) => {
              setIcon(i);
              setShow(false);
            }}
            onClose={() => setShow(false)}
          />
        )}
      </Main>
    </Container>
  );
};

export default AddIncome;
