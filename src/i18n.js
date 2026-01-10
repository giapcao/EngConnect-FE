import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';

// Lấy ngôn ngữ từ localStorage hoặc mặc định là 'en'
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi }
    },
    lng: savedLanguage, // Ngôn ngữ mặc định
    fallbackLng: 'en', // Ngôn ngữ dự phòng
    interpolation: {
      escapeValue: false // React đã tự động escape
    }
  });

export default i18n;
