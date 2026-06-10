import { useMemo } from 'react';
import { Complaint } from '@/types/firestore';

const toDate = (ts: any): Date | null => {
  if (!ts) return null;
  return ts?.toDate ? ts.toDate() : new Date(ts);
};

const DAY_LABELS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export interface DayBucket {
  label: string;
  count: number;
}

/**
 * Bir şikayet listesinden analitik özet hesaplar (yetkili paneli için).
 * Saf bir useMemo; liste değişmedikçe yeniden hesaplanmaz.
 */
export function useComplaintStats(complaints: Complaint[]) {
  return useMemo(() => {
    const total = complaints.length;

    const statusCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    complaints.forEach((c) => {
      statusCounts[c.status] = (statusCounts[c.status] ?? 0) + 1;
      categoryCounts[c.category] = (categoryCounts[c.category] ?? 0) + 1;
    });

    const resolved = complaints.filter(
      (c) => c.status === 'Resolved' || c.status === 'Closed'
    ).length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Memnuniyet: puanlanmış şikayetlerin ortalaması
    const rated = complaints.filter((c) => typeof c.rating === 'number' && c.rating > 0);
    const avgRating = rated.length
      ? Math.round((rated.reduce((s, c) => s + (c.rating ?? 0), 0) / rated.length) * 10) / 10
      : 0;

    // Son 7 gün: her gün için o güne ait şikayet sayısı
    const now = new Date();
    const last7Days: DayBucket[] = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - i);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      const count = complaints.filter((c) => {
        const t = toDate(c.createdAt);
        return t !== null && t >= start && t < end;
      }).length;

      last7Days.push({ label: DAY_LABELS[start.getDay()], count });
    }

    return {
      total, resolved, resolutionRate, statusCounts, categoryCounts, last7Days,
      avgRating, ratedCount: rated.length,
    };
  }, [complaints]);
}
