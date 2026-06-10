import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider, useTranslation } from '@/context/LanguageContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Provider } from 'react-redux';
import { store } from '@/store';

export const unstable_settings = {
  anchor: '(drawer)',
};

const InitialLayout = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const segments = useSegments();
  const router = useRouter();

  // Push bildirim token kaydı + bildirime dokunma yönlendirmesi
  usePushNotifications();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      router.replace('/');
    } else if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [user, loading, segments, router]);

  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="complaint-detail" options={{ title: t('nav.complaintDetail'), headerBackTitle: t('common.back') }} />
      <Stack.Screen name="edit-profile" options={{ title: t('nav.editProfile'), headerBackTitle: t('common.back') }} />
      <Stack.Screen name="statistics" options={{ title: t('nav.statistics'), headerBackTitle: t('common.back') }} />
      <Stack.Screen name="edit-complaint" options={{ title: t('nav.editComplaint'), headerBackTitle: t('common.back') }} />
      <Stack.Screen name="notifications" options={{ title: t('nav.notifications'), headerBackTitle: t('common.back') }} />
      <Stack.Screen name="complaints-map" options={{ title: t('nav.map'), headerBackTitle: t('common.back') }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

// Etkin temayı (AppThemeProvider içinde) okuyup navigasyon temasını ve
// durum çubuğunu buna göre ayarlar.
function ThemedApp() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <AuthProvider>
          <InitialLayout />
        </AuthProvider>
      </Provider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <LanguageProvider>
          <ThemedApp />
        </LanguageProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}
