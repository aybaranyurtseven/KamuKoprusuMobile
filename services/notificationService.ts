import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Complaint, UserData } from '../types/firestore';
import { COMPLAINT_STATUS } from '../constants/complaintStatus';

// Expo Push API uç noktası — bildirim göndermek için fetch ile çağrılır.
const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

/**
 * Bildirim izni ister ve cihaza ait Expo push token'ını döner.
 * - Android'de bildirim kanalını kurar.
 * - Fiziksel cihaz değilse veya izin verilmezse null döner.
 * NOT: Uzak push, Expo Go yerine bir development build gerektirir.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Varsayılan',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3b82f6',
    });
  }

  if (!Device.isDevice) {
    console.log('Push bildirimleri yalnızca fiziksel cihazda çalışır.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Bildirim izni verilmedi.');
    return null;
  }

  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      (Constants as any)?.easConfig?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  } catch (error) {
    console.error('Push token alınamadı:', error);
    return null;
  }
}

/**
 * Tek bir Expo push token'ına bildirim gönderir (Expo Push API üzerinden).
 */
export async function sendExpoPush(
  to: string,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> {
  await fetch(EXPO_PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, sound: 'default', title, body, data }),
  });
}

/**
 * Bir şikayetin durumu değiştiğinde, şikayet SAHİBİNE bildirim gönderir.
 * Sahibin Firestore kaydındaki pushToken kullanılır; token yoksa sessizce çıkar.
 */
export async function notifyComplaintStatus(
  complaint: Complaint,
  status: Complaint['status'],
  message: string
): Promise<void> {
  const ownerSnap = await getDoc(doc(db, 'Users', complaint.userId));
  const token = (ownerSnap.data() as UserData | undefined)?.pushToken;
  if (!token) return;

  const label = COMPLAINT_STATUS[status]?.label ?? status;
  await sendExpoPush(
    token,
    'Şikayetin güncellendi',
    `"${complaint.title}" → ${label}\n${message}`,
    { complaintId: complaint.id }
  );
}

/**
 * Yeni mesaj geldiğinde belirli bir kullanıcıya push bildirimi gönderir.
 * Alıcının pushToken'ı Firestore'dan okunur; token yoksa sessizce çıkar.
 */
export async function notifyNewMessage(
  recipientId: string,
  complaintId: string,
  senderName: string,
  text: string
): Promise<void> {
  const snap = await getDoc(doc(db, 'Users', recipientId));
  const token = (snap.data() as UserData | undefined)?.pushToken;
  if (!token) return;

  await sendExpoPush(token, `Yeni mesaj — ${senderName}`, text, { complaintId });
}
