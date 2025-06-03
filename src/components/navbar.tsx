import React, { useState } from 'react';
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiLogIn,
  FiHome,
  FiSun,
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { SelectorLenguaje } from './SelectorLenguaje';
import UserMenu from './UserMenu';
import UserOrders from './profile/UserOrders';
import UserProfile from '../pages/UserProfile';
import { ToggleButton } from './ToggleButton';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerSection, setDrawerSection] = useState<null | 'profile' | 'orders'>(null);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeDrawer = () => setDrawerSection(null);

  if (location.pathname === '/login' || location.pathname === '/register') return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 flex items-center justify-between px-4 py-3 shadow-md z-50 h-16">
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
            className="w-8 h-8 text-green-700 dark:text-green-300"
          >
            <path d="M7 20h10"></path>
            <path d="M10 20c5.5-2.5.8-6.4 3-10"></path>
            <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"></path>
            <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"></path>
          </svg>
          <span className="font-bold text-lg text-green-700 dark:text-green-300">L'HORTA</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          <button
            onClick={() => {
              navigate('/home');
              setMenuOpen(false);
              setDrawerSection(null);
            }}
            className="flex items-center gap-2 text-green-700 dark:text-green-300 hover:text-green-500 dark:hover:text-green-400"
          >
            <FiHome />
            {t('home')}
          </button>

          <Link
            to="/cesta"
            className="flex items-center gap-2 text-green-700 dark:text-green-300 hover:text-green-500 dark:hover:text-green-400"
            onClick={() => setDrawerSection(null)}
          >
            <FiShoppingCart />
            {t('Basket')}
          </Link>

          <Link
            to="/your-gardens"
            className="flex items-center gap-2 text-green-700 dark:text-green-300 hover:text-green-500 dark:hover:text-green-400"
            onClick={() => setDrawerSection(null)}
          >
            <FiSun />
            {t('Your Garden')}
          </Link>

          <SelectorLenguaje />
          <ToggleButton />
          <UserMenu setDrawerSection={setDrawerSection} />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <ToggleButton />
          <button
            onClick={toggleMenu}
            className="text-green-700 dark:text-green-300 hover:text-green-500 dark:hover:text-green-400"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: -200 }}
            animate={{ y: 0 }}
            exit={{ y: -200 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-40 px-4 py-4 flex flex-col gap-4"
          >
            <button
              onClick={() => {
                navigate('/home');
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-green-700 dark:text-green-300 hover:text-green-500 dark:hover:text-green-400"
            >
              <FiHome />
              {t('home')}
            </button>

            <Link
              to="/cesta"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-green-700 dark:text-green-300 hover:text-green-500 dark:hover:text-green-400"
            >
              <FiShoppingCart />
              {t('Basket')}
            </Link>

            <Link
              to="/your-gardens"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-green-700 dark:text-green-300 hover:text-green-500 dark:hover:text-green-400"
            >
              <FiSun />
              {t('Your Garden')}
            </Link>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <SelectorLenguaje />
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <ToggleButton />
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <UserMenu setDrawerSection={setDrawerSection} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer for Profile/Orders */}
      <AnimatePresence>
        {drawerSection && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-[320px] bg-white dark:bg-gray-900 shadow-lg z-50 overflow-auto flex flex-col"
          >
            {/* Botón cerrar */}
            <div className="flex justify-end p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={closeDrawer}
                className="text-green-700 dark:text-green-300 hover:text-green-500 dark:hover:text-green-400 text-xl"
              >
                X
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-4">
              {drawerSection === 'profile' && <UserProfile />}
              {drawerSection === 'orders' && <UserOrders />}
            </div>

            {/* Botón Cerrar sesión */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={() => {
                  logout();
                  closeDrawer();
                  setMenuOpen(false);
                  navigate('/');
                }}
                className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 font-semibold"
              >
                <FiLogIn />
                {t('logout')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
