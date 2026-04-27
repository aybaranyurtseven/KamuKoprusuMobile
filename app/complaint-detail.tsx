import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Complaint, ComplaintUpdate } from '@/types/firestore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
  PendingModeration: { label: 'Moderatör İncelemesinde', color: '#f39c12', icon: '⏳' },
  Approved: { label: 'Onaylandı', color: '#2ecc71', icon: '✅' },
  Rejected: { label: 'Reddedildi', color: '#e74c3c', icon: '❌' },
  InProgress: { label: 'İşlemde', color: '#3498db', icon: '🔄' },
  Resolved: { label: 'Çözüldü', color: '#27ae60', icon: '✔️' },
  Closed: { label: 'Kapatıldı', color: '#95a5a6', icon: '🔒' },
};

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [updates, setUpdates] = useState<ComplaintUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchComplaint = async () => {
      try {
        const docRef = doc(db, 'Complaints', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setComplaint({ id: docSnap.id, ...docSnap.data() } as Complaint);
        }
      } catch (error) {
        console.error('Error fetching complaint:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();

    // Listen for updates
    const q = query(
      collection(db, 'ComplaintUpdates'),
      where('complaintId', '==', id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ComplaintUpdate));
      setUpdates(data);
    });

    return () => unsubscribe();
  }, [id]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const statusInfo = STATUS_MAP[complaint.status] || { label: complaint.status, color: '#999', icon: '❓' };

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
          <Text style={styles.metaItem}>📅 {formatDate(complaint.createdAt)}</Text>
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

        {/* Updates Timeline */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Süreç Geçmişi</ThemedText>
          {updates.length === 0 ? (
            <ThemedText style={styles.emptyText}>Henüz güncelleme yok.</ThemedText>
          ) : (
            <View style={styles.timeline}>
              {updates.map((update, index) => {
                const updateStatus = STATUS_MAP[update.newStatus];
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
                      <Text style={styles.timelineDate}>{formatDate(update.createdAt)}</Text>
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
});
