import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { useComplaintDetail } from '@/hooks/useComplaintDetail';
import { useComplaintActions } from '@/hooks/useComplaintActions';
import { COMPLAINT_CATEGORIES } from '@/constants/categories';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function EditComplaintScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = Colors[useColorScheme() ?? 'light'];
  const { complaint, loading } = useComplaintDetail(id);
  const { saveEdit, busy } = useComplaintActions();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [hydrated, setHydrated] = useState(false);

  // Şikayet yüklendiğinde formu bir kez doldur.
  useEffect(() => {
    if (complaint && !hydrated) {
      setTitle(complaint.title);
      setDescription(complaint.description);
      setCategory(complaint.category);
      setHydrated(true);
    }
  }, [complaint, hydrated]);

  const handleSave = async () => {
    if (!id) return;
    if (!title.trim()) {
      Alert.alert('Hata', 'Lütfen bir başlık girin.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Hata', 'Lütfen açıklama girin.');
      return;
    }
    if (!category) {
      Alert.alert('Hata', 'Lütfen bir kategori seçin.');
      return;
    }
    try {
      const ok = await saveEdit(id, {
        title: title.trim(),
        description: description.trim(),
        category,
      });
      if (ok) {
        Alert.alert('Başarılı', 'Şikayetiniz güncellendi.');
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Hata', 'Güncellenemedi: ' + (error?.message ?? error));
    }
  };

  if (loading || !complaint) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText style={styles.label}>Başlık *</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.inputText }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Şikayet başlığı"
          placeholderTextColor={theme.placeholder}
          maxLength={100}
        />

        <ThemedText style={styles.label}>Açıklama *</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, color: theme.inputText }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Açıklama"
          placeholderTextColor={theme.placeholder}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <ThemedText style={styles.label}>Kategori *</ThemedText>
        <View style={styles.categoryGrid}>
          {COMPLAINT_CATEGORIES.map((cat) => {
            const selected = category === cat.value;
            return (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.chip,
                  { backgroundColor: theme.chipBg, borderColor: theme.border },
                  selected && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
                onPress={() => setCategory(cat.value)}
              >
                <Text style={[styles.chipText, { color: selected ? '#fff' : theme.textSecondary }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ThemedText style={styles.label}>Kurum</ThemedText>
        <View style={[styles.input, styles.readonly, { backgroundColor: theme.border }]}>
          <Text style={[styles.readonlyText, { color: theme.placeholder }]}>{complaint.institutionName}</Text>
        </View>
        <ThemedText style={styles.hint}>Kurum ve ekler düzenleme ekranında değiştirilemez.</ThemedText>

        <AnimatedButton title="Kaydet" onPress={handleSave} loading={busy} style={{ marginTop: 24 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16, color: '#333' },
  textArea: { minHeight: 120, paddingTop: 14 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipSelected: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  chipText: { fontSize: 14, color: '#555' },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  readonly: { backgroundColor: '#eee', justifyContent: 'center' },
  readonlyText: { fontSize: 16, color: '#888' },
  hint: { fontSize: 12, opacity: 0.5, marginTop: 6 },
});
