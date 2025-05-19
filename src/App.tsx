import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from './components/navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/home';
import Cesta from './pages/cesta';
import GardenListingPage from './pages/GardenListingPage';
import UserProfile from './pages/UserProfile';
import { useAuth } from './context/AuthContext';
import "./index.css";
import { GardenForm } from "./components/Form/GardenForm";


function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const publicRoutes = ["/", "/register", "/forgot-password"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (location.pathname === "/" && isAuthenticated) {
    return <Navigate to="/home" />;
  }

  const isLoginPage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[url('../img/Fondo.png')] bg-cover">
      {!isPublicRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/gardens" element={<GardenListingPage />} />
        <Route path="/usuario" element={<UserProfile />} />
        <Route path="/cesta" element={<Cesta />} />
        <Route path="/gardenForm" element={<GardenForm />} />
      </Routes>
    </div>
  )
}

export default App;