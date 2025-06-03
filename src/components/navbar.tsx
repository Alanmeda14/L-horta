import React, { useState } from "react";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiSun,
  FiLogIn,
  FiHome,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { SelectorLenguaje } from "./SelectorLenguaje";

import UserMenu from "./UserMenu";
import UserOrders from "./profile/UserOrders";
import UserProfile from "../pages/UserProfile";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerSection, setDrawerSection] = useState<null | "profile" | "orders">(null);

  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeDrawer = () => setDrawerSection(null);

  if (location.pathname === "/login" || location.pathname === "/register") return null;

  return (
    <>
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

        {/* Navegación visible en escritorio */}
        <div className="hidden md:flex gap-6 items-center">
          <button
            onClick={() => {
              navigate("/home");
              setMenuOpen(false);
              setDrawerSection(null);
            }}
            className="flex items-center gap-2 hover:text-green-500"
          >
            <FiHome />
            {t("home")}
          </button>

          <Link
            to="/cesta"
            className="flex items-center gap-2 hover:text-green-500"
            onClick={() => setDrawerSection(null)}
          >
            <FiShoppingCart />
            {t("Basket")}
          </Link>

          <Link
            to="/your-gardens"
            className="flex items-center gap-2 hover:text-green-500"
            onClick={() => setDrawerSection(null)}
          >
            <FiSun />
            {t("Your Garden")}
          </Link>

          <button
            onClick={() => {
              logout();
              setDrawerSection(null);
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 hover:text-green-500"
          >
            <FiLogIn />
            {t("logout")}
          </button>

          <SelectorLenguaje />
          <UserMenu />
        </div>

        {/* Botón menú móvil */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-green-700">
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil deslizante */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: -200 }}
            animate={{ y: 0 }}
            exit={{ y: -200 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-16 left-0 w-full bg-white shadow-md z-40 px-4 py-4 flex flex-col gap-4"
          >
            <button
              onClick={() => {
                navigate("/home");
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-green-700 hover:text-green-500"
            >
              <FiHome />
              {t("home")}
            </button>

            <Link
              to="/cesta"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-green-700 hover:text-green-500"
            >
              <FiShoppingCart />
              {t("Basket")}
            </Link>

            <Link
              to="/your-gardens"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-green-700 hover:text-green-500"
            >
              <FiSun />
              {t("Your Garden")}
            </Link>

            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-green-700 hover:text-green-500"
            >
              <FiLogIn />
              {t("logout")}
            </button>

            <div className="pt-2 border-t border-gray-200">
              <SelectorLenguaje />
            </div>

            <div className="pt-2 border-t border-gray-200">
              <UserMenu />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer lateral para perfil/pedidos */}
      <AnimatePresence>
        {drawerSection && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-[320px] bg-white shadow-lg z-50 overflow-auto"
          >
            <button
              onClick={closeDrawer}
              className="p-4 border-b text-right hover:text-green-600"
            >
              X
            </button>

            {drawerSection === "profile" && <UserProfile />}
            {drawerSection === "orders" && <UserOrders />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
