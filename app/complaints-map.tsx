import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useStaffComplaints } from '@/hooks/useStaffComplaints';
import { getStatusInfo } from '@/constants/complaintStatus';
import { buildMapHtml, MapMarker } from '@/utils/mapHtml';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ComplaintsMapScreen() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const { complaints, loading, noInstitution } = useStaffComplaints();

  const markers: MapMarker[] = useMemo(
    () =>
      complaints
        .filter((c) => c.location)
        .map((c) => {
          const info = getStatusInfo(c.status);
          return {
            lat: c.location!.latitude,
            lng: c.location!.longitude,
            title: c.title,
            status: info.label,
            color: info.color,
          };
        }),
    [complaints]
  );

  const html = useMemo(() => buildMapHtml(markers), [markers]);

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

  return (
    <View style={styles.flex}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.flex}
        startInLoadingState
        renderLoading={() => (
          <View style={[styles.centered, styles.loadingOverlay]}>
            <ActivityIndicator size="large" color="#0a7ea4" />
          </View>
        )}
      />
      <View style={[styles.badge, { backgroundColor: theme.cardSolid, borderColor: theme.border }]}>
        <Text style={[styles.badgeText, { color: theme.text }]}>
          📍 {markers.length} konumlu şikayet
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  emptyIcon: { fontSize: 52, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', opacity: 0.7, textAlign: 'center' },
  badge: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  badgeText: { fontSize: 13, fontWeight: '700' },
});
