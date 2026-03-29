import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getUserData, getBadges } from '@/services/firestoreService';
import { UserData, Badge, LEVEL_THRESHOLDS } from '@/types/firestore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

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
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
          const badges = await getBadges();
          setAllBadges(badges);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

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
          <View style={[styles.avatarCircle, { borderColor: LEVEL_COLORS[currentLevel] }]}>
            <Text style={styles.avatarText}>
              {userData.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
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
          <ThemedText style={styles.sectionTitle}>Rozetler</ThemedText>
          {allBadges.length === 0 ? (
            <ThemedText style={styles.emptyText}>Henüz rozet tanımlanmamış.</ThemedText>
          ) : (
            <View style={styles.badgeGrid}>
              {allBadges.map((badge) => {
                const isEarned = earnedBadges.includes(badge.id);
                return (
                  <View key={badge.id} style={[styles.badgeCard, !isEarned && styles.badgeCardLocked]}>
                    <Text style={styles.badgeIcon}>{badge.icon || '🏅'}</Text>
                    <Text style={[styles.badgeName, !isEarned && styles.lockedText]}>
                      {badge.name}
                    </Text>
                    <Text style={[styles.badgeDesc, !isEarned && styles.lockedText]} numberOfLines={2}>
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
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
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
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
