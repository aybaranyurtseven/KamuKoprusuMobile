import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, ScrollView, Image, Switch
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/firebaseConfig';
import { createComplaint } from '@/services/firestoreService';
import { getInstitutions } from '@/services/firestoreService';
import { Institution } from '@/types/firestore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = [
  { label: 'Ulaşım', value: 'Ulaşım' },
  { label: 'Sağlık', value: 'Sağlık' },
  { label: 'Eğitim', value: 'Eğitim' },
  { label: 'Altyapı', value: 'Altyapı' },
  { label: 'Çevre', value: 'Çevre' },
  { label: 'Güvenlik', value: 'Güvenlik' },
  { label: 'Diğer', value: 'Diğer' },
];

export default function CreateComplaintScreen() {
  const { user, userData } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInstitutionPicker, setShowInstitutionPicker] = useState(false);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const data = await getInstitutions();
        setInstitutions(data);
      } catch (error) {
        console.error('Error fetching institutions:', error);
      }
    };
    fetchInstitutions();
  }, []);

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

  const uploadImage = async (uri: string, complaintId: string, index: number): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `complaints/${complaintId}/${Date.now()}_${index}.jpg`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
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
    if (!user) return;

    setLoading(true);
    try {
      // Create complaint first without media
      const complaintId = await createComplaint({
        userId: user.uid,
        userName: isAnonymous ? 'Anonim' : (userData?.name || 'Bilinmiyor'),
        institutionId: selectedInstitution.id,
        institutionName: selectedInstitution.name,
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        status: 'PendingModeration',
        type: 'Complaint',
        mediaUrls: [],
        isAnonymous,
      });

      // Upload images if any
      if (images.length > 0) {
        const uploadPromises = images.map((uri, index) => uploadImage(uri, complaintId, index));
        const urls = await Promise.all(uploadPromises);

        // Update complaint with media URLs
        const { doc, updateDoc } = await import('firebase/firestore');
        const complaintRef = doc(db, 'Complaints', complaintId);
        await updateDoc(complaintRef, { mediaUrls: urls });
      }

      Alert.alert('Başarılı', 'Şikayetiniz başarıyla gönderildi! Moderatör incelemesinden sonra ilgili kuruma iletilecektir.');

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedCategory('');
      setSelectedInstitution(null);
      setImages([]);
      setIsAnonymous(false);
    } catch (error: any) {
      Alert.alert('Hata', 'Şikayet gönderilirken bir sorun oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.pageTitle} type="title">Yeni Şikayet</ThemedText>

        {/* Title */}
        <ThemedText style={styles.label}>Başlık *</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Şikayetinizin başlığı"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        {/* Description */}
        <ThemedText style={styles.label}>Açıklama *</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Şikayetinizi detaylı bir şekilde açıklayın..."
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {/* Category */}
        <ThemedText style={styles.label}>Kategori *</ThemedText>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryChip,
                selectedCategory === cat.value && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(cat.value)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === cat.value && styles.categoryChipTextSelected,
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Institution */}
        <ThemedText style={styles.label}>Kurum *</ThemedText>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowInstitutionPicker(!showInstitutionPicker)}
        >
          <Text style={{ color: selectedInstitution ? '#333' : '#999', fontSize: 16 }}>
            {selectedInstitution ? selectedInstitution.name : 'Kurum seçin...'}
          </Text>
        </TouchableOpacity>
        {showInstitutionPicker && (
          <View style={styles.pickerDropdown}>
            {institutions.length === 0 ? (
              <Text style={styles.emptyPickerText}>Henüz kurum tanımlanmamış</Text>
            ) : (
              institutions.map((inst) => (
                <TouchableOpacity
                  key={inst.id}
                  style={styles.pickerItem}
                  onPress={() => {
                    setSelectedInstitution(inst);
                    setShowInstitutionPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{inst.name}</Text>
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
        <TouchableOpacity
          style={[styles.submitButton, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Şikayeti Gönder</Text>
          )}
        </TouchableOpacity>
      </ThemedView>
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
  submitButton: {
    backgroundColor: '#0a7ea4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
