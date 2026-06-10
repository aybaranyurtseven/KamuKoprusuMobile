import { useAppTheme } from '@/context/ThemeContext';

// Web'de de etkin temayı context'ten okur (manuel seçim veya sistem).
export function useColorScheme() {
  return useAppTheme().colorScheme;
}
