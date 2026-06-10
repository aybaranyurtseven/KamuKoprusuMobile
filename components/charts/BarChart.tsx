import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface BarItem {
  label: string;
  value: number;
  color: string;
}

/**
 * Bağımlılıksız, yatay bar grafiği. Her satır: etiket + orana göre dolan bar + değer.
 * Barların genişliği listedeki en büyük değere göre ölçeklenir.
 */
export const BarChart: React.FC<{ data: BarItem[] }> = ({ data }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const max = Math.max(1, ...data.map((d) => d.value));

  if (data.length === 0) {
    return <Text style={[styles.empty, { color: theme.textSecondary }]}>Veri yok</Text>;
  }

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.label} style={styles.row}>
          <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.label}
          </Text>
          <View style={[styles.track, { backgroundColor: theme.cardBorder }]}>
            <View
              style={[
                styles.fill,
                { width: `${(item.value / max) * 100}%`, backgroundColor: item.color },
              ]}
            />
          </View>
          <Text style={[styles.value, { color: theme.text }]}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { width: 88, fontSize: 13 },
  track: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  fill: { height: '100%', borderRadius: 7, minWidth: 2 },
  value: { width: 28, fontSize: 13, fontWeight: '700', textAlign: 'right' },
  empty: { textAlign: 'center', paddingVertical: 16, fontSize: 14 },
});
