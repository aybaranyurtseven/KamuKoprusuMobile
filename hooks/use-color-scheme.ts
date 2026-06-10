import { useAppTheme } from '@/context/ThemeContext';

// Uygulama genelinde etkin temayı döndürür (manuel seçim veya sistem).
export function useColorScheme() {
  return useAppTheme().colorScheme;
}
