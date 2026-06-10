import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TextInput, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Complaint } from '@/types/firestore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { updateComplaintStatus, createNotification, rateComplaint } from '@/services/firestoreService';
import { StarRating } from '@/components/ui/StarRating';
import { rewardComplaintStatus } from '@/services/gamificationService';
import { notifyComplaintStatus, notifyNewMessage } from '@/services/notificationService';
import { useComplaintDetail } from '@/hooks/useComplaintDetail';
import { useComplaintActions } from '@/hooks/useComplaintActions';
import { useComplaintMessages } from '@/hooks/useComplaintMessages';
import { COMPLAINT_STATUS, getStatusInfo } from '@/constants/complaintStatus';
import { formatDateTime } from '@/utils/date';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const MODERATOR_ROLES = ['Moderator', 'Admin', 'NGOCoordinator'];

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = Colors[useColorScheme() ?? 'light'];
  const { user, userData } = useAuth();
  const { complaint, updates, loading } = useComplaintDetail(id);
  const { remove, busy } = useComplaintActions();
  const { messages, sending, send } = useComplaintMessages(id);
  const [selectedStatus, setSelectedStatus] = useState<Complaint['status'] | null>(null);
  const [note, setNote] = useState('');
  const [messageText, setMessageText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isModerator = MODERATOR_ROLES.includes(userData?.role);
  const isOwnerInstitution =
    userData?.role === 'InstitutionRep' && userData?.institutionId === complaint?.institutionId;
  const canManage = isModerator || isOwnerInstitution;

  // Mesajlaşmaya sahip (vatandaş) ve yöneten yetkili katılabilir.
  const isOwner = !!complaint && complaint.userId === user?.uid;
  const canMessage = isOwner || canManage;

  // Değerlendirme: yalnızca sahip ve şikayet çözüldüğünde/kapandığında.
  const isResolved = complaint?.status === 'Resolved' || complaint?.status === 'Closed';
  const ownerCanRate = isOwner && isResolved;
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingBusy, setRatingBusy] = useState(false);
  const [ratingHydrated, setRatingHydrated] = useState(false);

  useEffect(() => {
    if (complaint && !ratingHydrated) {
      setRatingValue(complaint.rating ?? 0);
      setRatingComment(complaint.ratingComment ?? '');
      setRatingHydrated(true);
    }
  }, [complaint, ratingHydrated]);

  const handleSubmitRating = async () => {
    if (!id || ratingValue < 1) {
      Alert.alert('Puan verin', 'Lütfen 1-5 arası bir yıldız seçin.');
      return;
    }
    setRatingBusy(true);
    try {
      await rateComplaint(id, ratingValue, ratingComment);
      Alert.alert('Teşekkürler', 'Değerlendirmeniz kaydedildi.');
    } catch (e: any) {
      Alert.alert('Hata', 'Değerlendirme kaydedilemedi: ' + (e?.message ?? e));
    } finally {
      setRatingBusy(false);
    }
  };

  const handleSendMessage = async () => {
    const text = messageText.trim();
    const ok = await send(messageText);
    if (!ok) return;
    setMessageText('');

    // Yetkili mesaj yazdıysa şikayet sahibine push + uygulama içi bildirim gönder.
    if (canManage && complaint && complaint.userId !== user?.uid) {
      const senderName = userData?.name || 'Yetkili';
      notifyNewMessage(complaint.userId, complaint.id, senderName, text).catch((e) =>
        console.error('Message push error:', e)
      );
      createNotification({
        userId: complaint.userId,
        complaintId: complaint.id,
        complaintTitle: complaint.title,
        type: 'message',
        message: `${senderName}: ${text}`,
      }).catch((e) => console.error('Message notification error:', e));
    }
  };

  // Sahibi yalnızca henüz incelenmemiş (PendingModeration) şikayetini düzenler/siler.
  const canEditOwn =
    !!complaint && complaint.userId === user?.uid && complaint.status === 'PendingModeration';

  const handleDelete = () => {
    if (!id) return;
    Alert.alert('Şikayeti Sil', 'Bu şikayeti silmek istediğinize emin misiniz?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            const ok = await remove(id);
            if (ok) router.back();
          } catch (error: any) {
            Alert.alert('Hata', 'Silinemedi: ' + (error?.message ?? error));
          }
        },
      },
    ]);
  };

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

      // Şikayet sahibine push bildirimi gönder (arka planda; UI'ı bloke etmesin).
      notifyComplaintStatus(complaint, selectedStatus, message).catch((notifyError) => {
        console.error('Notification error:', notifyError);
      });

      // Uygulama içi bildirim merkezi için kayıt oluştur (arka planda).
      createNotification({
        userId: complaint.userId,
        complaintId: complaint.id,
        complaintTitle: complaint.title,
        newStatus: selectedStatus,
        message,
      }).catch((notifError) => console.error('In-app notification error:', notifError));

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
          <Text style={[styles.metaItem, { color: theme.textSecondary }]}>📁 {complaint.category}</Text>
          <Text style={[styles.metaItem, { color: theme.textSecondary }]}>🏢 {complaint.institutionName}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.metaItem, { color: theme.textSecondary }]}>📅 {formatDateTime(complaint.createdAt)}</Text>
          {complaint.isAnonymous && <Text style={[styles.metaItem, { color: theme.textSecondary }]}>🔒 Anonim</Text>}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Açıklama</ThemedText>
          <ThemedText style={styles.descriptionText}>{complaint.description}</ThemedText>
        </View>

        {/* Değerlendirme — sahip, çözülen şikayeti puanlar */}
        {ownerCanRate && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Süreci Değerlendir</ThemedText>
            <StarRating value={ratingValue} onChange={setRatingValue} size={36} />
            <TextInput
              style={[styles.noteInput, { backgroundColor: theme.inputBg, color: theme.inputText, borderColor: theme.border, marginTop: 12 }]}
              placeholder="Yorumun (opsiyonel)"
              placeholderTextColor={theme.placeholder}
              value={ratingComment}
              onChangeText={setRatingComment}
              multiline
            />
            <TouchableOpacity
              style={[styles.updateButton, (ratingValue < 1 || ratingBusy) && { opacity: 0.5 }]}
              onPress={handleSubmitRating}
              disabled={ratingValue < 1 || ratingBusy}
              activeOpacity={0.85}
            >
              {ratingBusy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.updateButtonText}>{complaint.rating ? 'Güncelle' : 'Gönder'}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Yetkiliye vatandaş değerlendirmesini göster */}
        {!ownerCanRate && typeof complaint.rating === 'number' && complaint.rating > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Vatandaş Değerlendirmesi</ThemedText>
            <StarRating value={complaint.rating} size={24} />
            {!!complaint.ratingComment && (
              <Text style={{ color: theme.textSecondary, fontSize: 15, lineHeight: 22, marginTop: 8 }}>
                {complaint.ratingComment}
              </Text>
            )}
          </View>
        )}

        {/* Sahip işlemleri: yalnızca inceleme öncesi düzenle/sil */}
        {canEditOwn && (
          <View style={styles.ownerActions}>
            <TouchableOpacity
              style={[styles.ownerBtn, styles.editBtn]}
              onPress={() => router.push({ pathname: '/edit-complaint', params: { id } })}
              disabled={busy}
              activeOpacity={0.85}
            >
              <Text style={styles.editBtnText}>✎  Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ownerBtn, styles.deleteBtn]}
              onPress={handleDelete}
              disabled={busy}
              activeOpacity={0.85}
            >
              {busy ? (
                <ActivityIndicator color="#e74c3c" />
              ) : (
                <Text style={styles.deleteBtnText}>🗑  Sil</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

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

        {/* Konum */}
        {complaint.location && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Konum</ThemedText>
            <TouchableOpacity
              style={styles.locationCard}
              activeOpacity={0.8}
              onPress={() => {
                const { latitude, longitude } = complaint.location!;
                const label = encodeURIComponent(complaint.title);
                const url = Platform.select({
                  ios: `maps://?q=${label}&ll=${latitude},${longitude}`,
                  android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
                  default: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`,
                });
                Linking.openURL(url).catch(() =>
                  Linking.openURL(
                    `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`
                  )
                );
              }}
            >
              <Text style={styles.locationPin}>📍</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.locationAddress}>
                  {complaint.location.address || 'Konum bilgisi'}
                </Text>
                <Text style={styles.locationCoords}>
                  {complaint.location.latitude.toFixed(5)}, {complaint.location.longitude.toFixed(5)}
                </Text>
              </View>
              <Text style={styles.locationOpen}>Haritada Aç →</Text>
            </TouchableOpacity>
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
              style={[styles.noteInput, { backgroundColor: theme.inputBg, color: theme.inputText, borderColor: theme.border }]}
              placeholder="Vatandaşa not (opsiyonel)"
              placeholderTextColor={theme.placeholder}
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
                      <Text style={[styles.timelineStatus, { color: theme.text }]}>
                        {updateStatus?.icon} {updateStatus?.label || update.newStatus}
                      </Text>
                      <Text style={[styles.timelineMessage, { color: theme.textSecondary }]}>{update.message}</Text>
                      <Text style={[styles.timelineDate, { color: theme.textSecondary }]}>{formatDateTime(update.createdAt)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Mesajlar (sahip ↔ yetkili) */}
        {canMessage && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Mesajlar</ThemedText>
            {messages.length === 0 ? (
              <ThemedText style={styles.emptyText}>Henüz mesaj yok. İlk mesajı sen yaz.</ThemedText>
            ) : (
              <View style={{ gap: 10, marginBottom: 12 }}>
                {messages.map((m) => {
                  const mine = m.senderId === user?.uid;
                  return (
                    <View key={m.id} style={mine ? styles.msgRowMine : styles.msgRowOther}>
                      <View
                        style={[
                          styles.bubble,
                          { backgroundColor: mine ? theme.primary : theme.chipBg },
                        ]}
                      >
                        {!mine && (
                          <Text style={[styles.msgSender, { color: theme.textSecondary }]}>{m.senderName}</Text>
                        )}
                        <Text style={[styles.msgText, { color: mine ? '#fff' : theme.text }]}>{m.text}</Text>
                        <Text style={[styles.msgTime, { color: mine ? 'rgba(255,255,255,0.75)' : theme.placeholder }]}>
                          {formatDateTime(m.createdAt)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            <View style={styles.msgInputRow}>
              <TextInput
                style={[styles.msgInput, { backgroundColor: theme.inputBg, color: theme.inputText, borderColor: theme.border }]}
                placeholder="Mesaj yaz..."
                placeholderTextColor={theme.placeholder}
                value={messageText}
                onChangeText={setMessageText}
                multiline
              />
              <TouchableOpacity
                style={[styles.msgSendBtn, { backgroundColor: theme.primary }, (!messageText.trim() || sending) && { opacity: 0.5 }]}
                onPress={handleSendMessage}
                disabled={!messageText.trim() || sending}
                activeOpacity={0.85}
              >
                {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.msgSendText}>Gönder</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  ownerActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  ownerBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  editBtn: { borderColor: '#0a7ea4', backgroundColor: '#eaf6fb' },
  editBtnText: { color: '#0a7ea4', fontWeight: '700', fontSize: 14 },
  deleteBtn: { borderColor: '#e74c3c', backgroundColor: '#fdeeec' },
  deleteBtnText: { color: '#e74c3c', fontWeight: '700', fontSize: 14 },
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
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eafaf1',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#cdeeda',
  },
  locationPin: { fontSize: 22, marginRight: 10 },
  locationAddress: { fontSize: 14, color: '#1e7e4f', fontWeight: '600' },
  locationCoords: { fontSize: 12, color: '#5a8f74', marginTop: 2 },
  locationOpen: { fontSize: 12, color: '#0a7ea4', fontWeight: '700', marginLeft: 8 },
  msgRowMine: { alignItems: 'flex-end' },
  msgRowOther: { alignItems: 'flex-start' },
  bubble: { maxWidth: '85%', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 },
  msgSender: { fontSize: 11, fontWeight: '700', marginBottom: 2 },
  msgText: { fontSize: 14, lineHeight: 19 },
  msgTime: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  msgInputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxHeight: 110,
    fontSize: 14,
  },
  msgSendBtn: {
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  msgSendText: { color: '#fff', fontWeight: '700', fontSize: 14 },
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
