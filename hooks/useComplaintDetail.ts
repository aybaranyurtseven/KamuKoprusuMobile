import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Complaint, ComplaintUpdate } from '@/types/firestore';

/**
 * Tek bir şikayeti ve süreç geçmişini (ComplaintUpdates) CANLI dinler.
 * Tüm Firestore abonelik mantığı bu hook'ta toplanır; detay ekranı sadece
 * dönen { complaint, updates, loading } verisini render eder.
 */
export function useComplaintDetail(id?: string) {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [updates, setUpdates] = useState<ComplaintUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Şikayeti canlı dinle (durum güncellenince banner anında yenilensin)
    const unsubComplaint = onSnapshot(
      doc(db, 'Complaints', id),
      (snap) => {
        if (snap.exists()) {
          setComplaint({ id: snap.id, ...snap.data() } as Complaint);
        }
        setLoading(false);
      },
      (error) => {
        console.error('useComplaintDetail (complaint):', error);
        setLoading(false);
      }
    );

    // Süreç geçmişini (ComplaintUpdates) dinle
    const q = query(
      collection(db, 'ComplaintUpdates'),
      where('complaintId', '==', id),
      orderBy('createdAt', 'desc')
    );
    const unsubUpdates = onSnapshot(q, (snapshot) => {
      setUpdates(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ComplaintUpdate)));
    });

    return () => {
      unsubComplaint();
      unsubUpdates();
    };
  }, [id]);

  return { complaint, updates, loading };
}
