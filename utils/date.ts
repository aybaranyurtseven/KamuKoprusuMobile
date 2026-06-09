// Firestore Timestamp veya Date/sayı değerini Türkçe biçimde metne çevirir.
// Daha önce neredeyse her ekranda kopyalanan formatDate yardımcısı tek yerde toplandı.
export const formatDate = (timestamp: any, style: 'long' | 'short' = 'long'): string => {
  if (!timestamp) return '';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  if (style === 'short') {
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Tarih + saat (şikayet detayındaki süreç geçmişi için).
export const formatDateTime = (timestamp: any): string => {
  if (!timestamp) return '';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
