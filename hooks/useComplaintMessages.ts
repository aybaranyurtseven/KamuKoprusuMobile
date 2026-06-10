import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getComplaintMessages, sendComplaintMessage } from '@/services/firestoreService';
import { ComplaintMessage } from '@/types/firestore';

/**
 * Bir şikayetin mesaj dizisini CANLI dinler ve mesaj gönderme sağlar.
 * Gönderen kimliği AuthContext'ten alınır.
 */
export function useComplaintMessages(complaintId?: string) {
  const { user, userData } = useAuth();
  const [messages, setMessages] = useState<ComplaintMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!complaintId) return;
    setLoading(true);
    const unsubscribe = getComplaintMessages(
      complaintId,
      (items) => {
        setMessages(items);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, [complaintId]);

  const send = async (text: string): Promise<boolean> => {
    const trimmed = text.trim();
    if (!trimmed || !complaintId || !user) return false;
    setSending(true);
    try {
      await sendComplaintMessage({
        complaintId,
        senderId: user.uid,
        senderName: userData?.name || user.email || 'Kullanıcı',
        senderRole: userData?.role || 'Citizen',
        text: trimmed,
      });
      return true;
    } finally {
      setSending(false);
    }
  };

  return { messages, loading, sending, send };
}
