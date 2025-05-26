import React from "react";
import { Routes, Route, Navigate, useLocation, data } from "react-router-dom";
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
import { ToastContainer } from "react-toastify";
import { YourGardens } from "./pages/YourGardens";

// Aquí mantengo las rutas protegidas y públicas que tenías

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div
      className="
        bg-gray-50
        bg-cover 
        bg-no-repeat 
        bg-center 
        min-h-screen
        m-0
        p-0
      "
    >
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={!isLoginPage ? "pt-16" : ""}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Private routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/garden/:id" element={
            <ProtectedRoute>
              <GardenListingPage />
            </ProtectedRoute>
          } />
          <Route path="/gardens" element={
            <ProtectedRoute>
              <GardenListingPage />
            </ProtectedRoute>
          } />
           <Route path="/your-gardens" element={
            <ProtectedRoute>
              <YourGardens/>
            </ProtectedRoute>
          } />
          <Route path="/usuario" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/cesta" element={
            <ProtectedRoute>
              <Cesta />
            </ProtectedRoute>
          } />
          <Route path="/gardenForm" element={
            <ProtectedRoute>
              <GardenForm />
            </ProtectedRoute>
          } />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Unknown route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
