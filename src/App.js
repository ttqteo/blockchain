import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "antd/dist/antd.css";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Buy from "./pages/Buy";
import Send from "./pages/Send";
import Swap from "./pages/Swap";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AuthProvider, { useAuthState } from "./Context/AuthProvider";
import Copyright from "./components/Copyright";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/send" element={<Send />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
          <Copyright />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
