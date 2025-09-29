import React, { useContext } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { AuthContext } from "../context/Authcontext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Layout = styled.div`
  min-height: 100vh;
  background: #f9fafb;
`;
const Main = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px 0 20px 240px;
  gap: 20px;
  min-height: 100vh;
  @media (max-width: 900px) {
    padding: 10px 0 10px 0;
    flex-direction: column;
    gap: 10px;
  }
`;
const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (max-width: 900px) {
    gap: 14px;
  }
`;
const Table = styled.table`
  width: 100%;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(59, 53, 94, 0.07);
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 24px;
  overflow: hidden;
`;
const Th = styled.th`
  padding: 14px 12px;
  background: #111;
  color: #fff;
  font-weight: 700;
  border-bottom: 2px solid #e5e7eb;
  text-align: left;
`;
const Td = styled.td`
  padding: 12px 12px;
  border-bottom: 1px solid #f1f1f1;
  text-align: left;
  font-size: 1rem;
`;

const TransactionsPage = () => {
  const { incomes, expenses } = useContext(GlobalContext);
  const { user } = useContext(AuthContext);

  // Merge and sort all transactions by date desc
  const allTx = [
    ...incomes.map((i) => ({ ...i, type: "Income", amount: Number(i.amount) })),
    ...expenses.map((e) => ({
      ...e,
      type: "Expense",
      amount: Number(e.amount),
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Download handler
  const handleDownload = () => {
    const data = allTx.map((tx) => ({
      Date: tx.date,
      Type: tx.type,
      Title: tx.title,
      Amount: tx.amount,
      Category: tx.icon || tx.iconElement || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "transactions.xlsx"
    );
  };

  return (
    <Layout>
      <Navbar />
      <Sidebar user={user} />
      <Main>
        <Content>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2 style={{ margin: 0 }}>All Transactions</h2>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleDownload}
                style={{
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                Download Excel
              </button>
              <Link
                to="/dashboard"
                style={{
                  color: "#6366f1",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1.5px solid #6366f1",
                  borderRadius: 8,
                  padding: "8px 16px",
                  background: "#f3f4f6",
                }}
              >
                Back to Dashboard
              </Link>
              <Link
                to="/add-income"
                style={{
                  color: "#22c55e",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1.5px solid #22c55e",
                  borderRadius: 8,
                  padding: "8px 16px",
                  background: "#f0fdf4",
                }}
              >
                Add Income
              </Link>
              <Link
                to="/add-expense"
                style={{
                  color: "#ef4444",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1.5px solid #ef4444",
                  borderRadius: 8,
                  padding: "8px 16px",
                  background: "#fef2f2",
                }}
              >
                Add Expense
              </Link>
            </div>
          </div>
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Title</Th>
                <Th>Amount</Th>
                <Th>Category/Icon</Th>
              </tr>
            </thead>
            <tbody>
              {allTx.length === 0 ? (
                <tr>
                  <Td colSpan={5} style={{ textAlign: "center" }}>
                    No transactions found.
                  </Td>
                </tr>
              ) : (
                allTx.map((tx) => (
                  <tr key={tx._id || tx.id}>
                    <Td>
                      {tx.date
                        ? new Date(tx.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </Td>
                    <Td
                      style={{
                        color: tx.type === "Income" ? "#22c55e" : "#ef4444",
                        fontWeight: 500,
                      }}
                    >
                      {tx.type}
                    </Td>
                    <Td>{tx.title}</Td>
                    <Td
                      style={{
                        color: tx.type === "Income" ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {tx.type === "Income" ? "+" : "-"}${Math.abs(tx.amount)}
                    </Td>
                    <Td>{tx.icon || tx.iconElement || ""}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Content>
      </Main>
    </Layout>
  );
};

export default TransactionsPage;
