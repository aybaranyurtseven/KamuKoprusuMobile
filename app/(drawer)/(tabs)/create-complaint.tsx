import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ScrollView, Image, Switch
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Institution } from '@/types/firestore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { RewardModal } from '@/components/ui/RewardModal';
import { useInstitutions } from '@/hooks/useInstitutions';
import { useCreateComplaint } from '@/hooks/useCreateComplaint';
import { useDeviceLocation, DeviceLocation } from '@/hooks/useDeviceLocation';
import { COMPLAINT_CATEGORIES as CATEGORIES } from '@/constants/categories';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CreateComplaintScreen() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const { institutions } = useInstitutions();
  const { submit, submitting, reward, clearReward } = useCreateComplaint();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showInstitutionPicker, setShowInstitutionPicker] = useState(false);
  const [location, setLocation] = useState<DeviceLocation | null>(null);
  const { fetchLocation, loading: locationLoading } = useDeviceLocation();

  const handleAddLocation = async () => {
    const result = await fetchLocation();
    if (result) setLocation(result);
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert('Limit', 'En fazla 5 fotoğraf ekleyebilirsiniz.');
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('İzin Gerekli', 'Galeriye erişim izni gereklidir.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    if (images.length >= 5) {
      Alert.alert('Limit', 'En fazla 5 fotoğraf ekleyebilirsiniz.');
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('İzin Gerekli', 'Kamera erişim izni gereklidir.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Hata', 'Lütfen bir başlık girin.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Hata', 'Lütfen açıklama girin.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Hata', 'Lütfen bir kategori seçin.');
      return;
    }
    if (!selectedInstitution) {
      Alert.alert('Hata', 'Lütfen bir kurum seçin.');
      return;
    }
    // Tüm backend diyalogu (kayıt + medya + oyunlaştırma) hook'ta. Ekran yalnızca
    // doğrulama, form sıfırlama ve ödül modalı ile ilgilenir.
    try {
      const ok = await submit({
        title,
        description,
        category: selectedCategory,
        institution: selectedInstitution,
        images,
        isAnonymous,
        location: location ?? undefined,
      });
      if (ok) {
        setTitle('');
        setDescription('');
        setSelectedCategory('');
        setSelectedInstitution(null);
        setImages([]);
        setIsAnonymous(false);
        setLocation(null);
      }
    } catch (error: any) {
      Alert.alert('Hata', 'Şikayet gönderilirken bir sorun oluştu: ' + (error?.message ?? error));
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.pageTitle} type="title">Yeni Şikayet</ThemedText>

        {/* Title */}
        <ThemedText style={styles.label}>Başlık *</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.inputText }]}
          placeholder="Şikayetinizin başlığı"
          placeholderTextColor={theme.placeholder}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        {/* Description */}
        <ThemedText style={styles.label}>Açıklama *</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, color: theme.inputText }]}
          placeholder="Şikayetinizi detaylı bir şekilde açıklayın..."
          placeholderTextColor={theme.placeholder}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {/* Category */}
        <ThemedText style={styles.label}>Kategori *</ThemedText>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const selected = selectedCategory === cat.value;
            return (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryChip,
                  { backgroundColor: theme.chipBg, borderColor: theme.border },
                  selected && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
                onPress={() => setSelectedCategory(cat.value)}
              >
                <Text style={[styles.categoryChipText, { color: selected ? '#fff' : theme.textSecondary }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Institution */}
        <ThemedText style={styles.label}>Kurum *</ThemedText>
        <TouchableOpacity
          style={[styles.input, { backgroundColor: theme.inputBg }]}
          onPress={() => setShowInstitutionPicker(!showInstitutionPicker)}
        >
          <Text style={{ color: selectedInstitution ? theme.inputText : theme.placeholder, fontSize: 16 }}>
            {selectedInstitution ? selectedInstitution.name : 'Kurum seçin...'}
          </Text>
        </TouchableOpacity>
        {showInstitutionPicker && (
          <View style={[styles.pickerDropdown, { backgroundColor: theme.cardSolid, borderColor: theme.border }]}>
            {institutions.length === 0 ? (
              <Text style={[styles.emptyPickerText, { color: theme.placeholder }]}>Henüz kurum tanımlanmamış</Text>
            ) : (
              institutions.map((inst) => (
                <TouchableOpacity
                  key={inst.id}
                  style={[styles.pickerItem, { borderBottomColor: theme.border }]}
                  onPress={() => {
                    setSelectedInstitution(inst);
                    setShowInstitutionPicker(false);
                  }}
                >
                  <Text style={[styles.pickerItemText, { color: theme.text }]}>{inst.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Media Upload */}
        <ThemedText style={styles.label}>Fotoğraf Ekle (Maks. 5)</ThemedText>
        <View style={styles.mediaRow}>
          <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
            <Text style={styles.mediaButtonIcon}>🖼️</Text>
            <Text style={styles.mediaButtonText}>Galeri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
            <Text style={styles.mediaButtonIcon}>📷</Text>
            <Text style={styles.mediaButtonText}>Kamera</Text>
          </TouchableOpacity>
        </View>

        {images.length > 0 && (
          <View style={styles.imagePreviewRow}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imagePreviewContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeImageText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Konum */}
        <ThemedText style={styles.label}>Konum (opsiyonel)</ThemedText>
        {location ? (
          <View style={styles.locationCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.locationAddress} numberOfLines={2}>
                📍 {location.address || 'Konum eklendi'}
              </Text>
              <Text style={styles.locationCoords}>
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setLocation(null)} style={styles.locationRemove}>
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleAddLocation}
            disabled={locationLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.locationButtonText}>
              {locationLoading ? '📍 Konum alınıyor…' : '📍 Mevcut Konumu Ekle'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Anonymous Toggle */}
        <View style={styles.anonymousRow}>
          <ThemedText>Anonim olarak gönder</ThemedText>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: '#ccc', true: '#0a7ea4' }}
          />
        </View>

        {/* Submit */}
        <AnimatedButton
          title="Şikayeti Gönder"
          onPress={handleSubmit}
          loading={submitting}
          style={{ marginTop: 24 }}
        />
      </ThemedView>

      <RewardModal
        visible={reward !== null}
        xpGained={reward?.xpGained ?? 0}
        leveledUp={reward?.leveledUp}
        newLevel={reward?.newLevel}
        newBadges={reward?.newBadges}
        onClose={clearReward}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    marginBottom: 24,
    marginTop: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryChipSelected: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#555',
  },
  categoryChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  pickerDropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    maxHeight: 200,
  },
  pickerItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerItemText: {
    fontSize: 15,
  },
  emptyPickerText: {
    padding: 14,
    color: '#999',
    textAlign: 'center',
  },
  mediaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: '#f0f9fc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0eaf3',
    borderStyle: 'dashed',
  },
  mediaButtonIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  mediaButtonText: {
    fontSize: 13,
    color: '#0a7ea4',
    fontWeight: '600',
  },
  imagePreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  imagePreviewContainer: {
    position: 'relative',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  anonymousRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  locationButton: {
    backgroundColor: '#f0f9fc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0eaf3',
    borderStyle: 'dashed',
    marginTop: 4,
  },
  locationButtonText: {
    fontSize: 14,
    color: '#0a7ea4',
    fontWeight: '600',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eafaf1',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#cdeeda',
  },
  locationAddress: {
    fontSize: 14,
    color: '#1e7e4f',
    fontWeight: '600',
  },
  locationCoords: {
    fontSize: 12,
    color: '#5a8f74',
    marginTop: 2,
  },
  locationRemove: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
