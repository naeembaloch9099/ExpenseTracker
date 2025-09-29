import React, { useContext, useState } from "react";
import { toast } from "../components/Toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { GlobalContext } from "../context/GlobalState";
import { FaArrowUp } from "react-icons/fa";
import IncomeCard from "../components/IncomeCard";
import { useNavigate } from "react-router-dom";
import AddIncome from "./AddIncome";

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;
const Main = styled.main`
  display: flex;
  gap: 20px;
  padding: 20px 0 20px 240px;
  @media (max-width: 900px) {
    flex-direction: column;
    padding: 10px 0 10px 0;
    gap: 10px;
  }
`;

const Content = styled.div`
  flex: 1;
  font-size: 1.18rem;
  line-height: 1.7;
  font-family: "Segoe UI", "Roboto", Arial, sans-serif;
  padding: 8px 0 0 0;
  @media (max-width: 900px) {
    width: 100%;
    font-size: 1.05rem;
  }
`;

const Income = () => {
  const { incomes, removeIncome, updateIncome, loading, error } =
    useContext(GlobalContext);
  const [collapsed] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const navigate = useNavigate();

  // Download handler
  const handleDownload = () => {
    const data = incomes.map((inc) => ({
      Title: inc.title,
      Amount: inc.amount,
      Date: inc.date,
      Icon: inc.icon || inc.iconElement || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Income");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "income.xlsx"
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <Layout>
      <Navbar />
      <Main>
        <Sidebar collapsed={window.innerWidth <= 700} />
        <Content>
          {/* Income Overview Bar Chart */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 6px 18px rgba(59,53,94,0.04)",
              padding: 24,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
                gap: 10,
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>Income Overview</h3>
                <div style={{ color: "#888", fontSize: 14 }}>
                  Track your earnings over time and analyze your income trends.
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleDownload}
                  style={{
                    padding: "8px 16px",
                    background: "#e0e7ff",
                    color: "#3730a3",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  Download Excel
                </button>
                <button
                  onClick={() => setShowAddIncome(true)}
                  style={{
                    padding: "8px 16px",
                    background: "#f3e8ff",
                    color: "#7c3aed",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  + Add Income
                </button>
              </div>
            </div>

            {/* Bar Chart */}
            <div style={{ width: "100%", overflowX: "auto", paddingBottom: 8 }}>
              <svg
                width={Math.max(700, incomes.length * 80)}
                height="220"
                style={{ minWidth: 700 }}
              >
                {/* Y axis grid lines and labels */}
                {[0, 3500, 7000, 10500, 14000].map((y, i) => (
                  <g key={i}>
                    <line
                      x1={60}
                      x2={Math.max(700, incomes.length * 80) - 20}
                      y1={200 - (y / 14000) * 180}
                      y2={200 - (y / 14000) * 180}
                      stroke="#eee"
                    />
                    <text
                      x={30}
                      y={205 - (y / 14000) * 180}
                      fontSize="12"
                      fill="#aaa"
                      textAnchor="end"
                    >
                      {y}
                    </text>
                  </g>
                ))}

                {/* Bars */}
                {incomes.slice(0, 10).map((inc, i) => (
                  <g key={inc._id || inc.id}>
                    <rect
                      x={70 + i * 60}
                      y={200 - (Math.min(inc.amount, 14000) / 14000) * 180}
                      width={40}
                      height={(Math.min(inc.amount, 14000) / 14000) * 180}
                      rx={8}
                      fill={i % 2 === 0 ? "#a78bfa" : "#6366f1"}
                      opacity={0.85}
                    />
                    <text
                      x={90 + i * 60}
                      y={195 - (Math.min(inc.amount, 14000) / 14000) * 180}
                      fontSize="13"
                      fill="#444"
                      textAnchor="middle"
                    >
                      {inc.amount > 0 ? `$${inc.amount}` : ""}
                      <tspan dx="8" dy="2" fontSize="15" fill="#22c55e">
                        <FaArrowUp style={{ verticalAlign: "middle" }} />
                      </tspan>
                    </text>
                    <text
                      x={90 + i * 60}
                      y={215}
                      fontSize="13"
                      fill="#888"
                      textAnchor="middle"
                    >
                      {inc.date
                        ? new Date(inc.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })
                        : ""}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Income Sources List */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 6px 18px rgba(59,53,94,0.04)",
              padding: 24,
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 16 }}>Income Sources</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {incomes.length === 0 ? (
                <p>No incomes yet.</p>
              ) : (
                incomes.map((inc) => (
                  <IncomeCard
                    key={inc._id || inc.id}
                    income={inc}
                    onMore={async (item, action) => {
                      if (action === "delete") {
                        await removeIncome(item._id || item.id);
                        // toast handled in context
                      }
                      if (action === "edit") {
                        const title = prompt("Edit title", item.title);
                        const amount = prompt("Edit amount", item.amount);
                        if (title && amount) {
                          await updateIncome(item._id || item.id, {
                            ...item,
                            title,
                            amount,
                          });
                        } else {
                          toast.info("Edit cancelled or invalid input.");
                        }
                      }
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </Content>

        {showAddIncome && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.18)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowAddIncome(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 8px 32px rgba(59,53,94,0.13)",
                padding: 0,
                minWidth: 340,
                maxWidth: 440,
                width: "98vw",
                maxHeight: "95vh",
                overflowY: "auto",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAddIncome(false)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 16,
                  background: "none",
                  border: "none",
                  fontSize: 28,
                  color: "#888",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                aria-label="Close"
              >
                &times;
              </button>
              <AddIncome onClose={() => setShowAddIncome(false)} />
            </div>
          </div>
        )}
      </Main>
    </Layout>
  );
};

export default Income;
