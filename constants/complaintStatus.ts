import { Complaint } from '@/types/firestore';

// Şikayet durumlarının görsel karşılıkları — uygulamanın TEK doğruluk kaynağı.
// Daha önce bu sözlük dört ayrı ekranda kopyalanıyordu; artık tek yerden gelir.
export interface StatusInfo {
  label: string;
  color: string;
  icon: string;
}

export const COMPLAINT_STATUS: Record<Complaint['status'], StatusInfo> = {
  PendingModeration: { label: 'Moderatör İncelemesinde', color: '#f39c12', icon: '⏳' },
  Approved: { label: 'Onaylandı', color: '#2ecc71', icon: '✅' },
  Rejected: { label: 'Reddedildi', color: '#e74c3c', icon: '❌' },
  InProgress: { label: 'İşlemde', color: '#3498db', icon: '🔄' },
  Resolved: { label: 'Çözüldü', color: '#27ae60', icon: '✔️' },
  Closed: { label: 'Kapatıldı', color: '#95a5a6', icon: '🔒' },
};

// Bilinmeyen bir durum gelirse güvenli varsayılan döndürür.
export const getStatusInfo = (status: string): StatusInfo =>
  COMPLAINT_STATUS[status as Complaint['status']] ?? { label: status, color: '#999', icon: '❓' };
