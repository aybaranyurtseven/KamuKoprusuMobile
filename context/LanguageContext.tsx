import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language } from '@/i18n/translations';

const STORAGE_KEY = 'appLanguage';

type TFunction = (key: string, params?: Record<string, string | number>) => string;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TFunction;
}

const translate = (lang: Language, key: string, params?: Record<string, string | number>): string => {
  let value = translations[lang]?.[key] ?? translations.tr[key] ?? key;
  if (params) {
    for (const p of Object.keys(params)) {
      value = value.replace(`{${p}}`, String(params[p]));
    }
  }
  return value;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: () => {},
  t: (key) => key,
});

export const useTranslation = () => useContext(LanguageContext);

/**
 * Uygulama dilini yönetir (tr/en). Seçim AsyncStorage ile kalıcıdır.
 * t(key, params) çeviriyi döner; eksik anahtarlarda TR'ye, sonra anahtara düşer.
 */
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('tr');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'tr' || saved === 'en') setLanguageState(saved);
      })
      .catch(() => {});
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang).catch(() => {});
  };

  const t: TFunction = (key, params) => translate(language, key, params);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
