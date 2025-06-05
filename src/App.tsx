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
import GardenForm from "./components/Form/GardenForm";
import GardenFormEdit from "./components/Form/GardenFormEdit";
import YourGardens from "./pages/YourGardens";
import OwnerGarden from "./pages/OwnerGarden";
import UserOrders from './pages/UserOrders';
import { ToastContainer } from "react-toastify";
import { ToggleButton } from "./components/ToggleButton";
import Welcome from "./pages/Welcome";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" /> : <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" state={{ from: location }} replace />;
};

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login" || location.pathname === "/register";

  return (
      <div className="bg-gray-50 bg-cover bg-no-repeat bg-center min-h-screen m-0 p-0 dark:bg-gray-800">
        <Navbar />
        
        <ToastContainer position="top-right" autoClose={3000} />
        <div className={!isLoginPage ? "pt-16" : ""}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={
              <PublicRoute><Login /></PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute><Register /></PublicRoute>
            } />
            <Route path="/welcome" element={
              <PublicRoute><Welcome /></PublicRoute>
            } />

            {/* Rutas protegidas */}
            <Route path="/home" element={
              <ProtectedRoute><HomePage /></ProtectedRoute>
            } />
            <Route path="/garden/new" element={
              <ProtectedRoute><GardenForm /></ProtectedRoute>
            } />
            <Route path="/garden/edit/:id" element={
              <ProtectedRoute><GardenFormEdit /></ProtectedRoute>
            } />
            <Route path="/garden/:id" element={
              <ProtectedRoute><GardenListingPage /></ProtectedRoute>
            } />
            <Route path="/gardens" element={
              <ProtectedRoute><GardenListingPage /></ProtectedRoute>
            } />
            <Route path="/usuario" element={
              <ProtectedRoute><UserProfile /></ProtectedRoute>
            } />
            <Route path="/pedidos" element={
              <ProtectedRoute><UserOrders /></ProtectedRoute>
            } />
            <Route path="/cesta" element={
              <ProtectedRoute><Cesta /></ProtectedRoute>
            } />
            <Route path="/your-gardens" element={
              <ProtectedRoute><YourGardens /></ProtectedRoute>
            } />
            <Route path="/my-garden/:id" element={
              <ProtectedRoute><OwnerGarden /></ProtectedRoute>
            } />

            {/* Ruta por defecto */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Ruta desconocida */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
  );
}

export default App;
