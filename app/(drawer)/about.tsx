import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExternalLink } from '@/components/external-link';

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>🏛️</Text>
        <ThemedText style={styles.appName} type="title">Kamu Köprüsü</ThemedText>
        <ThemedText style={styles.version}>Sürüm {version}</ThemedText>

        <ThemedText style={styles.paragraph}>
          Kamu Köprüsü, vatandaşların kamu kurumlarına yönelik şikayet, öneri ve
          tebriklerini fotoğrafla kanıtlayarak iletebildiği ve başvurularının
          durumunu anlık takip edebildiği bir m-devlet uygulamasıdır.
        </ThemedText>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Öne Çıkan Özellikler</ThemedText>
          <ThemedText style={styles.bullet}>• Çok rollü yönetim (vatandaş, kurum, moderatör)</ThemedText>
          <ThemedText style={styles.bullet}>• Anlık şikayet akışı ve medya yükleme</ThemedText>
          <ThemedText style={styles.bullet}>• Süreç takibi ve push bildirimleri</ThemedText>
          <ThemedText style={styles.bullet}>• Oyunlaştırma: XP, seviye ve rozetler</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Geliştirici</ThemedText>
          <ThemedText style={styles.bullet}>Aybaran Yurtseven</ThemedText>
          <ExternalLink href="https://github.com/aybaranyurtseven/KamuKoprusuMobile">
            <ThemedText style={styles.link}>GitHub deposunu aç →</ThemedText>
          </ExternalLink>
        </View>

        <ThemedText style={styles.footer}>
          Ankara Üniversitesi — Mobil Uygulama Geliştirme
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 24, alignItems: 'center' },
  logo: { fontSize: 64, marginTop: 16, marginBottom: 8 },
  appName: { marginBottom: 4 },
  version: { opacity: 0.5, marginBottom: 24 },
  paragraph: { fontSize: 15, lineHeight: 23, textAlign: 'center', opacity: 0.85, marginBottom: 24 },
  section: { alignSelf: 'stretch', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  bullet: { fontSize: 14, lineHeight: 24, opacity: 0.85 },
  link: { fontSize: 14, color: '#3b82f6', fontWeight: '600', marginTop: 8 },
  footer: { fontSize: 12, opacity: 0.4, marginTop: 8, textAlign: 'center' },
});
