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
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-50 text-green-600 p-4 flex items-center justify-between shadow-md md:relative md:justify-between md:shadow-none">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sprout w-8 h-8 text-green-700">
          <path d="M7 20h10"></path>
          <path d="M10 20c5.5-2.5.8-6.4 3-10"></path>
          <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"></path>
          <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"></path>
        </svg>
        <span className="hidden md:block font-bold text-lg">Huertos Colaborativos</span>
      </div>

      <div className="hidden md:flex gap-6 items-center">
        <Link to="/usuario" className="flex items-center gap-2 hover:text-green-300"><FiUser />Usuario</Link>
        <Link to="/cesta" className="flex items-center gap-2 hover:text-green-300"><FiShoppingCart />Cesta</Link>
        <Link to="/tu-huerto" className="flex items-center gap-2 hover:text-green-300"><FiSun />Tu Huerto</Link>
        <Link to="/huertos" className="flex items-center gap-2 hover:text-green-300"><FiSun />Huertos</Link>
        <button onClick={logout} className="flex items-center gap-2 hover:text-green-300"><FiLogIn />Cerrar Sesión</button>
      </div>

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
