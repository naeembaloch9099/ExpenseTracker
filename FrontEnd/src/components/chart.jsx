import React from "react";
import styled from "styled-components";

/**
 * Minimal chart component using SVG to avoid external libs.
 * Props:
 *  - totalIncome, totalExpense
 */
const Container = styled.div`
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(59, 53, 94, 0.06);
`;

const Legend = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  align-items: center;
`;

const ColorDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  background: ${(p) => p.color || "#ccc"};
`;

const SimpleDonut = ({ income = 1, expense = 1 }) => {
  const total = income + expense || 1;
  const inc = (income / total) * 100;
  const exp = (expense / total) * 100;
  // draw two arcs using conic-like circle segments via stroke-dasharray
  const circumference = 2 * Math.PI * 40;
  const incStroke = (inc / 100) * circumference;
  const expStroke = (exp / 100) * circumference;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <g transform="translate(60,60) rotate(-90)">
        <circle r="40" fill="transparent" stroke="#eee" strokeWidth="16" />
        <circle
          r="40"
          fill="transparent"
          stroke="#7c3aed"
          strokeWidth="16"
          strokeDasharray={`${incStroke} ${circumference - incStroke}`}
          strokeLinecap="round"
        />
        <circle
          r="40"
          fill="transparent"
          stroke="#ef4444"
          strokeWidth="8"
          strokeDasharray={`${expStroke} ${circumference - expStroke}`}
          strokeLinecap="butt"
          transform={`rotate(${(inc / 100) * 360})`}
        />
      </g>
    </svg>
  );
};

const Chart = ({ totalIncome = 0, totalExpense = 0 }) => {
  return (
    <Container>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <SimpleDonut income={totalIncome} expense={totalExpense} />
        <div>
          <h4 style={{ margin: 0 }}>Overview</h4>
          <p style={{ margin: "8px 0 0 0" }}>Income & Expenses</p>
          <Legend>
            <ColorDot color="#7c3aed" /> <span>Income</span>
            <ColorDot color="#ef4444" /> <span>Expense</span>
          </Legend>
        </div>
      </div>
    </Container>
  );
};

export default Chart;
