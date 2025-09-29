import React from "react";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";

const Bar = styled.header`
  height: 64px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
  justify-content: space-between;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const Title = styled.h1`
  font-size: 1.1rem;
  margin: 0;
  color: #4b2c83;
`;

const Navbar = ({ onToggleSidebar, showHamburger }) => {
  return (
    <Bar>
      <Left>
        {showHamburger && (
          <button
            onClick={onToggleSidebar}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 22,
            }}
          >
            <FaBars />
          </button>
        )}
        <Title>Expense Tracker</Title>
      </Left>
      <div> {/* Right side placeholder (future notifications/profile) */} </div>
    </Bar>
  );
};

export default Navbar;
