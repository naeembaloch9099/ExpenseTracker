import React from "react";
import TransactionCard from "./TransactionCard";

const ExpenseCard = ({ expense, onMore }) => {
  const item = {
    ...expense,
    amount: -Math.abs(Number(expense.amount)),
    icon: expense.icon && expense.iconElement,
  };
  return <TransactionCard item={item} onMore={onMore} showMenu={!!onMore} />;
};

export default ExpenseCard;
