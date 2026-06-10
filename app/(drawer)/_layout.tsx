import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/context/LanguageContext';
import { DrawerContent } from '@/components/DrawerContent';

// (tabs)'i Drawer içine alır: Stack -> Drawer -> Bottom Tabs.
// Yan menüde Ana Sayfa (sekmeler), Hakkında ve Ayarlar ekranları yer alır.
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function DrawerLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { t } = useTranslation();

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerTintColor: theme.text,
        headerStyle: { backgroundColor: theme.background },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.textSecondary,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{ title: t('auth.appName'), drawerLabel: t('drawer.home') }}
      />
      <Drawer.Screen
        name="about"
        options={{ title: t('nav.about'), drawerLabel: t('drawer.about') }}
      />
      <Drawer.Screen
        name="settings"
        options={{ title: t('nav.settings'), drawerLabel: t('drawer.settings') }}
      />
    </Drawer>
  );
}
