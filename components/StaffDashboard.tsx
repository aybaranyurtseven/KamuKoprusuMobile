import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStaffComplaints } from '@/hooks/useStaffComplaints';
import { getStatusInfo } from '@/constants/complaintStatus';
import { formatDate } from '@/utils/date';

type FilterKey = 'all' | 'pending' | 'progress' | 'done';

const FILTERS: { key: FilterKey; label: string; statuses: string[] }[] = [
  { key: 'all', label: 'Tümü', statuses: [] },
  { key: 'pending', label: 'Bekleyen', statuses: ['PendingModeration', 'Approved'] },
  { key: 'progress', label: 'İşlemde', statuses: ['InProgress'] },
  { key: 'done', label: 'Çözülen', statuses: ['Resolved', 'Closed'] },
];

export default function StaffDashboard() {
  const router = useRouter();
  const { complaints, loading, noInstitution, isModerator } = useStaffComplaints();
  const [filter, setFilter] = useState<FilterKey>('all');

  const counts = useMemo(() => {
    const c = { pending: 0, progress: 0, done: 0 };
    complaints.forEach((x) => {
      if (['PendingModeration', 'Approved'].includes(x.status)) c.pending++;
      else if (x.status === 'InProgress') c.progress++;
      else if (['Resolved', 'Closed'].includes(x.status)) c.done++;
    });
    return c;
  }, [complaints]);

  const filtered = useMemo(() => {
    const f = FILTERS.find((x) => x.key === filter)!;
    if (f.statuses.length === 0) return complaints;
    return complaints.filter((c) => f.statuses.includes(c.status));
  }, [complaints, filter]);

  const title = isModerator ? 'Moderatör Paneli' : 'Kurum Paneli';
  const subtitle =
    !isModerator && complaints[0]?.institutionName
      ? complaints[0].institutionName
      : 'Şikayet Yönetim Paneli';

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.pageTitle} type="title">{title}</ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>

        {/* İstatistikler */}
        {!noInstitution && (
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#fef5e7' }]}>
              <Text style={[styles.statNumber, { color: '#f39c12' }]}>{counts.pending}</Text>
              <Text style={styles.statLabel}>Bekleyen</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#eaf2fb' }]}>
              <Text style={[styles.statNumber, { color: '#3498db' }]}>{counts.progress}</Text>
              <Text style={styles.statLabel}>İşlemde</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#eafaf1' }]}>
              <Text style={[styles.statNumber, { color: '#27ae60' }]}>{counts.done}</Text>
              <Text style={styles.statLabel}>Çözülen</Text>
            </View>
          </View>
        )}

        {/* Filtre çipleri */}
        {!noInstitution && (
          <View style={styles.filterRow}>
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setFilter(f.key)}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Liste */}
        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" style={{ marginTop: 30 }} />
        ) : noInstitution ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏢</Text>
            <ThemedText style={styles.emptyTitle}>Hesabınıza henüz bir kurum atanmamış</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Şikayetleri görüntüleyebilmek için yöneticinizin hesabınıza bir kurum tanımlaması gerekir.
            </ThemedText>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🗂️</Text>
            <ThemedText style={styles.emptyTitle}>Bu filtrede şikayet yok</ThemedText>
          </View>
        ) : (
          filtered.map((item) => {
            const statusInfo = getStatusInfo(item.status);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push({ pathname: '/complaint-detail', params: { id: item.id } })}
                style={{ marginBottom: 12 }}
                activeOpacity={0.85}
              >
                <GlassCard intensity={70} style={styles.cardInner}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.category}>{item.category}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                      <Text style={styles.statusText}>{statusInfo.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.citizen} numberOfLines={1}>
                      👤 {item.isAnonymous ? 'Anonim' : item.userName || 'Vatandaş'}
                    </Text>
                    <Text style={styles.date}>{formatDate(item.createdAt, 'short')}</Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, paddingTop: 28, paddingBottom: 40 },
  pageTitle: { marginBottom: 2 },
  subtitle: { fontSize: 14, opacity: 0.6, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  statNumber: { fontSize: 26, fontWeight: 'bold' },
  statLabel: { fontSize: 13, color: '#555', marginTop: 4, fontWeight: '500' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  filterText: { fontSize: 13, color: '#555', fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  cardInner: { padding: 16, borderRadius: 14 },
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
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  cardDescription: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  citizen: { fontSize: 12, color: '#888', flex: 1, marginRight: 8 },
  date: { fontSize: 12, color: '#aaa' },
  emptyContainer: { alignItems: 'center', paddingTop: 40 },
  emptyIcon: { fontSize: 52, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', opacity: 0.7, textAlign: 'center' },
  emptySubtitle: {
    fontSize: 13,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 24,
    lineHeight: 19,
  },
});
