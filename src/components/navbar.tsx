// src/components/Navbar.tsx
import React, { useState } from "react";
import { FiMenu, FiX, FiUser, FiShoppingCart, FiHome, FiSun, FiLogIn } from "react-icons/fi"; // Reemplazamos FiLeaf por FiSun
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-green-600 text-white p-4 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold">Huerto Colaborativo</h1>

      {/* Botón de Menú para Móvil */}
      <div className="md:hidden">
        <button onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Menú para Pantallas Grandes */}
      <ul className="hidden md:flex gap-6 items-center">
        <li className="flex items-center gap-2 hover:text-green-300">
          <FiHome />
          <Link to="/">Home</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-green-300">
          <FiUser />
          <Link to="/usuario">Usuario</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-green-300">
          <FiShoppingCart />
          <Link to="/cesta">Cesta</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-green-300">
          <FiSun />
          <Link to="/tu-huerto">Tu Huerto</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-green-300">
          <FiSun />
          <Link to="/huertos">Huertos</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-green-300">
          <FiLogIn />
          <Link to="/login">Login</Link>
        </li>
      </ul>

      {/* Menú para Móvil (Animado) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            className="fixed inset-0 flex flex-col items-center justify-center bg-green-700 text-white space-y-4 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <li className="flex items-center gap-2 text-2xl">
              <FiHome />
              <Link to="/" onClick={toggleMenu}>Home</Link>
            </li>
            <li className="flex items-center gap-2 text-2xl">
              <FiUser />
              <Link to="/usuario" onClick={toggleMenu}>Usuario</Link>
            </li>
            <li className="flex items-center gap-2 text-2xl">
              <FiShoppingCart />
              <Link to="/cesta" onClick={toggleMenu}>Cesta</Link>
            </li>
            <li className="flex items-center gap-2 text-2xl">
              <FiSun />
              <Link to="/tu-huerto" onClick={toggleMenu}>Tu Huerto</Link>
            </li>
            <li className="flex items-center gap-2 text-2xl">
              <FiSun />
              <Link to="/huertos" onClick={toggleMenu}>Huertos</Link>
            </li>
            <li className="flex items-center gap-2 text-2xl">
              <FiLogIn />
              <Link to="/login" onClick={toggleMenu}>Login</Link>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
