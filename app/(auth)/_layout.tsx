import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: true, title: 'Kayıt Ol', headerBackTitle: 'Geri' }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: true, title: 'Şifre Sıfırlama', headerBackTitle: 'Geri' }} />
    </Stack>
  );
}
