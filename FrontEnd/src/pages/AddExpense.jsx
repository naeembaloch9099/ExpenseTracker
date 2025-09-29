import React, { useState, useContext } from "react";
import { toast } from "../components/Toast";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import IconPickerModal from "../components/IconPickerModel";
import { GlobalContext } from "../context/GlobalState";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(120deg, #fef2f2 0%, #f3e8ff 100%);
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  min-height: 80vh;
`;

const FormWrapper = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.1);
  padding: 40px 32px 32px 32px;
  width: 100%;
  max-width: 420px;
  margin: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 600px) {
    padding: 24px 8px 18px 8px;
    max-width: 98vw;
  }
`;

const Title = styled.h2`
  margin-bottom: 18px;
  color: #ef4444;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  font-size: 1rem;
  background: #fafaff;
  transition: border 0.2s;
  &:focus {
    border: 1.5px solid #fca5a5;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px 0;
  background: linear-gradient(90deg, #fca5a5 0%, #ef4444 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #ef4444 0%, #fca5a5 100%);
  }
`;

const IconButton = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fafaff;
  color: #ef4444;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 8px;
  &:hover {
    background: #fee2e2;
    border: 1.5px solid #ef4444;
  }
`;

const IconPreview = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fafaff;
  font-size: 1.3rem;
  color: #ef4444;
`;

const AddExpense = ({ onClose }) => {
  const { addExpense } = useContext(GlobalContext);
  const [showPicker, setShowPicker] = useState(false);
  const [icon, setIcon] = useState(null);
  const [form, setForm] = useState({ title: "", amount: "", date: "" });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await addExpense({
        title: form.title,
        amount: Number(form.amount),
        date: form.date || new Date().toISOString().slice(0, 10),
        icon: icon?.name,
        iconElement: icon?.iconElement || icon?.name,
      });
      toast.success("Expense added successfully!");
      nav("/expense");
    } catch {
      toast.error("Failed to add expense");
    }
  };

  return (
    <Container>
      <Navbar />
      <Main>
        <FormWrapper>
          <Title>Add Expense</Title>
          <Form onSubmit={submit} autoComplete="off">
            <Input
              placeholder="Category (Groceries, Rent)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <Input
              placeholder="Amount"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              min={1}
            />
            <Input
              placeholder="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              max={new Date().toISOString().slice(0, 10)}
            />
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <IconButton type="button" onClick={() => setShowPicker(true)}>
                {icon ? "Change Icon" : "Pick Icon"}
              </IconButton>
              {icon && (
                <IconPreview>{icon.iconElement || icon.name}</IconPreview>
              )}
            </div>
            <Button type="submit">Add</Button>
          </Form>
        </FormWrapper>
      </Main>
      {showPicker && (
        <IconPickerModal
          onClose={() => setShowPicker(false)}
          onSelect={(ic) => setIcon(ic)}
        />
      )}
    </Container>
  );
};

export default AddExpense;
