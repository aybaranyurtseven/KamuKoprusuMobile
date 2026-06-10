import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useNotifications } from '@/hooks/useNotifications';
import { getStatusInfo } from '@/constants/complaintStatus';
import { formatDateTime } from '@/utils/date';
import { AppNotification } from '@/types/firestore';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function NotificationsScreen() {
  const router = useRouter();
  const theme = Colors[useColorScheme() ?? 'light'];
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();

  const openNotification = (item: AppNotification) => {
    if (!item.read) markRead(item.id);
    router.push({ pathname: '/complaint-detail', params: { id: item.complaintId } });
  };

  const renderItem = ({ item }: { item: AppNotification }) => {
    const isMessage = item.type === 'message';
    const status = getStatusInfo(item.newStatus ?? '');
    const iconBg = isMessage ? theme.primary : status.color;
    const icon = isMessage ? '💬' : status.icon;
    const label = isMessage ? 'Yeni mesaj' : status.label;
    const labelColor = isMessage ? theme.primary : status.color;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: theme.cardSolid, borderColor: theme.border, borderWidth: 1 },
          !item.read && { backgroundColor: theme.chipBg, borderColor: theme.primary },
        ]}
        onPress={() => openNotification(item)}
        activeOpacity={0.85}
      >
        <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{item.complaintTitle}</Text>
          <Text style={[styles.message, { color: theme.textSecondary }]} numberOfLines={2}>
            <Text style={{ color: labelColor, fontWeight: '700' }}>{label}</Text>
            {item.message ? ` · ${item.message}` : ''}
          </Text>
          <Text style={[styles.date, { color: theme.placeholder }]}>{formatDateTime(item.createdAt)}</Text>
        </View>
        {!item.read && <View style={[styles.dot, { backgroundColor: theme.primary }]} />}
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
    <ThemedView style={styles.flex}>
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAll} onPress={markAllRead} activeOpacity={0.7}>
          <Text style={styles.markAllText}>Tümünü okundu işaretle ({unreadCount})</Text>
        </TouchableOpacity>
      )}
      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <ThemedText style={styles.emptyTitle}>Henüz bildirimin yok</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Şikayetlerinin durumu değiştikçe burada göreceksin.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  markAll: { alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 10 },
  markAllText: { color: '#0a7ea4', fontWeight: '600', fontSize: 13 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  cardUnread: { backgroundColor: '#eaf6fb', borderWidth: 1, borderColor: '#cce8f4' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 18 },
  title: { fontSize: 15, fontWeight: '700', color: '#222' },
  message: { fontSize: 13, color: '#555', marginTop: 2 },
  date: { fontSize: 11, color: '#999', marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0a7ea4' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', opacity: 0.6 },
});
