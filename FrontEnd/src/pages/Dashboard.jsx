import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TransactionCard from "../components/TransactionCard";
import { Link } from "react-router-dom";
import AddIncome from "./AddIncome";
import AddExpense from "./AddExpense";
import {
  FaShoppingBag,
  FaPlane,
  FaBolt,
  FaMoneyCheckAlt,
  FaWallet,
  FaPiggyBank,
  FaChartPie,
  FaLaptop,
  FaBriefcase,
} from "react-icons/fa";

// ---------------- Styled Components ----------------
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

const SummaryRow = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 6px 18px rgba(59, 53, 94, 0.04);
  @media (max-width: 600px) {
    padding: 10px 6px;
    border-radius: 8px;
  }
`;

const SummaryCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 180px;
  min-height: 120px;
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.08);
  border: 1.5px solid #f3f4f6;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.13);
    border-color: #6366f1;
  }
`;

const CardTitle = styled.h4`
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #22223b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardValue = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #6366f1;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h4 {
    margin: 0;
  }

  a {
    color: #6366f1;
    font-weight: 500;
    font-size: 14px;
  }
`;

const RecentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 14px;
  flex-wrap: wrap;
  font-size: 14px;
`;

import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { AuthContext } from "../context/Authcontext";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const { incomes, expenses, totals, loading, error } =
    useContext(GlobalContext);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
      if (window.innerWidth > 900) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Recent transactions: last 5 incomes/expenses, sorted by date desc
  const allTx = [
    ...incomes.map((i) => ({ ...i, amount: Number(i.amount) })),
    ...expenses.map((e) => ({ ...e, amount: -Math.abs(Number(e.amount)) })),
  ];
  allTx.sort((a, b) => new Date(b.date) - new Date(a.date));
  const recent = allTx.slice(0, 6);
  const recentExpenses = expenses
    .map((e) => ({ ...e, amount: -Math.abs(Number(e.amount)) }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  const recentIncomes = incomes
    .map((i) => ({ ...i, amount: Number(i.amount) }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  // Bar chart data for last 5 expenses (latest)
  const last5Expenses = [...recentExpenses].reverse(); // oldest to newest for left-to-right
  const expenseBar = last5Expenses.map((e) => Math.abs(Number(e.amount)));

  // Assign unique color per category
  const categoryColors = [
    "#6366f1", // indigo
    "#fbbf24", // yellow
    "#a78bfa", // purple
    "#38bdf8", // blue
    "#f87171", // red
    "#34d399", // green
    "#f472b6", // pink
    "#facc15", // gold
    "#60a5fa", // light blue
    "#f59e42", // orange
  ];
  const categoryColorMap = {};
  let colorIdx = 0;
  const getCategoryColor = (cat) => {
    if (!categoryColorMap[cat]) {
      categoryColorMap[cat] = categoryColors[colorIdx % categoryColors.length];
      colorIdx++;
    }
    return categoryColorMap[cat];
  };

  // Pie chart data for income categories (top 10 by value)
  let incomePie = incomes.reduce((acc, i) => {
    const label = i.title;
    const found = acc.find((x) => x.label === label);
    if (found) found.value += Number(i.amount);
    else
      acc.push({
        label,
        value: Number(i.amount),
        color: getCategoryColor(label),
      });
    return acc;
  }, []);
  incomePie = incomePie.sort((a, b) => b.value - a.value).slice(0, 10);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <Layout>
      <Navbar
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        showHamburger={isMobile}
      />
      <Sidebar collapsed={isMobile} open={sidebarOpen} user={user} />
      <Main style={isMobile ? { paddingLeft: 240 } : {}}>
        <Content>
          {/* Row 1 - Summary */}
          <SummaryRow>
            <SummaryCard>
              <CardTitle>
                <FaWallet style={{ color: "#6366f1", fontSize: 22 }} />
                Total Balance
              </CardTitle>
              <CardValue style={{ color: "#22223b" }}>
                ${totals.balance.toLocaleString()}
              </CardValue>
            </SummaryCard>
            <SummaryCard>
              <CardTitle>
                <FaPiggyBank style={{ color: "#34d399", fontSize: 22 }} />
                Total Income
              </CardTitle>
              <CardValue style={{ color: "#34d399" }}>
                ${totals.totalIncome.toLocaleString()}
              </CardValue>
            </SummaryCard>
            <SummaryCard>
              <CardTitle>
                <FaShoppingBag style={{ color: "#ef4444", fontSize: 22 }} />
                Total Expenses
              </CardTitle>
              <CardValue style={{ color: "#ef4444" }}>
                ${totals.totalExpense.toLocaleString()}
              </CardValue>
            </SummaryCard>
          </SummaryRow>

          {/* Row 2 - Recent Transactions + Financial Overview */}
          <Grid>
            <Card>
              <SectionHeader>
                <h4>Recent Transactions</h4>
                <Link to="/transactions">View All</Link>
              </SectionHeader>
              <RecentList>
                {recent.map((item) => (
                  <TransactionCard
                    key={item._id || item.id}
                    item={item}
                    showMenu={false}
                  />
                ))}
              </RecentList>
            </Card>

            <Card>
              <h4>Financial Overview</h4>
              {/* Donut chart for expenses by category */}
              <svg width="220" height="220" viewBox="0 0 220 220">
                <circle
                  r="90"
                  cx="110"
                  cy="110"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="30"
                />
                {/* Expense donut slices by category */}
                {(() => {
                  // Group expenses by title/category
                  const catTotals = {};
                  expenses.forEach((e) => {
                    const cat = e.title || "Other";
                    catTotals[cat] =
                      (catTotals[cat] || 0) + Math.abs(Number(e.amount));
                  });
                  const cats = Object.entries(catTotals)
                    .map(([label, value]) => ({
                      label,
                      value,
                      color: getCategoryColor(label),
                    }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 8); // top 8 categories
                  const total = cats.reduce((s, c) => s + c.value, 0);
                  let cumulative = 0;
                  const radius = 90;
                  const cx = 110,
                    cy = 110;
                  return cats.map((cat, idx) => {
                    const percent = total ? cat.value / total : 0;
                    const startAngle = cumulative * 2 * Math.PI;
                    const endAngle = (cumulative + percent) * 2 * Math.PI;
                    const x1 = cx + radius * Math.cos(startAngle - Math.PI / 2);
                    const y1 = cy + radius * Math.sin(startAngle - Math.PI / 2);
                    const x2 = cx + radius * Math.cos(endAngle - Math.PI / 2);
                    const y2 = cy + radius * Math.sin(endAngle - Math.PI / 2);
                    const largeArc = percent > 0.5 ? 1 : 0;
                    const pathData = [
                      `M ${cx} ${cy}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                      "Z",
                    ].join(" ");
                    cumulative += percent;
                    return (
                      <path
                        key={cat.label}
                        d={pathData}
                        fill={cat.color}
                        stroke="#fff"
                        strokeWidth={2}
                        opacity={0.95}
                      />
                    );
                  });
                })()}
                <text
                  x="110"
                  y="120"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="bold"
                  fill="#111"
                >
                  ${totals.totalExpense.toLocaleString()}
                </text>
              </svg>
              <Legend>
                {/* Show legend for top 8 categories */}
                {(() => {
                  const catTotals = {};
                  expenses.forEach((e) => {
                    const cat = e.title || "Other";
                    catTotals[cat] =
                      (catTotals[cat] || 0) + Math.abs(Number(e.amount));
                  });
                  const cats = Object.entries(catTotals)
                    .map(([label, value]) => ({
                      label,
                      value,
                      color: getCategoryColor(label),
                    }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 8);
                  return cats.map((cat) => (
                    <span
                      key={cat.label}
                      style={{ color: cat.color, fontWeight: 500 }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: cat.color,
                          marginRight: 6,
                          verticalAlign: "middle",
                        }}
                      />
                      {cat.label}
                    </span>
                  ));
                })()}
              </Legend>
            </Card>
          </Grid>

          {/* Row 3 - Expenses + Last 30 Days Expense */}
          <Grid>
            <Card>
              <SectionHeader>
                <h4>Expenses</h4>
                <Link to="/expenses">View All</Link>
              </SectionHeader>
              <RecentList>
                {recentExpenses.map((ex) => (
                  <TransactionCard
                    key={ex._id || ex.id}
                    item={ex}
                    showMenu={false}
                  />
                ))}
              </RecentList>
            </Card>

            <Card>
              <h4>Expenses (Bar Chart)</h4>
              <svg width="100%" height="140" viewBox="0 0 300 140">
                {expenseBar.map((val, i) => (
                  <rect
                    key={i}
                    x={i * 55 + 30}
                    y={140 - (val / Math.max(...expenseBar, 1)) * 120}
                    width="36"
                    height={(val / Math.max(...expenseBar, 1)) * 120}
                    rx="8"
                    fill="#f87171"
                  />
                ))}
                {/* X-axis labels */}
                {last5Expenses.map((e, i) => (
                  <text
                    key={e._id || e.id || i}
                    x={i * 55 + 48}
                    y={135}
                    fontSize="12"
                    fill="#888"
                    textAnchor="middle"
                  >
                    {e.title?.slice(0, 6) || "Expense"}
                  </text>
                ))}
              </svg>
            </Card>
          </Grid>

          {/* Row 4 - Income + Income Pie */}
          <Grid>
            <Card>
              <SectionHeader>
                <h4>Income</h4>
                <Link to="/income">View All</Link>
              </SectionHeader>
              <RecentList>
                {recentIncomes.map((inc) => (
                  <TransactionCard
                    key={inc._id || inc.id}
                    item={inc}
                    showMenu={false}
                  />
                ))}
              </RecentList>
            </Card>

            <Card>
              <h4>Last 60 Days Income</h4>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle
                  r="80"
                  cx="100"
                  cy="100"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="26"
                />
                {/* Pie chart slices for each income category */}
                {(() => {
                  // Draw pie slices as SVG paths for each category
                  const total = incomePie.reduce((s, i) => s + i.value, 0);
                  let cumulative = 0;
                  const radius = 80;
                  const cx = 100,
                    cy = 100;
                  return incomePie.map((inc, idx) => {
                    const value = inc.value;
                    const percent = total ? value / total : 0;
                    const startAngle = cumulative * 2 * Math.PI;
                    const endAngle = (cumulative + percent) * 2 * Math.PI;
                    const x1 = cx + radius * Math.cos(startAngle - Math.PI / 2);
                    const y1 = cy + radius * Math.sin(startAngle - Math.PI / 2);
                    const x2 = cx + radius * Math.cos(endAngle - Math.PI / 2);
                    const y2 = cy + radius * Math.sin(endAngle - Math.PI / 2);
                    const largeArc = percent > 0.5 ? 1 : 0;
                    const pathData = [
                      `M ${cx} ${cy}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                      "Z",
                    ].join(" ");
                    cumulative += percent;
                    return (
                      <path
                        key={inc.label}
                        d={pathData}
                        fill={inc.color}
                        stroke="#fff"
                        strokeWidth={2}
                        opacity={0.95}
                      />
                    );
                  });
                })()}
                <text
                  x="100"
                  y="110"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="bold"
                  fill="#111"
                >
                  ${totals.totalIncome.toLocaleString()}
                </text>
              </svg>
              <Legend>
                {incomePie.map((inc) => (
                  <span
                    key={inc.label}
                    style={{ color: inc.color, fontWeight: 500 }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: inc.color,
                        marginRight: 6,
                        verticalAlign: "middle",
                      }}
                    />
                    {inc.label}
                  </span>
                ))}
              </Legend>
            </Card>
          </Grid>
        </Content>
        {/* Modal overlays for AddIncome/AddExpense */}
        {(showAddIncome || showAddExpense) && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.25)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setShowAddIncome(false);
              setShowAddExpense(false);
            }}
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
                onClick={() => {
                  setShowAddIncome(false);
                  setShowAddExpense(false);
                }}
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
              {showAddIncome && (
                <AddIncome onClose={() => setShowAddIncome(false)} />
              )}
              {showAddExpense && (
                <AddExpense onClose={() => setShowAddExpense(false)} />
              )}
            </div>
          </div>
        )}
      </Main>
    </Layout>
  );
};

export default Dashboard;
