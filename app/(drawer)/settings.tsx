import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme, ThemePreference } from '@/context/ThemeContext';
import { useTranslation } from '@/context/LanguageContext';
import { Language } from '@/i18n/translations';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

const ROLE_LABELS: Record<string, string> = {
  Citizen: 'Vatandaş',
  InstitutionRep: 'Kurum Temsilcisi',
  Moderator: 'Moderatör',
  Admin: 'Yönetici',
  NGOCoordinator: 'STÖ Koordinatörü',
};

const THEME_KEYS: ThemePreference[] = ['light', 'dark', 'system'];
const LANG_OPTIONS: { key: Language; label: string }[] = [
  { key: 'tr', label: 'Türkçe' },
  { key: 'en', label: 'English' },
];

export default function SettingsScreen() {
  const { user, userData, logout } = useAuth();
  const { preference, setPreference } = useAppTheme();
  const { t, language, setLanguage } = useTranslation();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const rows: { label: string; value: string }[] = [
    { label: t('settings.name'), value: userData?.name || '—' },
    { label: t('settings.email'), value: userData?.email || user?.email || '—' },
    { label: t('settings.role'), value: ROLE_LABELS[userData?.role] || userData?.role || '—' },
    { label: t('settings.version'), value: version },
  ];

  const renderSegment = (active: boolean, label: string, onPress: () => void, key: string) => (
    <TouchableOpacity
      key={key}
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.segment,
        { borderColor: active ? theme.primary : theme.cardBorder },
        active && { backgroundColor: theme.primary },
      ]}
    >
      <Text style={[styles.segmentText, { color: active ? '#fff' : theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText style={styles.sectionTitle}>{t('settings.account')}</ThemedText>
        <View style={styles.card}>
          {rows.map((row, i) => (
            <View key={row.label} style={[styles.row, i < rows.length - 1 && styles.rowBorder]}>
              <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>{row.label}</Text>
              <Text style={[styles.rowValue, { color: theme.text }]} numberOfLines={1}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Dil / Language */}
        <ThemedText style={styles.sectionTitle}>{t('settings.language')}</ThemedText>
        <View style={styles.segmentRow}>
          {LANG_OPTIONS.map((opt) =>
            renderSegment(language === opt.key, opt.label, () => setLanguage(opt.key), opt.key)
          )}
        </View>
        <ThemedText style={styles.hint}>{t('settings.languageHint')}</ThemedText>

        {/* Görünüm / Tema */}
        <ThemedText style={styles.sectionTitle}>{t('settings.appearance')}</ThemedText>
        <View style={styles.segmentRow}>
          {THEME_KEYS.map((key) =>
            renderSegment(preference === key, t(`settings.theme.${key}`), () => setPreference(key), key)
          )}
        </View>
        <ThemedText style={styles.hint}>{t('settings.themeHint')}</ThemedText>

        <ThemedText style={styles.note}>{t('settings.notice')}</ThemedText>

        <AnimatedButton
          title={t('common.logout')}
          variant="danger"
          onPress={logout}
          style={styles.logout}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  card: {
    backgroundColor: 'rgba(127,127,127,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(127,127,127,0.25)' },
  rowLabel: { fontSize: 14, marginRight: 12 },
  rowValue: { fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  segmentRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  segment: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  segmentText: { fontSize: 13, fontWeight: '600' },
  hint: { fontSize: 12, opacity: 0.55, marginBottom: 24 },
  note: { fontSize: 13, lineHeight: 20, opacity: 0.6, marginBottom: 28 },
  logout: { marginTop: 4 },
});
