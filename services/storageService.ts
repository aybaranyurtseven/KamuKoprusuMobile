import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

/**
 * Yerel bir dosya URI'sini Firebase Storage'a yükler ve indirme URL'sini döner.
 * Şikayet medyası ve profil avatarı gibi tüm yüklemeler bu yardımcıyı kullanır.
 *
 * NOT: React Native'de fetch(uri).blob() çoğu zaman doğru contentType üretmez;
 * bu yüzden metadata ile contentType'ı açıkça belirtiyoruz. Hem güvenlik
 * kuralındaki image kontrolünü geçer hem de dosya sonradan düzgün açılır.
 */
export async function uploadImageAsync(
  uri: string,
  path: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, { contentType });
  return getDownloadURL(storageRef);
}
