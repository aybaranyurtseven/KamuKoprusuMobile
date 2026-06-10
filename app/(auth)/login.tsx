import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/context/LanguageContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = Colors[useColorScheme() ?? 'light'];
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Hata', t('auth.fillAll'));
      return;
    }
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Protected routing will automatically redirect
    } catch (error: any) {
      Alert.alert('Giriş Başarısız', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} type="title">{t('auth.appName')}</ThemedText>
      <ThemedText style={styles.subtitle}>{t('auth.login')}</ThemedText>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.inputText }]}
          placeholder={t('auth.email')}
          placeholderTextColor={theme.placeholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.inputText }]}
          placeholder={t('auth.password')}
          placeholderTextColor={theme.placeholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <AnimatedButton
        title={t('auth.login')}
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      />

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
          <ThemedText style={styles.link}>{t('auth.forgotPassword')}</ThemedText>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <ThemedText>{t('auth.noAccount')}</ThemedText>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <ThemedText style={styles.link}>{t('auth.register')}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    marginBottom: 24,
  },
  footer: {
    alignItems: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  link: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
});
