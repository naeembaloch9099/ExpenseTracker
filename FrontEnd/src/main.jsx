// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// 👇 Fix these imports to match your actual files
import { AuthProvider } from "./context/Authcontext.jsx";
import { GlobalProvider } from "./context/GlobalState.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </AuthProvider>
  </React.StrictMode>
);
