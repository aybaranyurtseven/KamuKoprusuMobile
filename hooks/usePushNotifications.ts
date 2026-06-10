import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { registerForPushNotificationsAsync } from '@/services/notificationService';
import { updateUserData } from '@/services/firestoreService';

// Uygulama ön plandayken gelen bildirimin nasıl gösterileceğini belirler.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Push bildirim altyapısını kurar:
 *  1) Kullanıcı giriş yapınca izin ister, Expo push token'ı alır ve kullanıcının
 *     Firestore kaydına yazar (durum değişince bu token'a bildirim gider).
 *  2) Bir bildirime dokunulduğunda ilgili şikayet detayına yönlendirir.
 */
export function usePushNotifications() {
  const { user } = useAuth();
  const router = useRouter();

  // Token kaydı (giriş yapıldığında)
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (!cancelled && token) {
        try {
          await updateUserData(user.uid, { pushToken: token });
        } catch (error) {
          console.error('Push token kaydedilemedi:', error);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Bildirime dokunma → ilgili şikayete yönlendir
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const complaintId = response.notification.request.content.data?.complaintId;
      if (complaintId) {
        router.push({ pathname: '/complaint-detail', params: { id: String(complaintId) } });
      }
    });
    return () => subscription.remove();
  }, [router]);
}
