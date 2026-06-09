import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchInstitutionsThunk } from '@/store/slices/institutionsSlice';

/**
 * Kurum listesini Redux store'a yükler ve döner.
 * İlk kullanımda thunk'ı dispatch eder; store zaten doluysa tekrar çeker
 * (kurum listesi nadiren değişir, basit tutuldu).
 */
export function useInstitutions() {
  const dispatch = useAppDispatch();
  const { institutions, loading, error } = useAppSelector((state) => state.institutions);

  useEffect(() => {
    dispatch(fetchInstitutionsThunk());
  }, [dispatch]);

  return { institutions, loading, error };
}
