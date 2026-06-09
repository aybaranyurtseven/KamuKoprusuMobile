import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { createComplaint } from '@/services/firestoreService';
import { onComplaintCreated, RewardResult } from '@/services/gamificationService';
import { Institution } from '@/types/firestore';

export interface CreateComplaintInput {
  title: string;
  description: string;
  category: string;
  institution: Institution;
  images: string[];
  isAnonymous: boolean;
}

// Bir promise'i süre sınırına bağlar; askıda kalan ağ isteği UI'ı kilitlemesin.
const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);

const uploadImage = async (uri: string, complaintId: string, index: number): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `complaints/${complaintId}/${Date.now()}_${index}.jpg`);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
};

/**
 * Şikayet gönderiminin tüm backend diyalogunu kapsüller:
 *  1) Şikayeti oluştur (kritik yol, timeout korumalı)
 *  2) Fotoğrafları ARKA PLANDA yükle (UI'ı bloke etmez)
 *  3) Oyunlaştırmayı ARKA PLANDA çalıştır ve ödülü `reward` olarak yayınla
 *
 * Ekran yalnızca form doğrulaması, formu sıfırlama ve ödül modalını
 * göstermekle ilgilenir.
 */
export function useCreateComplaint() {
  const { user, userData, refreshUserData } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [reward, setReward] = useState<RewardResult | null>(null);

  // Şikayeti kaydeder. Başarılıysa true döner (ekran formu sıfırlasın diye).
  // Kritik kayıt başarısız olursa hata fırlatır (ekran uyarı göstersin diye).
  const submit = async (input: CreateComplaintInput): Promise<boolean> => {
    if (!user) return false;

    const hadMedia = input.images.length > 0;
    const imagesToUpload = input.images;
    setSubmitting(true);

    let complaintId: string;
    try {
      complaintId = await withTimeout(
        createComplaint({
          userId: user.uid,
          userName: input.isAnonymous ? 'Anonim' : (userData?.name || 'Bilinmiyor'),
          institutionId: input.institution.id,
          institutionName: input.institution.name,
          title: input.title.trim(),
          description: input.description.trim(),
          category: input.category,
          status: 'PendingModeration',
          type: 'Complaint',
          mediaUrls: [],
          isAnonymous: input.isAnonymous,
        }),
        15000
      );
    } finally {
      setSubmitting(false);
    }

    // Fotoğrafları arka planda, en iyi çaba ile yükle.
    if (hadMedia) {
      (async () => {
        try {
          const urls = await withTimeout(
            Promise.all(imagesToUpload.map((uri, i) => uploadImage(uri, complaintId, i))),
            30000
          );
          await updateDoc(doc(db, 'Complaints', complaintId), { mediaUrls: urls });
        } catch (mediaError) {
          console.error('useCreateComplaint media:', mediaError);
        }
      })();
    }

    // Oyunlaştırmayı arka planda çalıştır; bittiğinde ödül modalını tetikle.
    (async () => {
      try {
        const result = await withTimeout(onComplaintCreated(user.uid, hadMedia), 8000);
        await withTimeout(refreshUserData(), 5000).catch(() => {});
        setReward(result);
      } catch (gamificationError) {
        console.error('useCreateComplaint gamification:', gamificationError);
      }
    })();

    return true;
  };

  return { submit, submitting, reward, clearReward: () => setReward(null) };
}
