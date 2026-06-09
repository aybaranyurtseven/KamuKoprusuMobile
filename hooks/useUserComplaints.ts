import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserComplaints } from '@/services/firestoreService';
import { useAppDispatch, useAppSelector } from '@/store';
import { setComplaints } from '@/store/slices/complaintsSlice';

/**
 * Giriş yapmış kullanıcının şikayetlerini CANLI dinler ve Redux store'a yazar.
 * Hem ana sayfa hem "Şikayetlerim" ekranı bu tek hook'u kullanır; böylece
 * abonelik mantığı ekranların içinde tekrarlanmaz.
 */
export function useUserComplaints() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const complaints = useAppSelector((state) => state.complaints.complaints);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = getUserComplaints(
      user.uid,
      (data) => {
        dispatch(setComplaints(data));
        setLoading(false);
      },
      (err) => {
        console.error('useUserComplaints:', err);
        setError(err);
        setLoading(false); // Hata olsa da spinner dursun (ör. eksik index)
      }
    );
    return () => unsubscribe();
  }, [user, dispatch]);

  return { complaints, loading, error };
}
