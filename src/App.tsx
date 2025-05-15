// ✅ App.tsx (Refactorizado)
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from './components/navbar';
import Login from './pages/Login';
import HomePage from './pages/home';
import { useAuth } from './context/AuthContext';
import "./index.css";

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // ✅ Redirige al home si el usuario está autenticado e intenta ir a "/"
  if (location.pathname === "/" && isAuthenticated) {
    return <Navigate to="/home" />;
  }

  // ✅ Verifica si estás en la página de Login
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {/* ✅ Solo muestra el Navbar si NO estás en la página de Login */}
      {!isLoginPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/home" 
          element={<HomePage />} 
        />
      </Routes>
    </>
  );
}

export default App;
