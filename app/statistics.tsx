import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BarChart, BarItem } from '@/components/charts/BarChart';
import { StarRating } from '@/components/ui/StarRating';
import { useStaffComplaints } from '@/hooks/useStaffComplaints';
import { useComplaintStats } from '@/hooks/useComplaintStats';
import { COMPLAINT_STATUS, getStatusInfo } from '@/constants/complaintStatus';
import { COMPLAINT_CATEGORIES } from '@/constants/categories';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function StatisticsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { complaints, loading, noInstitution } = useStaffComplaints();
  const stats = useComplaintStats(complaints);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  if (noInstitution) {
    return (
      <ThemedView style={styles.centered}>
        <Text style={styles.emptyIcon}>🏢</Text>
        <ThemedText style={styles.emptyTitle}>Hesabınıza bir kurum atanmamış</ThemedText>
      </ThemedView>
    );
  }

  // Duruma göre: yalnızca sayısı > 0 olan durumlar
  const statusData: BarItem[] = (Object.keys(COMPLAINT_STATUS) as (keyof typeof COMPLAINT_STATUS)[])
    .map((s) => ({
      label: getStatusInfo(s).label,
      value: stats.statusCounts[s] ?? 0,
      color: getStatusInfo(s).color,
    }))
    .filter((d) => d.value > 0);

  // Kategoriye göre: sayısı > 0, çoktan aza sıralı
  const categoryData: BarItem[] = COMPLAINT_CATEGORIES
    .map((c) => ({ label: c.label, value: stats.categoryCounts[c.value] ?? 0, color: theme.primary }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const maxDay = Math.max(1, ...stats.last7Days.map((d) => d.count));

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Özet kartlar */}
        <View style={styles.cardsRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#e8f4f8' }]}>
            <Text style={[styles.summaryNumber, { color: '#0a7ea4' }]}>{stats.total}</Text>
            <Text style={styles.summaryLabel}>Toplam</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#eafaf1' }]}>
            <Text style={[styles.summaryNumber, { color: '#27ae60' }]}>{stats.resolved}</Text>
            <Text style={styles.summaryLabel}>Çözülen</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#fef5e7' }]}>
            <Text style={[styles.summaryNumber, { color: '#f39c12' }]}>%{stats.resolutionRate}</Text>
            <Text style={styles.summaryLabel}>Çözüm Oranı</Text>
          </View>
        </View>

        {/* Çözüm oranı çubuğu */}
        <View style={[styles.section, { borderColor: theme.cardBorder }]}>
          <ThemedText style={styles.sectionTitle}>Çözüm Oranı</ThemedText>
          <View style={[styles.rateTrack, { backgroundColor: theme.cardBorder }]}>
            <View style={[styles.rateFill, { width: `${stats.resolutionRate}%` }]} />
          </View>
          <ThemedText style={styles.rateText}>
            {stats.resolved} / {stats.total} şikayet çözüldü
          </ThemedText>
        </View>

        {/* Memnuniyet */}
        <View style={[styles.section, { borderColor: theme.cardBorder }]}>
          <ThemedText style={styles.sectionTitle}>Memnuniyet</ThemedText>
          {stats.ratedCount > 0 ? (
            <View style={styles.ratingRow}>
              <StarRating value={stats.avgRating} size={26} />
              <Text style={[styles.ratingValue, { color: theme.text }]}>{stats.avgRating.toFixed(1)}</Text>
              <Text style={[styles.ratingCount, { color: theme.textSecondary }]}>
                ({stats.ratedCount} değerlendirme)
              </Text>
            </View>
          ) : (
            <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Henüz değerlendirme yok.</Text>
          )}
        </View>

        {/* Duruma göre */}
        <View style={[styles.section, { borderColor: theme.cardBorder }]}>
          <ThemedText style={styles.sectionTitle}>Duruma Göre Dağılım</ThemedText>
          <BarChart data={statusData} />
        </View>

        {/* Kategoriye göre */}
        <View style={[styles.section, { borderColor: theme.cardBorder }]}>
          <ThemedText style={styles.sectionTitle}>Kategoriye Göre Dağılım</ThemedText>
          <BarChart data={categoryData} />
        </View>

        {/* Son 7 gün */}
        <View style={[styles.section, { borderColor: theme.cardBorder }]}>
          <ThemedText style={styles.sectionTitle}>Son 7 Gün</ThemedText>
          <View style={styles.columnsRow}>
            {stats.last7Days.map((day, i) => (
              <View key={i} style={styles.column}>
                <Text style={[styles.columnValue, { color: theme.textSecondary }]}>{day.count}</Text>
                <View style={styles.columnTrack}>
                  <View
                    style={[
                      styles.columnFill,
                      { height: `${(day.count / maxDay) * 100}%`, backgroundColor: theme.primary },
                    ]}
                  />
                </View>
                <Text style={[styles.columnLabel, { color: theme.textSecondary }]}>{day.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyIcon: { fontSize: 52, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', opacity: 0.7, textAlign: 'center' },
  cardsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: { flex: 1, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  summaryNumber: { fontSize: 24, fontWeight: 'bold' },
  summaryLabel: { fontSize: 12, color: '#555', marginTop: 4, fontWeight: '500' },
  section: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 14 },
  rateTrack: { height: 16, borderRadius: 8, overflow: 'hidden' },
  rateFill: { height: '100%', borderRadius: 8, backgroundColor: '#27ae60', minWidth: 2 },
  rateText: { fontSize: 13, opacity: 0.7, marginTop: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ratingValue: { fontSize: 20, fontWeight: 'bold' },
  ratingCount: { fontSize: 13 },
  columnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },
  column: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  columnValue: { fontSize: 11, marginBottom: 4 },
  columnTrack: { width: 18, height: 90, justifyContent: 'flex-end' },
  columnFill: { width: '100%', borderRadius: 4, minHeight: 2 },
  columnLabel: { fontSize: 11, marginTop: 6 },
});
