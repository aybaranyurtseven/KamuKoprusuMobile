import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getUserComplaints } from '@/services/firestoreService';
import { Complaint } from '@/types/firestore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PendingModeration: { label: 'Moderatör İncelemesinde', color: '#f39c12' },
  Approved: { label: 'Onaylandı', color: '#2ecc71' },
  Rejected: { label: 'Reddedildi', color: '#e74c3c' },
  InProgress: { label: 'İşlemde', color: '#3498db' },
  Resolved: { label: 'Çözüldü', color: '#27ae60' },
  Closed: { label: 'Kapatıldı', color: '#95a5a6' },
};

export default function MyComplaintsScreen() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getUserComplaints(user.uid, (data) => {
      setComplaints(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderComplaint = ({ item }: { item: Complaint }) => {
    const statusInfo = STATUS_MAP[item.status] || { label: item.status, color: '#999' };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push({ pathname: '/complaint-detail', params: { id: item.id } })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.category}>{item.category}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Text style={styles.statusText}>{statusInfo.label}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.institutionName}>📍 {item.institutionName}</Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>

        {item.mediaUrls && item.mediaUrls.length > 0 && (
          <Text style={styles.mediaCount}>📎 {item.mediaUrls.length} medya dosyası</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.pageTitle} type="title">Şikayetlerim</ThemedText>

      {complaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <ThemedText style={styles.emptyTitle}>Henüz şikayetiniz yok</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            İlk şikayetinizi oluşturmak için "Yeni Şikayet" sekmesine gidin.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id}
          renderItem={renderComplaint}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    marginBottom: 20,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  category: {
    fontSize: 12,
    color: '#0a7ea4',
    fontWeight: '600',
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  institutionName: {
    fontSize: 12,
    color: '#888',
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#aaa',
  },
  mediaCount: {
    fontSize: 12,
    color: '#0a7ea4',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
    paddingHorizontal: 40,
  },
});
