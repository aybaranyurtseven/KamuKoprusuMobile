import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SearchBar } from '@/components/ui/SearchBar';
import { ComplaintFilters, STATUS_FILTERS } from '@/hooks/useComplaintFilters';
import { COMPLAINT_CATEGORIES } from '@/constants/categories';

interface ComplaintFilterBarProps {
  filters: ComplaintFilters;
  searchPlaceholder?: string;
}

interface Chip {
  key: string;
  label: string;
  active: boolean;
  onPress: () => void;
}

const ChipRow: React.FC<{ chips: Chip[] }> = ({ chips }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.chipRow}
  >
    {chips.map((chip) => (
      <TouchableOpacity
        key={chip.key}
        onPress={chip.onPress}
        style={[styles.chip, chip.active && styles.chipActive]}
        activeOpacity={0.8}
      >
        <Text style={[styles.chipText, chip.active && styles.chipTextActive]}>{chip.label}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

/**
 * Şikayet listeleri için ortak filtre çubuğu: arama + durum çipleri + kategori çipleri.
 * Durumu useComplaintFilters hook'undan alır; Şikayetlerim ve yetkili panel paylaşır.
 */
export const ComplaintFilterBar: React.FC<ComplaintFilterBarProps> = ({ filters, searchPlaceholder }) => {
  const statusChips: Chip[] = STATUS_FILTERS.map((f) => ({
    key: f.key,
    label: f.label,
    active: filters.status === f.key,
    onPress: () => filters.setStatus(f.key),
  }));

  const categoryChips: Chip[] = [
    {
      key: 'all',
      label: 'Tüm Kategoriler',
      active: filters.category === '',
      onPress: () => filters.setCategory(''),
    },
    ...COMPLAINT_CATEGORIES.map((c) => ({
      key: c.value,
      label: c.label,
      active: filters.category === c.value,
      onPress: () => filters.setCategory(filters.category === c.value ? '' : c.value),
    })),
  ];

  return (
    <View style={styles.container}>
      <SearchBar
        value={filters.search}
        onChangeText={filters.setSearch}
        placeholder={searchPlaceholder ?? 'Başlık, açıklama veya kurum ara...'}
      />
      <ChipRow chips={statusChips} />
      <ChipRow chips={categoryChips} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 14, gap: 10 },
  chipRow: { gap: 8, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#eef0f2',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipActive: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  chipText: { fontSize: 13, color: '#555', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
});
