import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationCA from './locales/ca/translation.json';
import translationES from './locales/es/translation.json';
import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';

const resources = {
  ca: { translation: translationCA },
  es: { translation: translationES },
  en: { translation: translationEN },
  fr: { translation: translationFR }
};

i18n
  .use(LanguageDetector)  
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ca',      
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage']
    }
  });

export default i18n;
