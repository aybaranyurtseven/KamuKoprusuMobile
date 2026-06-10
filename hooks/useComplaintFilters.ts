import { useMemo, useState } from 'react';
import { Complaint } from '@/types/firestore';

export type StatusFilterKey = 'all' | 'pending' | 'progress' | 'done';

export const STATUS_FILTERS: { key: StatusFilterKey; label: string; statuses: string[] }[] = [
  { key: 'all', label: 'Tümü', statuses: [] },
  { key: 'pending', label: 'Bekleyen', statuses: ['PendingModeration', 'Approved'] },
  { key: 'progress', label: 'İşlemde', statuses: ['InProgress'] },
  { key: 'done', label: 'Çözülen', statuses: ['Resolved', 'Closed'] },
];

// Türkçe karakterleri de doğru karşılaştırmak için locale-aware küçük harf.
const normalize = (s: string) => s.toLocaleLowerCase('tr-TR').trim();

/**
 * Bir şikayet listesi üzerinde metin araması + kategori + durum filtrelemesi yapar.
 * Filtre durumunu (search/category/status) yönetir ve `filtered` sonucunu döner.
 * Şikayetlerim ve yetkili panel aynı hook'u paylaşır.
 */
export function useComplaintFilters(complaints: Complaint[]) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(''); // '' = tüm kategoriler
  const [status, setStatus] = useState<StatusFilterKey>('all');

  const filtered = useMemo(() => {
    const q = normalize(search);
    const statusGroup = STATUS_FILTERS.find((f) => f.key === status)!.statuses;

    return complaints.filter((c) => {
      if (category && c.category !== category) return false;
      if (statusGroup.length > 0 && !statusGroup.includes(c.status)) return false;
      if (q) {
        const haystack = normalize(`${c.title} ${c.description} ${c.institutionName}`);
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [complaints, search, category, status]);

  const isFiltering = search.trim() !== '' || category !== '' || status !== 'all';
  const reset = () => {
    setSearch('');
    setCategory('');
    setStatus('all');
  };

  return {
    search, setSearch,
    category, setCategory,
    status, setStatus,
    filtered,
    isFiltering,
    reset,
  };
}

export type ComplaintFilters = ReturnType<typeof useComplaintFilters>;
