import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from './components/navbar';
import Login from './pages/Login';
import HomePage from './pages/home';
import Cesta from './pages/cesta';
import { useAuth } from './context/AuthContext';
import "./index.css";

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname === "/" && isAuthenticated) {
    return <Navigate to="/home" />;
  }

  const isLoginPage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[url('../img/Fondo.png')] bg-cover">
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/cesta" element={<Cesta />} />
      </Routes>
    </div>
  );
}

export default App;