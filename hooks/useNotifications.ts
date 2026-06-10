import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/services/firestoreService';
import { AppNotification } from '@/types/firestore';

/**
 * Kullanıcının uygulama içi bildirimlerini CANLI dinler ve okundu işlemlerini sunar.
 * Hem ana sayfadaki okunmamış rozeti hem de bildirim merkezi ekranı kullanır.
 */
export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = getUserNotifications(
      user.uid,
      (items) => {
        setNotifications(items);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => markNotificationRead(id).catch((e) => console.error(e));
  const markAllRead = () =>
    markAllNotificationsRead(notifications.filter((n) => !n.read).map((n) => n.id)).catch((e) =>
      console.error(e)
    );

  return { notifications, unreadCount, loading, markRead, markAllRead };
}
