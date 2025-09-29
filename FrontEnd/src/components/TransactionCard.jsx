import React from "react";
import styled from "styled-components";
import { FaEllipsisV, FaArrowUp, FaArrowDown } from "react-icons/fa";

const Card = styled.div`
  background: #fff;
  padding: 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
`;

const Left = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;
const IconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f2ff;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.span`
  font-weight: 600;
`;
const DateText = styled.span`
  font-size: 0.85rem;
  color: #666;
`;

const Amount = styled.div`
  font-weight: 700;
  color: ${(p) => (p.negative ? "#ef4444" : "#059669")};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TransactionCard = ({ item, onMore, showMenu = true }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <Card>
      <Left>
        <IconWrap>{item.icon || <span>💰</span>}</IconWrap>
        <Info>
          <Title>{item.title}</Title>
          <DateText>{item.date}</DateText>
        </Info>
      </Left>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "relative",
        }}
      >
        <Amount negative={(item.amount < 0).toString()}>
          {item.amount < 0 ? `-$${Math.abs(item.amount)}` : `+$${item.amount}`}
          {item.amount < 0 ? (
            <FaArrowDown
              style={{ color: "#ef4444", marginLeft: 2, fontSize: 16 }}
            />
          ) : (
            <FaArrowUp
              style={{ color: "#22c55e", marginLeft: 2, fontSize: 16 }}
            />
          )}
        </Amount>
        {showMenu && (
          <>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <FaEllipsisV />
            </button>
            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 36,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  zIndex: 10,
                  minWidth: 90,
                }}
              >
                <button
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "8px 12px",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#6366f1",
                    borderBottom: "1px solid #eee",
                  }}
                  onClick={() => {
                    setMenuOpen(false);
                    onMore && onMore(item, "edit");
                  }}
                >
                  Edit
                </button>
                <button
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "8px 12px",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#ef4444",
                  }}
                  onClick={() => {
                    setMenuOpen(false);
                    onMore && onMore(item, "delete");
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default TransactionCard;
