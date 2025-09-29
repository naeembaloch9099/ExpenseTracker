import React from "react";
import TransactionCard from "./TransactionCard";

const IncomeCard = ({ income, onMore }) => {
  const item = {
    ...income,
    amount: Number(income.amount),
    icon: income.icon && income.iconElement,
  };
  return <TransactionCard item={item} onMore={onMore} showMenu={!!onMore} />;
};

export default IncomeCard;
