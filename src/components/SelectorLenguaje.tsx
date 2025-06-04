import React from 'react';
import { useTranslation } from 'react-i18next';
import { Earth } from 'lucide-react';

export const SelectorLenguaje: React.FC = () => {
  const { i18n } = useTranslation();

  const cambiarLenguaje = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng: string = e.target.value;
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center">
        <Earth className="w-5 h-5 text-green-700 dark:text-green-300" />
      </span>
      <select
        className="appearance-none p-2 rounded-md bg-white dark:bg-gray-800 text-green-700 dark:text-green-300 border border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 focus:outline-none text-sm cursor-pointer"
        value={i18n.language}
        onChange={cambiarLenguaje}
        aria-label="Select language"
      >
        <option value="en" className="text-green-700 dark:text-green-300 bg-white dark:bg-gray-800">
          English
        </option>
        <option value="es" className="text-green-700 dark:text-green-300 bg-white dark:bg-gray-800">
          Español
        </option>
        <option value="ca" className="text-green-700 dark:text-green-300 bg-white dark:bg-gray-800">
          Català
        </option>
        <option value="fr" className="text-green-700 dark:text-green-300 bg-white dark:bg-gray-800">
          Français
        </option>
      </select>
    </div>
  );
};