import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";     // Your landing page component
// @ts-ignore: No declaration file for login.jsx
import Login from "./pages/login.jsx"; // Your new Login page
// @ts-ignore: No declaration file for signup.jsx
import SignUp from "./pages/signup.jsx"; // Your new SignUp page
import "./index.css";            // Tailwind styles

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);