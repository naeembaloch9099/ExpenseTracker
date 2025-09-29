import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/dashboard">Go Home</Link>
    </div>
  );
};

export default NotFound;
