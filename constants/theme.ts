/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#3b82f6'; // Modern Blue
const tintColorDark = '#60a5fa'; // Lighter Blue for Dark Mode

export const Colors = {
  light: {
    text: '#0f172a', // Slate 900
    textSecondary: '#64748b', // Slate 500
    background: '#f8fafc', // Slate 50
    card: 'rgba(255, 255, 255, 0.7)', // Glass effect
    cardBorder: 'rgba(255, 255, 255, 0.5)',
    tint: tintColorLight,
    icon: '#64748b',
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorLight,
    primary: '#3b82f6',
    secondary: '#8b5cf6', // Violet
    danger: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    glass: 'rgba(255, 255, 255, 0.85)',
    // Semantik yüzey tokenları (form/kart/çip) — koyu tema uyumu için
    inputBg: '#f1f5f9',     // Slate 100
    inputText: '#0f172a',
    placeholder: '#94a3b8', // Slate 400
    border: '#e2e8f0',      // Slate 200
    cardSolid: '#ffffff',
    chipBg: '#eef2f6',
  },
  dark: {
    text: '#f8fafc', // Slate 50
    textSecondary: '#94a3b8', // Slate 400
    background: '#0f172a', // Slate 900
    card: 'rgba(30, 41, 59, 0.7)', // Glass effect dark
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    tint: tintColorDark,
    icon: '#94a3b8',
    tabIconDefault: '#475569',
    tabIconSelected: tintColorDark,
    primary: '#60a5fa',
    secondary: '#a78bfa',
    danger: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    glass: 'rgba(30, 41, 59, 0.85)',
    // Semantik yüzey tokenları (form/kart/çip) — koyu tema uyumu için
    inputBg: '#1e293b',     // Slate 800
    inputText: '#f8fafc',
    placeholder: '#64748b', // Slate 500
    border: '#334155',      // Slate 700
    cardSolid: '#1e293b',
    chipBg: '#334155',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
