import React from 'react';
import { useTranslation } from 'react-i18next';
import './SelectorLenguaje.css';
import { Earth } from 'lucide-react';

export const SelectorLenguaje: React.FC = () => {
  const { i18n } = useTranslation();

  const cambiarLenguaje = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng: string = e.target.value;
    i18n.changeLanguage(lng);
  };

  return (
    <div className='language-selector'>
      <span className="language-icon"><Earth/></span>
      <select
      className="language-select dark:text-white"
        value={i18n.language}
        onChange={cambiarLenguaje}
      >
        <option value="en" className="dark:text-black">English</option>
        <option value="es" className="dark:text-black">Español</option>
        <option value="ca" className="dark:text-black">Català</option>
        <option value="fr" className="dark:text-black">Français</option>
      </select>
    </div>
  );
};