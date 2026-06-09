import { UserStats } from '@/types/firestore';

// Rozet tanımları — uygulamanın TEK doğruluk kaynağı.
// Hem profil ekranında gösterim hem de kazandırma motoru bunu kullanır.
// Firestore'daki Badges koleksiyonuna bağımlı değiliz; böylece rozetler
// her zaman görünür ve koşulları kod içinde versiyonlanabilir.

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  // Kullanıcının istatistiklerine göre rozetin kazanılıp kazanılmadığını döner.
  check: (stats: UserStats) => boolean;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-complaint',
    name: 'İlk Adım',
    description: 'İlk şikayetini oluşturdun.',
    icon: '🌱',
    check: (s) => s.totalComplaints >= 1,
  },
  {
    id: 'with-media',
    name: 'Kanıtla Konuş',
    description: 'Fotoğraf ekleyerek bir şikayet gönderdin.',
    icon: '📸',
    check: (s) => s.withMediaComplaints >= 1,
  },
  {
    id: 'five-complaints',
    name: 'Aktif Vatandaş',
    description: 'Toplam 5 şikayet oluşturdun.',
    icon: '📢',
    check: (s) => s.totalComplaints >= 5,
  },
  {
    id: 'first-resolved',
    name: 'Çözüm Ortağı',
    description: 'İlk şikayetin çözüme kavuştu.',
    icon: '✅',
    check: (s) => s.resolvedComplaints >= 1,
  },
  {
    id: 'ten-complaints',
    name: 'Çınar',
    description: 'Toplam 10 şikayet oluşturdun.',
    icon: '🏆',
    check: (s) => s.totalComplaints >= 10,
  },
  {
    id: 'silver-member',
    name: 'Gümüş Üye',
    description: 'Gümüş seviyeye ulaştın (100 XP).',
    icon: '🥈',
    check: (s) => s.xp >= 100,
  },
  {
    id: 'gold-member',
    name: 'Altın Üye',
    description: 'Altın seviyeye ulaştın (250 XP).',
    icon: '🥇',
    check: (s) => s.xp >= 250,
  },
];

export const getBadgeDefinition = (id: string): BadgeDefinition | undefined =>
  BADGE_DEFINITIONS.find((b) => b.id === id);
