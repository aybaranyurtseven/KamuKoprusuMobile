import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllComplaints, getInstitutionComplaints } from '@/services/firestoreService';
import { Complaint } from '@/types/firestore';

const MODERATOR_ROLES = ['Moderator', 'Admin', 'NGOCoordinator'];

/**
 * Yetkili kullanıcı için role bağlı şikayet akışını CANLI dinler:
 *  - Moderatör/Yönetici → tüm şikayetler
 *  - Kurum temsilcisi   → yalnızca kendi kurumunun şikayetleri
 * institutionId atanmamış kurum temsilcisi için noInstitution=true döner.
 */
export function useStaffComplaints() {
  const { user, userData } = useAuth();
  const isModerator = MODERATOR_ROLES.includes(userData?.role);
  const institutionId = userData?.institutionId;

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [noInstitution, setNoInstitution] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const onData = (data: Complaint[]) => {
      setComplaints(data);
      setLoading(false);
    };
    const onError = (err: Error) => {
      console.error('useStaffComplaints:', err);
      setLoading(false);
    };

    let unsubscribe: (() => void) | undefined;
    if (isModerator) {
      unsubscribe = getAllComplaints(onData, onError);
    } else if (institutionId) {
      unsubscribe = getInstitutionComplaints(institutionId, onData, onError);
    } else {
      // Kurum temsilcisi ama institutionId atanmamış
      setNoInstitution(true);
      setLoading(false);
      return;
    }

    return () => unsubscribe && unsubscribe();
  }, [user, isModerator, institutionId]);

  return { complaints, loading, noInstitution, isModerator };
}
