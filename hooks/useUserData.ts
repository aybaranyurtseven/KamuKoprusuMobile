import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getUserData } from '@/services/firestoreService';
import { UserData } from '@/types/firestore';

/**
 * Giriş yapmış kullanıcının Firestore profilini (XP, seviye, rozetler) çeker.
 * Ekran her odaklandığında otomatik tazeler; böylece başka ekranda kazanılan
 * XP/rozet profile dönünce anında yansır.
 */
export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (isActive: () => boolean) => {
      if (!user) {
        if (isActive()) setLoading(false);
        return;
      }
      try {
        const data = await getUserData(user.uid);
        if (isActive()) setUserData(data);
      } catch (error) {
        console.error('useUserData:', error);
      } finally {
        if (isActive()) setLoading(false);
      }
    },
    [user]
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      load(() => active);
      return () => { active = false; };
    }, [load])
  );

  const refetch = useCallback(() => load(() => true), [load]);

  return { userData, loading, refetch };
}
