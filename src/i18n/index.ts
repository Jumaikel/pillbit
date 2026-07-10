import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  en: { translation: en },
  es: { translation: es }
};

const locales = Localization.getLocales();
const systemLang = (locales && locales.length > 0) ? (locales[0].languageCode ?? 'es') : 'es';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: systemLang,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export const initI18n = (savedLanguage: string) => {
  let lng = savedLanguage;
  if (!lng || lng === 'system') {
    lng = systemLang;
  }

  if (i18n.language !== lng) {
    i18n.changeLanguage(lng);
  }
};

export default i18n;
