import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";

const Bar = styled.header`
  height: 64px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  justify-content: space-between;
  position: relative;
  top: 0;
  z-index: 220;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
// Title removed: app name lives in Sidebar

const Navbar = ({ onToggleSidebar, open }) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 900 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // back navigation removed per request

  // If sidebar is open (mobile overlay) we hide the top navbar to avoid visual clash
  if (open) return null;

  // showHamb no longer needed; hamburger is shown when onToggleSidebar is provided

  return (
    <Bar>
      <Left>
        {/* Back button removed - only hamburger remains on mobile */}

        {/* Hamburger: mobile only, and only when parent provided a toggle handler */}
        {isMobile && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
            }}
            aria-label="Open menu"
          >
            <FaBars />
          </button>
        )}
      </Left>
      {/* On mobile show app title on the right */}
      <div>
        {isMobile && (
          <div style={{ fontWeight: 800, fontSize: 18, textJustify: "center" }}>
            Expense Tracker
          </div>
        )}
      </div>
    </Bar>
  );
};

export default Navbar;
