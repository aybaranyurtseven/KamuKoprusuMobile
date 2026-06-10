import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function EditProfileScreen() {
  const { userData } = useAuth();
  const { save, saving } = useUpdateProfile();
  const router = useRouter();
  const theme = Colors[useColorScheme() ?? 'light'];

  const [name, setName] = useState(userData?.name ?? '');
  const [phone, setPhone] = useState(userData?.phone ?? '');
  const [avatarUri, setAvatarUri] = useState<string | undefined>(userData?.avatar);

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('İzin Gerekli', 'Avatar seçmek için galeri erişim izni gereklidir.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı girin.');
      return;
    }
    try {
      const ok = await save({ name, phone, avatarUri });
      if (ok) {
        Alert.alert('Başarılı', 'Profiliniz güncellendi.');
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Hata', 'Profil güncellenemedi: ' + (error?.message ?? error));
    }
  };

  const initial = (name.trim() || userData?.email || '?').charAt(0).toUpperCase();

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickAvatar} activeOpacity={0.8}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </TouchableOpacity>
          <ThemedText style={styles.changePhoto}>Fotoğrafı Değiştir</ThemedText>
        </View>

        {/* Ad Soyad */}
        <ThemedText style={styles.label}>Ad Soyad *</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.inputText }]}
          value={name}
          onChangeText={setName}
          placeholder="Ad Soyad"
          placeholderTextColor={theme.placeholder}
          maxLength={60}
        />

        {/* Telefon */}
        <ThemedText style={styles.label}>Telefon</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.inputText }]}
          value={phone}
          onChangeText={setPhone}
          placeholder="(opsiyonel)"
          placeholderTextColor={theme.placeholder}
          keyboardType="phone-pad"
          maxLength={20}
        />

        {/* E-posta (salt-okunur) */}
        <ThemedText style={styles.label}>E-posta</ThemedText>
        <View style={[styles.input, styles.readonly, { backgroundColor: theme.border }]}>
          <Text style={[styles.readonlyText, { color: theme.placeholder }]}>{userData?.email || '—'}</Text>
        </View>
        <ThemedText style={styles.hint}>E-posta adresi değiştirilemez.</ThemedText>

        <AnimatedButton
          title="Kaydet"
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: 28 }}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginTop: 8, marginBottom: 24 },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  avatarPlaceholder: {
    backgroundColor: '#e0f0f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 44, fontWeight: 'bold', color: '#0a7ea4' },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#0a7ea4',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cameraIcon: { fontSize: 16 },
  changePhoto: { marginTop: 10, color: '#0a7ea4', fontWeight: '600', fontSize: 14 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
  },
  readonly: { backgroundColor: '#eee', justifyContent: 'center' },
  readonlyText: { fontSize: 16, color: '#888' },
  hint: { fontSize: 12, opacity: 0.5, marginTop: 6 },
});
