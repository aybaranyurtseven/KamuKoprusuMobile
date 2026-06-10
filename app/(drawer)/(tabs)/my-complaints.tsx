import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Complaint } from '@/types/firestore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRouter } from 'expo-router';
import { useUserComplaints } from '@/hooks/useUserComplaints';
import { useComplaintFilters } from '@/hooks/useComplaintFilters';
import { ComplaintFilterBar } from '@/components/ComplaintFilterBar';
import { getStatusInfo } from '@/constants/complaintStatus';
import { formatDate } from '@/utils/date';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function MyComplaintsScreen() {
  const { complaints, loading } = useUserComplaints();
  const filters = useComplaintFilters(complaints);
  const theme = Colors[useColorScheme() ?? 'light'];
  const router = useRouter();

  const renderComplaint = ({ item }: { item: Complaint }) => {
    const statusInfo = getStatusInfo(item.status);

    return (
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/complaint-detail', params: { id: item.id } })}
        style={{ marginBottom: 14 }}
      >
        <GlassCard intensity={80} style={styles.cardInner}>
          <View style={styles.cardHeader}>
            <Text style={styles.category}>{item.category}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
              <Text style={styles.statusText}>{statusInfo.label}</Text>
            </View>
          </View>

          <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.cardDescription, { color: theme.textSecondary }]} numberOfLines={2}>{item.description}</Text>

          <View style={styles.cardFooter}>
            <Text style={[styles.institutionName, { color: theme.textSecondary }]}>📍 {item.institutionName}</Text>
            <Text style={[styles.date, { color: theme.placeholder }]}>{formatDate(item.createdAt)}</Text>
          </View>

          {item.mediaUrls && item.mediaUrls.length > 0 && (
            <Text style={styles.mediaCount}>📎 {item.mediaUrls.length} medya dosyası</Text>
          )}
        </GlassCard>
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
            İlk şikayetinizi oluşturmak için &quot;Yeni Şikayet&quot; sekmesine gidin.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={filters.filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderComplaint}
          ListHeaderComponent={<ComplaintFilterBar filters={filters} />}
          ListEmptyComponent={
            <View style={styles.emptyFiltered}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <ThemedText style={styles.emptyTitle}>Sonuç bulunamadı</ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                Arama veya filtreleri değiştirmeyi deneyin.
              </ThemedText>
            </View>
          }
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
  cardInner: {
    padding: 16,
    borderRadius: 14,
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
  emptyFiltered: {
    alignItems: 'center',
    paddingTop: 40,
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
