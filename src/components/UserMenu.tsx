import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar"; 
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";


const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  // Cierra el menú si haces clic fuera
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
    if (section === "profile") {
      navigate("/usuario");
    } else if (section === "orders") {
      navigate("/pedidos");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setOpen(!open)} className="focus:outline-none">
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
            >
              {t('profile_1')}
            </li>
            <li
              onClick={() => handleClick("orders")}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {t('orders_1')}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
