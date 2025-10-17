import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/Authcontext";
import {
  FaHome,
  FaMoneyBillWave,
  FaWallet,
  FaSignOutAlt,
  FaCog,
  FaUserEdit,
  FaTrashAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "./Toast";

const SidebarContainer = styled.aside`
  width: 240px;
  background: var(--sidebar-bg, linear-gradient(180deg, #6b21a8, #8b5cf6));
  color: var(--sidebar-color, #fff);
  display: flex;
  flex-direction: column;
  padding: 20px 0 20px 0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: 2px 0 16px rgba(59, 53, 94, 0.07);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  @media (max-width: 900px) {
    transform: translateX(-100%);
    width: 220px;
    ${(props) => props.open && "transform: translateX(0);"}
  }
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  img {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  h3 {
    margin: 10px 0 0 0;
    font-size: 1rem;
  }
  p {
    margin: 4px 0 0 0;
    font-size: 0.85rem;
    opacity: 0.9;
  }
`;

const AppTitle = styled.h2`
  margin: 8px 0 12px 20px;
  font-size: 1.25rem;
  color: var(--sidebar-color, #fff);
  font-weight: 800;
  letter-spacing: 0.02em;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  color: inherit;
  text-align: left;
  padding: 14px 12px;
  margin: 8px 0;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1.18rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--sidebar-hover, #fbbf24);
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding: 16px 0 16px 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(90deg, #fca5a5 0%, #ef4444 100%);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.08);
  margin: 0 auto 8px auto;
  transition: background 0.2s, color 0.2s;
  width: 90%;
  justify-content: center;
  z-index: 10;
  position: relative;
  &:hover,
  &:focus {
    background: linear-gradient(90deg, #ef4444 0%, #fca5a5 100%);
    color: #fff;
    outline: none;
  }
`;

const Sidebar = ({ collapsed, open, onRequestClose }) => {
  const { user, logout, updateProfile, deleteAccount } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [profilePic, setProfilePic] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // When on mobile, `collapsed` is true by default; if the sidebar is opened via
  // the hamburger, `open` will be true — treat that as expanded. Compute an
  // effective collapsed flag that hides labels only when collapsed and NOT open.
  const isCollapsed = collapsed && !open;

  useEffect(() => {
    setName(user?.name || "");
  }, [user]);

  // theme toggling removed - header icon was removed per request

  const handleSave = async () => {
    setSaving(true);
    try {
      let profilePicData = null;
      if (profilePic) {
        profilePicData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(profilePic);
        });
      }
      await updateProfile({ name, profilePic: profilePicData });
      toast.success("Profile updated successfully");
      setShowSettings(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;
    setDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SidebarContainer open={open}>
      {/* Close button for mobile when sidebar is open */}
      {open && (
        <button
          onClick={() => onRequestClose && onRequestClose()}
          aria-label="Close menu"
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.9)",
            fontSize: 26,
            cursor: "pointer",
            zIndex: 250,
          }}
        >
          &times;
        </button>
      )}
      {/* removed top theme toggle */}
      {!isCollapsed && <AppTitle>Expense Tracker</AppTitle>}
      <Profile>
        <img src={user?.profilePic || "/default-avatar.png"} alt="profile" />
        {!isCollapsed && <h3>{user?.name || "Guest"}</h3>}
        {!isCollapsed && <p>{user?.email || ""}</p>}
      </Profile>

      <div style={{ flex: 1, paddingLeft: isCollapsed ? 12 : 36 }}>
        <NavItem
          onClick={() => {
            navigate("/dashboard");
            toast.info("Dashboard opened");
            if (onRequestClose) onRequestClose();
          }}
        >
          <FaHome /> {!isCollapsed && "Dashboard"}
        </NavItem>
        <NavItem
          onClick={() => {
            navigate("/income");
            toast.info("Income page opened");
            if (onRequestClose) onRequestClose();
          }}
        >
          <FaMoneyBillWave /> {!isCollapsed && "Income"}
        </NavItem>
        <NavItem
          onClick={() => {
            navigate("/expense");
            toast.info("Expense page opened");
            if (onRequestClose) onRequestClose();
          }}
        >
          <FaWallet /> {!isCollapsed && "Expense"}
        </NavItem>
        <NavItem
          style={{ marginTop: 12, background: "rgba(255,255,255,0.08)" }}
          onClick={() => setShowSettings(true)}
        >
          <FaCog /> {!isCollapsed && "Settings"}
        </NavItem>
      </div>

      <Footer>
        <LogoutButton
          onClick={() => {
            logout();
            toast.success("Logged out successfully");
            navigate("/login");
          }}
        >
          <FaSignOutAlt /> {!isCollapsed && "Logout"}
        </LogoutButton>
      </Footer>

      {showSettings && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowSettings(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(59,53,94,0.13)",
              padding: 32,
              minWidth: 340,
              maxWidth: 400,
              width: "98vw",
              maxHeight: "95vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSettings(false)}
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
            <h2
              style={{
                margin: 0,
                marginBottom: 18,
                fontSize: 22,
                color: "#6b21a8",
              }}
            >
              <FaCog style={{ marginRight: 8 }} /> Account Settings
            </h2>
            {/* Update Name/ProfilePic UI */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 600, fontSize: 15 }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1.5px solid #e5e7eb",
                  marginTop: 6,
                  marginBottom: 16,
                }}
                disabled={saving}
              />
              <label style={{ fontWeight: 600, fontSize: 15 }}>
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                style={{
                  width: "100%",
                  marginTop: 6,
                  marginBottom: 16,
                }}
                onChange={(e) => setProfilePic(e.target.files[0])}
                disabled={saving}
              />
              <button
                style={{
                  background: saving ? "#a5b4fc" : "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 18px",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  marginRight: 8,
                }}
                onClick={handleSave}
                disabled={saving}
              >
                <FaUserEdit style={{ marginRight: 6 }} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
            <hr style={{ margin: "18px 0" }} />
            {/* Delete Account UI */}
            <div>
              <button
                style={{
                  background: deleting ? "#fca5a5" : "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 18px",
                  fontWeight: 600,
                  cursor: deleting ? "not-allowed" : "pointer",
                  width: "100%",
                }}
                onClick={handleDelete}
                disabled={deleting}
              >
                <FaTrashAlt style={{ marginRight: 6 }} />
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
