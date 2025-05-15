import React, { useState } from "react";
import { FiMenu, FiX, FiUser, FiShoppingCart, FiSun, FiLogIn } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isLoginPage = location.pathname === "/login";
  if (isLoginPage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-50 text-green-600 p-4 flex items-center justify-around shadow-md md:relative md:justify-end md:shadow-none">
      <div className="hidden md:flex gap-6 items-center">
        <Link to="/usuario" className="flex items-center gap-2 hover:text-green-300"><FiUser />Usuario</Link>
        <Link to="/cesta" className="flex items-center gap-2 hover:text-green-300"><FiShoppingCart />Cesta</Link>
        <Link to="/tu-huerto" className="flex items-center gap-2 hover:text-green-300"><FiSun />Tu Huerto</Link>
        <Link to="/huertos" className="flex items-center gap-2 hover:text-green-300"><FiSun />Huertos</Link>
        <button onClick={logout} className="flex items-center gap-2 hover:text-green-300"><FiLogIn />Cerrar Sesión</button>
      </div>

      {/* Menú hamburguesa para móviles */}
      <div className="md:hidden flex items-center justify-between w-full">
        <button onClick={toggleMenu} className="text-green-600">
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul 
            className="fixed bottom-16 left-0 right-0 flex flex-col items-center bg-green-700 text-green-400 p-4 space-y-4 md:hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}>
            <Link to="/usuario" onClick={toggleMenu} className="text-xl">Usuario</Link>
            <Link to="/cesta" onClick={toggleMenu} className="text-xl">Cesta</Link>
            <Link to="/tu-huerto" onClick={toggleMenu} className="text-xl">Tu Huerto</Link>
            <Link to="/huertos" onClick={toggleMenu} className="text-xl">Huertos</Link>
            <button onClick={() => { logout(); toggleMenu(); }} className="text-xl">Cerrar Sesión</button>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
