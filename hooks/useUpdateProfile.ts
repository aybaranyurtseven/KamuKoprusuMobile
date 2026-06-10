import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateUserData } from '@/services/firestoreService';
import { uploadImageAsync } from '@/services/storageService';
import { UserData } from '@/types/firestore';

export interface ProfileUpdateInput {
  name: string;
  phone?: string;
  // Mevcut (http) URL ya da galeriden seçilen yeni yerel URI. Yerelse yüklenir.
  avatarUri?: string;
}

/**
 * Profil güncellemesinin backend diyalogunu kapsüller:
 *  1) Avatar yeni seçildiyse Storage'a yükler
 *  2) Ad/telefon/avatar alanlarını Firestore'da günceller
 *  3) AuthContext'i tazeler (drawer, ana sayfa, profil anında güncellensin)
 */
export function useUpdateProfile() {
  const { user, refreshUserData } = useAuth();
  const [saving, setSaving] = useState(false);

  const save = async (input: ProfileUpdateInput): Promise<boolean> => {
    if (!user) return false;
    setSaving(true);
    try {
      const updates: Partial<UserData> = { name: input.name.trim() };
      if (input.phone !== undefined) updates.phone = input.phone.trim();

      // Yalnızca yeni seçilen (yerel) avatarı yükle; mevcut http URL'yi atla.
      if (input.avatarUri && !input.avatarUri.startsWith('http')) {
        updates.avatar = await uploadImageAsync(input.avatarUri, `avatars/${user.uid}.jpg`);
      }

      await updateUserData(user.uid, updates);
      await refreshUserData();
      return true;
    } finally {
      setSaving(false);
    }
  };

  return { save, saving };
}
