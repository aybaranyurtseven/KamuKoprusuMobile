import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Complaint } from '@/types/firestore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { updateComplaintStatus } from '@/services/firestoreService';
import { rewardComplaintStatus } from '@/services/gamificationService';
import { useComplaintDetail } from '@/hooks/useComplaintDetail';
import { COMPLAINT_STATUS, getStatusInfo } from '@/constants/complaintStatus';
import { formatDateTime } from '@/utils/date';

const MODERATOR_ROLES = ['Moderator', 'Admin', 'NGOCoordinator'];

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, userData } = useAuth();
  const { complaint, updates, loading } = useComplaintDetail(id);
  const [selectedStatus, setSelectedStatus] = useState<Complaint['status'] | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isModerator = MODERATOR_ROLES.includes(userData?.role);
  const isOwnerInstitution =
    userData?.role === 'InstitutionRep' && userData?.institutionId === complaint?.institutionId;
  const canManage = isModerator || isOwnerInstitution;

  const handleUpdateStatus = async () => {
    if (!complaint || !selectedStatus) {
      Alert.alert('Durum seçin', 'Lütfen yeni bir durum seçin.');
      return;
    }
    setSubmitting(true);
    try {
      const statusLabel = getStatusInfo(selectedStatus).label;
      const message = note.trim() || `Durum güncellendi: ${statusLabel}`;
      const updatedBy = userData?.name || user?.email || 'Yetkili';
      await updateComplaintStatus(complaint.id, selectedStatus, updatedBy, message);

      // Onay/Çözüm durumlarında şikayet sahibine XP + rozet kazandır (idempotent).
      // Oyunlaştırma yazımı askıda kalsa bile durum güncellemesi bloke olmasın:
      // zaman aşımı korumalı ve arka planda.
      if (selectedStatus === 'Approved' || selectedStatus === 'Resolved') {
        Promise.race([
          rewardComplaintStatus(complaint, selectedStatus),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
        ]).catch((gamificationError) => {
          console.error('Gamification error:', gamificationError);
        });
      }

      setNote('');
      setSelectedStatus(null);
      Alert.alert('Başarılı', 'Şikayet durumu güncellendi.');
    } catch (e) {
      console.error(e);
      Alert.alert('Hata', 'Durum güncellenemedi. Yetkiniz olmayabilir.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  if (!complaint) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Şikayet bulunamadı.</ThemedText>
      </ThemedView>
    );
  }

  const statusInfo = getStatusInfo(complaint.status);

  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: statusInfo.color }]}>
          <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
          <Text style={styles.statusLabel}>{statusInfo.label}</Text>
        </View>

        {/* Title & Details */}
        <ThemedText style={styles.title} type="title">{complaint.title}</ThemedText>

        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>📁 {complaint.category}</Text>
          <Text style={styles.metaItem}>🏢 {complaint.institutionName}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>📅 {formatDateTime(complaint.createdAt)}</Text>
          {complaint.isAnonymous && <Text style={styles.metaItem}>🔒 Anonim</Text>}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Açıklama</ThemedText>
          <ThemedText style={styles.descriptionText}>{complaint.description}</ThemedText>
        </View>

        {/* Media */}
        {complaint.mediaUrls && complaint.mediaUrls.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Ekler ({complaint.mediaUrls.length} dosya)
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.mediaRow}>
                {complaint.mediaUrls.map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={styles.mediaImage}
                    resizeMode="cover"
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Durum Güncelleme (sadece yetkili roller) */}
        {canManage && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Durumu Güncelle</ThemedText>
            <View style={styles.statusOptions}>
              {(Object.keys(COMPLAINT_STATUS) as Complaint['status'][]).map((s) => {
                const info = COMPLAINT_STATUS[s];
                const active = selectedStatus === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setSelectedStatus(s)}
                    style={[
                      styles.statusOption,
                      { borderColor: info.color },
                      active && { backgroundColor: info.color },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        active ? { color: '#fff' } : { color: info.color },
                      ]}
                    >
                      {info.icon} {info.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="Vatandaşa not (opsiyonel)"
              placeholderTextColor="#999"
              value={note}
              onChangeText={setNote}
              multiline
            />
            <TouchableOpacity
              style={[styles.updateButton, (!selectedStatus || submitting) && { opacity: 0.5 }]}
              onPress={handleUpdateStatus}
              disabled={!selectedStatus || submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.updateButtonText}>Durumu Güncelle</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Updates Timeline */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Süreç Geçmişi</ThemedText>
          {updates.length === 0 ? (
            <ThemedText style={styles.emptyText}>Henüz güncelleme yok.</ThemedText>
          ) : (
            <View style={styles.timeline}>
              {updates.map((update, index) => {
                const updateStatus = getStatusInfo(update.newStatus);
                return (
                  <View key={update.id} style={styles.timelineItem}>
                    <View style={styles.timelineDot}>
                      <View style={[styles.dot, { backgroundColor: updateStatus?.color || '#999' }]} />
                      {index < updates.length - 1 && <View style={styles.timelineLine} />}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineStatus}>
                        {updateStatus?.icon} {updateStatus?.label || update.newStatus}
                      </Text>
                      <Text style={styles.timelineMessage}>{update.message}</Text>
                      <Text style={styles.timelineDate}>{formatDateTime(update.createdAt)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 8,
    gap: 8,
  },
  statusIcon: {
    fontSize: 20,
  },
  statusLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 6,
  },
  metaItem: {
    fontSize: 13,
    color: '#888',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.85,
  },
  mediaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mediaImage: {
    width: 160,
    height: 120,
    borderRadius: 12,
  },
  emptyText: {
    opacity: 0.5,
    textAlign: 'center',
    paddingVertical: 20,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineDot: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineStatus: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  timelineMessage: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 11,
    color: '#aaa',
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    minHeight: 70,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
    marginBottom: 14,
  },
  updateButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
