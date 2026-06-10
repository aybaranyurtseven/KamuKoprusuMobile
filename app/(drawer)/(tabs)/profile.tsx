import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { LEVEL_THRESHOLDS } from '@/types/firestore';
import { BADGE_DEFINITIONS } from '@/constants/badges';
import { useUserData } from '@/hooks/useUserData';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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

export default function ProfileScreen() {
  const { logout } = useAuth();
  const { userData, loading } = useUserData();
  const theme = Colors[useColorScheme() ?? 'light'];
  const router = useRouter();

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  if (!userData) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Profil bilgileri yüklenemedi.</ThemedText>
      </ThemedView>
    );
  }

  const currentLevel = userData.level || 'Bronze';
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
  const xpProgress = currentThreshold.max === Infinity
    ? 1
    : (userData.xp - currentThreshold.min) / (currentThreshold.max - currentThreshold.min);

  const earnedBadges = userData.badges || [];

  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {/* Avatar & Name */}
        <View style={styles.header}>
          {userData.avatar ? (
            <Image
              source={{ uri: userData.avatar }}
              style={[styles.avatarCircle, { borderColor: LEVEL_COLORS[currentLevel] }]}
            />
          ) : (
            <View style={[styles.avatarCircle, { borderColor: LEVEL_COLORS[currentLevel] }]}>
              <Text style={styles.avatarText}>
                {userData.name?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <ThemedText style={styles.name} type="title">{userData.name}</ThemedText>
          <ThemedText style={styles.email}>{userData.email}</ThemedText>
          <View style={[styles.roleBadge, { backgroundColor: '#0a7ea4' }]}>
            <Text style={styles.roleText}>
              {userData.role === 'Citizen' ? 'Vatandaş' :
               userData.role === 'InstitutionRep' ? 'Kurum Temsilcisi' :
               userData.role === 'Moderator' ? 'Moderatör' :
               userData.role === 'Admin' ? 'Yönetici' :
               userData.role === 'NGOCoordinator' ? 'STÖ Koordinatörü' : userData.role}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/edit-profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.editButtonText}>✎  Profili Düzenle</Text>
          </TouchableOpacity>
        </View>

        {/* Level & XP Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Seviye & Deneyim Puanı</ThemedText>
          <View style={styles.levelRow}>
            <Text style={styles.levelEmoji}>{LEVEL_EMOJIS[currentLevel]}</Text>
            <View style={{ flex: 1 }}>
              <View style={styles.levelLabelRow}>
                <ThemedText style={[styles.levelName, { color: LEVEL_COLORS[currentLevel] }]}>
                  {currentLevel}
                </ThemedText>
                <ThemedText style={styles.xpText}>{userData.xp} XP</ThemedText>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, {
                  width: `${Math.min(xpProgress * 100, 100)}%`,
                  backgroundColor: LEVEL_COLORS[currentLevel],
                }]} />
              </View>
              {currentThreshold.max !== Infinity && (
                <ThemedText style={styles.xpRange}>
                  {currentThreshold.min} / {currentThreshold.max} XP
                </ThemedText>
              )}
            </View>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Rozetler ({earnedBadges.length}/{BADGE_DEFINITIONS.length})
          </ThemedText>
          {BADGE_DEFINITIONS.length === 0 ? (
            <ThemedText style={styles.emptyText}>Henüz rozet tanımlanmamış.</ThemedText>
          ) : (
            <View style={styles.badgeGrid}>
              {BADGE_DEFINITIONS.map((badge) => {
                const isEarned = earnedBadges.includes(badge.id);
                return (
                  <View
                    key={badge.id}
                    style={[
                      styles.badgeCard,
                      { backgroundColor: theme.chipBg, borderColor: theme.border },
                      !isEarned && styles.badgeCardLocked,
                    ]}
                  >
                    <Text style={styles.badgeIcon}>{badge.icon || '🏅'}</Text>
                    <Text style={[styles.badgeName, { color: theme.text }, !isEarned && styles.lockedText]}>
                      {badge.name}
                    </Text>
                    <Text style={[styles.badgeDesc, { color: theme.textSecondary }, !isEarned && styles.lockedText]} numberOfLines={2}>
                      {badge.description}
                    </Text>
                    {isEarned && (
                      <View style={styles.earnedTag}>
                        <Text style={styles.earnedTagText}>✓ Kazanıldı</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Logout */}
        <AnimatedButton 
          title="Çıkış Yap" 
          variant="danger"
          onPress={logout} 
          style={styles.logoutButton}
        />
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e0f0f7',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  name: {
    marginBottom: 4,
  },
  email: {
    opacity: 0.6,
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  editButton: {
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
  },
  editButtonText: {
    color: '#0a7ea4',
    fontWeight: '700',
    fontSize: 13,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelEmoji: {
    fontSize: 40,
  },
  levelLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  xpText: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  xpRange: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
    textAlign: 'right',
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: '#f0f9fc',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0eaf3',
  },
  badgeCardLocked: {
    opacity: 0.45,
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDesc: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.7,
  },
  lockedText: {
    color: '#999',
  },
  earnedTag: {
    marginTop: 8,
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  earnedTagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyText: {
    opacity: 0.5,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 8,
  },
});
