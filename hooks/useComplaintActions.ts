import { useState } from 'react';
import { updateComplaint, deleteComplaint } from '@/services/firestoreService';
import { Complaint } from '@/types/firestore';

export type EditableComplaint = Partial<Pick<Complaint, 'title' | 'description' | 'category'>>;

/**
 * Şikayet sahibinin kendi şikayeti üzerindeki işlemleri (düzenle/sil) kapsüller.
 * `busy` ortak yükleme durumudur; düzenleme ve silme ekranları bunu paylaşır.
 */
export function useComplaintActions() {
  const [busy, setBusy] = useState(false);

  const saveEdit = async (id: string, data: EditableComplaint): Promise<boolean> => {
    setBusy(true);
    try {
      await updateComplaint(id, data);
      return true;
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    setBusy(true);
    try {
      await deleteComplaint(id);
      return true;
    } finally {
      setBusy(false);
    }
  };

  return { saveEdit, remove, busy };
}
