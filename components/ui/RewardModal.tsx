import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
} from 'react-native-reanimated';
import { BadgeDefinition } from '@/constants/badges';
import { UserData } from '@/types/firestore';

interface RewardModalProps {
  visible: boolean;
  xpGained: number;
  leveledUp?: boolean;
  newLevel?: UserData['level'];
  newBadges?: BadgeDefinition[];
  onClose: () => void;
}

const LEVEL_EMOJIS: Record<string, string> = {
  Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎', Diamond: '👑',
};

export const RewardModal: React.FC<RewardModalProps> = ({
  visible, xpGained, leveledUp, newLevel, newBadges = [], onClose,
}) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 12 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = 0.8;
      opacity.value = 0;
    }
  }, [visible, scale, opacity]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Text style={styles.celebrate}>🎉</Text>
          <Text style={styles.title}>Tebrikler!</Text>
          <Text style={styles.subtitle}>Şikayetin başarıyla gönderildi.</Text>

          {/* XP rozeti */}
          <View style={styles.xpPill}>
            <Text style={styles.xpPillText}>+{xpGained} XP</Text>
          </View>

          {/* Seviye atlama */}
          {leveledUp && newLevel && (
            <View style={styles.levelUpBox}>
              <Text style={styles.levelUpText}>
                {LEVEL_EMOJIS[newLevel] || '⭐'} Seviye atladın: {newLevel}!
              </Text>
            </View>
          )}

          {/* Yeni rozetler */}
          {newBadges.length > 0 && (
            <View style={styles.badgesSection}>
              <Text style={styles.badgesHeader}>Yeni Rozet{newBadges.length > 1 ? 'ler' : ''}</Text>
              {newBadges.map((b) => (
                <View key={b.id} style={styles.badgeRow}>
                  <Text style={styles.badgeIcon}>{b.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.badgeName}>{b.name}</Text>
                    <Text style={styles.badgeDesc}>{b.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Harika!</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  celebrate: { fontSize: 52, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4, textAlign: 'center' },
  xpPill: {
    marginTop: 18,
    backgroundColor: '#3b82f6',
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  xpPillText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  levelUpBox: {
    marginTop: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  levelUpText: { color: '#b45309', fontWeight: '700', fontSize: 15 },
  badgesSection: {
    marginTop: 18,
    width: '100%',
    gap: 10,
  },
  badgesHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 12,
  },
  badgeIcon: { fontSize: 32 },
  badgeName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  badgeDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  button: {
    marginTop: 24,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
