import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/context/LanguageContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = Colors[useColorScheme() ?? 'light'];
  const { t } = useTranslation();

  const handleRegister = async () => {
    if (name === '' || email === '' || password === '') {
      Alert.alert('Hata', t('auth.fillAll'));
      return;
    }
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'Users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        role: 'Citizen',
        createdAt: new Date(),
        xp: 0,
        level: 'Bronze',
        badges: []
      });
      // Protected auth route will handle redirection
    } catch (error: any) {
      Alert.alert('Kayıt Başarısız', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title} type="title">{t('auth.createAccount')}</ThemedText>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.inputText }]}
            placeholder={t('auth.fullName')}
            placeholderTextColor={theme.placeholder}
            value={name}
            onChangeText={setName}
          />
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
          title={t('auth.register')}
          onPress={handleRegister}
          loading={loading}
          style={styles.button}
        />
      </ThemedView>
    </ScrollView>
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
    marginBottom: 32,
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
});
