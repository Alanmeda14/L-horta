import React, { useState } from "react";
import {
  FiMenu,
  FiX,
  FiUser,
  FiShoppingCart,
  FiSun,
  FiLogIn,
  FiHome
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { SelectorLenguaje } from "./SelectorLenguaje";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const goToHome = () => {
    navigate("/home");
    setMenuOpen(false);
  };

  const goToCesta = () => {
    navigate("/cesta");
    setMenuOpen(false);
  };

  const isLoginPage = location.pathname === "/login" || location.pathname === "/register";
  if (isLoginPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white text-green-700 flex items-center justify-between px-4 py-3 shadow-md z-50 h-16">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-sprout w-8 h-8 text-green-700"
        >
          <path d="M7 20h10"></path>
          <path d="M10 20c5.5-2.5.8-6.4 3-10"></path>
          <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"></path>
          <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"></path>
        </svg>
        <span className="font-bold text-lg">L'HORTA</span>
      </div>

      {/* Navegación visible en pantallas grandes */}
      <div className="hidden md:flex gap-6 items-center">
        <button onClick={goToHome} className="flex items-center gap-2 hover:text-green-500">
          <FiHome />
          {t("home")}
        </button>
        <Link to="/usuario" className="flex items-center gap-2 hover:text-green-500">
          <FiUser />
          {t("user")}
        </Link>
        <Link to="/cesta" className="flex items-center gap-2 hover:text-green-500">
          <FiShoppingCart />
          {t("Basket")}
        </Link>
        <Link to="/your-gardens" className="flex items-center gap-2 hover:text-green-500">
          <FiSun />
          {t("Your Garden")}
        </Link>
      
        <button onClick={logout} className="flex items-center gap-2 hover:text-green-500">
          <FiLogIn />
          {t("logout")}
        </button>
        {/* Selector de idioma visible en escritorio */}
        <SelectorLenguaje />
      </div>

      {/* Botón menú móvil */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-green-700">
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Menú desplegable móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed top-0 left-0 h-screen w-[70%] bg-white shadow-lg flex flex-col items-start p-6 text-black z-50"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          >
            <button onClick={toggleMenu} className="absolute top-4 right-4 text-green-700">
              <FiX size={24} />
            </button>
            <button onClick={() => { goToHome(); toggleMenu(); }} className="text-2xl mb-4">
              {t("home")}
            </button>
            <Link to="/usuario" onClick={toggleMenu} className="text-2xl mb-4">
              {t("user")}
            </Link>
            <Link to="/cesta" onClick={toggleMenu} className="text-2xl mb-4">
              {t("basket")}
            </Link>
            <Link to="/your-gardens" onClick={toggleMenu} className="text-2xl mb-4">
              {t("yourGarden")}
            </Link>
            <Link to="/huertos" onClick={toggleMenu} className="text-2xl mb-4">
              {t("gardens")}
            </Link>
            <button onClick={() => { logout(); toggleMenu(); }} className="text-2xl mb-4">
              {t("logout")}
            </button>

            {/* Selector de idioma también en menú móvil */}
            <SelectorLenguaje />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
