import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Complaint, LEVEL_THRESHOLDS } from '@/types/firestore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/ui/GlassCard';
import { useUserComplaints } from '@/hooks/useUserComplaints';
import { useNotifications } from '@/hooks/useNotifications';
import { getStatusInfo } from '@/constants/complaintStatus';
import { formatDate } from '@/utils/date';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/context/LanguageContext';
import StaffDashboard from '@/components/StaffDashboard';

const STAFF_ROLES = ['InstitutionRep', 'Moderator', 'Admin', 'NGOCoordinator'];

// Role göre doğru paneli gösterir: Vatandaş -> ana sayfa, personel -> yönetim paneli.
export default function HomeScreen() {
  const { userData } = useAuth();
  if (userData?.role && STAFF_ROLES.includes(userData.role)) {
    return <StaffDashboard />;
  }
  return <CitizenHome />;
}

const LEVEL_COLORS: Record<string, string> = {
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Platinum: '#E5E4E2',
  Diamond: '#B9F2FF',
};

const LEVEL_EMOJIS: Record<string, string> = {
  Bronze: '🥉',
  Silver: '🥈',
  Gold: '🥇',
  Platinum: '💎',
  Diamond: '👑',
};

const ACTIVE_STATUSES = ['PendingModeration', 'Approved', 'InProgress'];
const DONE_STATUSES = ['Resolved', 'Closed'];

function CitizenHome() {
  const { user, userData } = useAuth();
  const { complaints, loading } = useUserComplaints();
  const { unreadCount } = useNotifications();
  const theme = Colors[useColorScheme() ?? 'light'];
  const { t } = useTranslation();
  const router = useRouter();

  const total = complaints.length;
  const activeCount = complaints.filter((c) => ACTIVE_STATUSES.includes(c.status)).length;
  const doneCount = complaints.filter((c) => DONE_STATUSES.includes(c.status)).length;
  const recent = complaints.slice(0, 3);

  const firstName = (userData?.name || user?.email?.split('@')[0] || 'Kullanıcı').split(' ')[0];
  const level = userData?.level || 'Bronze';
  const xp = userData?.xp ?? 0;
  const threshold = LEVEL_THRESHOLDS[level as keyof typeof LEVEL_THRESHOLDS];
  const xpProgress =
    threshold.max === Infinity ? 1 : (xp - threshold.min) / (threshold.max - threshold.min);

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Karşılama */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.greeting}>{t('home.greeting', { name: firstName })}</ThemedText>
            <ThemedText style={styles.subGreeting}>{t('home.welcome')}</ThemedText>
          </View>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.7}
          >
            <Text style={styles.bellIcon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={[styles.levelChip, { borderColor: LEVEL_COLORS[level] }]}>
            <Text style={styles.levelEmoji}>{LEVEL_EMOJIS[level]}</Text>
            <Text style={[styles.levelText, { color: LEVEL_COLORS[level] }]}>{level}</Text>
          </View>
        </View>

        {/* Seviye / XP özeti */}
        <GlassCard intensity={70} style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <ThemedText style={styles.xpTitle}>{t('home.xp')}</ThemedText>
            <ThemedText style={styles.xpValue}>{xp} XP</ThemedText>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(xpProgress * 100, 100)}%`, backgroundColor: LEVEL_COLORS[level] },
              ]}
            />
          </View>
          {threshold.max !== Infinity && (
            <ThemedText style={styles.xpRange}>
              {t('home.nextLevel', { xp: Math.max(threshold.max + 1 - xp, 0) })}
            </ThemedText>
          )}
        </GlassCard>

        {/* İstatistikler */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#e8f4f8' }]}>
            <Text style={[styles.statNumber, { color: '#0a7ea4' }]}>{total}</Text>
            <Text style={styles.statLabel}>{t('home.total')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fef5e7' }]}>
            <Text style={[styles.statNumber, { color: '#f39c12' }]}>{activeCount}</Text>
            <Text style={styles.statLabel}>{t('home.active')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#eafaf1' }]}>
            <Text style={[styles.statNumber, { color: '#27ae60' }]}>{doneCount}</Text>
            <Text style={styles.statLabel}>{t('home.resolved')}</Text>
          </View>
        </View>

        {/* Hızlı işlem */}
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => router.push('/create-complaint')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryActionIcon}>＋</Text>
          <Text style={styles.primaryActionText}>{t('home.newComplaint')}</Text>
        </TouchableOpacity>

        {/* Son şikayetler */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{t('home.recent')}</ThemedText>
          {total > 0 && (
            <TouchableOpacity onPress={() => router.push('/my-complaints')}>
              <Text style={styles.seeAll}>{t('home.seeAll')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" style={{ marginTop: 24 }} />
        ) : recent.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <ThemedText style={styles.emptyTitle}>{t('home.emptyTitle')}</ThemedText>
            <ThemedText style={styles.emptySubtitle}>{t('home.emptySubtitle')}</ThemedText>
          </View>
        ) : (
          recent.map((item: Complaint) => {
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
                  <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={[styles.institutionName, { color: theme.textSecondary }]} numberOfLines={1}>📍 {item.institutionName}</Text>
                    <Text style={[styles.date, { color: theme.placeholder }]}>{formatDate(item.createdAt, 'short')}</Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  subGreeting: { fontSize: 14, opacity: 0.6, marginTop: 2 },
  levelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  levelEmoji: { fontSize: 16 },
  levelText: { fontWeight: '700', fontSize: 13 },
  bellButton: { padding: 6, marginRight: 8 },
  bellIcon: { fontSize: 24 },
  bellBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#e74c3c',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  xpCard: { marginBottom: 20 },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  xpTitle: { fontSize: 15, fontWeight: '600' },
  xpValue: { fontSize: 15, fontWeight: '700', opacity: 0.8 },
  progressBarBg: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 5 },
  xpRange: { fontSize: 12, opacity: 0.55, marginTop: 6, textAlign: 'right' },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  statNumber: { fontSize: 26, fontWeight: 'bold' },
  statLabel: { fontSize: 13, color: '#555', marginTop: 4, fontWeight: '500' },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0a7ea4',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  primaryActionIcon: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: -2 },
  primaryActionText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  seeAll: { color: '#0a7ea4', fontWeight: '600', fontSize: 14 },
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
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  institutionName: { fontSize: 12, color: '#888', flex: 1, marginRight: 8 },
  date: { fontSize: 12, color: '#aaa' },
  emptyContainer: { alignItems: 'center', paddingTop: 30, paddingHorizontal: 20 },
  emptyIcon: { fontSize: 56, marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', opacity: 0.6 },
});
