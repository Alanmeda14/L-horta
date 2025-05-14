import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/navbar'; // Asegúrate de que la importación sea correcta
import Login from './components/login';   // Asegúrate de que la importación sea correcta
import HomePage from './pages/home';      // Asegúrate de que la importación sea correcta

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Estado de autenticación
  const location = useLocation(); // Obtiene la ubicación actual

  // Función de manejo de login (simulada)
  const handleLogin = () => {
    setIsLoggedIn(true); // Simulamos que el usuario ha iniciado sesión
  };

  return (
    <Router>
      {/* Condicionamos el Navbar: solo se muestra si no estamos en la página de Login */}
      {location.pathname !== "/" && <Navbar />} {/* Solo muestra el Navbar si no estamos en Login */}

      <Routes>
        {/* Ruta de login */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />*/

        {/* Si el usuario está autenticado, lo redirigimos a Home */}
        <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/" />} />

        {/* Redirigir cualquier otra ruta a login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
