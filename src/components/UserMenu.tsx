import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

type UserMenuProps = {
  setDrawerSection: React.Dispatch<React.SetStateAction<"profile" | "orders" | null>>;
};

const UserMenu: React.FC<UserMenuProps> = ({ setDrawerSection }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (section: "profile" | "orders") => {
    setOpen(false);
    setDrawerSection(section);  // Usamos la prop para abrir el drawer en Navbar
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    setDrawerSection(null); // Cerramos drawer
    navigate("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="focus:outline-none rounded-full"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t("User menu")}
      >
        <Avatar
          size={40}
          src={user?.profileImage}
          alt={`${user?.name} ${user?.surname}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border z-50">
          <ul className="py-1 text-sm text-gray-700">
            <li
              onClick={() => handleClick("profile")}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              role="menuitem"
              tabIndex={0}
            >
              {t("profile_1")}
            </li>
            <li
              onClick={() => handleClick("orders")}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              role="menuitem"
              tabIndex={0}
            >
              {t("orders_1")}
            </li>
            <li
              onClick={handleLogout}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
              role="menuitem"
              tabIndex={0}
            >
              {t("logout")}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
