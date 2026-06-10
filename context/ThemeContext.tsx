import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'light' | 'dark' | 'system';
export type EffectiveScheme = 'light' | 'dark';

const STORAGE_KEY = 'themePreference';

interface AppThemeContextType {
  preference: ThemePreference;       // kullanıcının seçimi
  colorScheme: EffectiveScheme;      // ekranlarda kullanılan etkin tema
  setPreference: (p: ThemePreference) => void;
}

const AppThemeContext = createContext<AppThemeContextType>({
  preference: 'system',
  colorScheme: 'light',
  setPreference: () => {},
});

export const useAppTheme = () => useContext(AppThemeContext);

/**
 * Tema tercihini yönetir: 'light' | 'dark' | 'system'.
 * Seçim AsyncStorage ile kalıcıdır. 'system' iken cihazın temasını izler.
 * Etkin tema (colorScheme) tüm uygulamada useColorScheme üzerinden okunur.
 */
export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useRNColorScheme(); // 'light' | 'dark' | null
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  // Kayıtlı tercihi yükle
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setPreferenceState(saved);
        }
      })
      .catch(() => {});
  }, []);

  const setPreference = (p: ThemePreference) => {
    setPreferenceState(p);
    AsyncStorage.setItem(STORAGE_KEY, p).catch(() => {});
  };

  const colorScheme: EffectiveScheme =
    preference === 'system' ? (systemScheme ?? 'light') : preference;

  return (
    <AppThemeContext.Provider value={{ preference, colorScheme, setPreference }}>
      {children}
    </AppThemeContext.Provider>
  );
};
