import React, { createContext, useState, useEffect } from "react";
import * as AuthAPI from "../services/Auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount, check for token and fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("et_token");
    if (!token) {
      setLoading(false);
      return;
    }
    AuthAPI.getProfile(token)
      .then((data) => {
        setUser(data.user);
        setError(null);
      })
      .catch(() => {
        setUser(null);
        setError("Session expired. Please login again.");
        localStorage.removeItem("et_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async ({ email, password }) => {
    if (!email || !password) throw new Error("Missing credentials");
    setLoading(true);
    try {
      const data = await AuthAPI.login(email, password);
      localStorage.setItem("et_token", data.token);
      setUser(data.user);
      setError(null);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw new Error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ name, email, password, profilePic }) => {
    if (!name || !email || !password) throw new Error("Missing fields");
    setLoading(true);
    try {
      const data = await AuthAPI.signup(name, email, password, profilePic);
      // Registration does not log in user, so do not set token/user here
      setError(null);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Signup error");
      throw new Error(err.response?.data?.message || "Signup error");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("et_token");
    AuthAPI.logout();
  };

  const updateProfile = async ({ name, profilePic }) => {
    setLoading(true);
    const token = localStorage.getItem("et_token");
    try {
      const data = await AuthAPI.updateProfile({ name, profilePic }, token);
      setUser(data.user);
      setError(null);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
      throw new Error(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    const token = localStorage.getItem("et_token");
    try {
      await AuthAPI.deleteAccount(token);
      setUser(null);
      localStorage.removeItem("et_token");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Account deletion failed");
      throw new Error(err.response?.data?.message || "Account deletion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
