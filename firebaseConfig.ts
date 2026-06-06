import { initializeApp } from 'firebase/app';
// getReactNativePersistence, RN derlemesinde bulunur ancak ana TS tiplerinde dışa aktarılmaz.
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDIMUPpqFmB6axttb6Y9ewtHzEfFVcaxw8",
  authDomain: "kamukoprusu.firebaseapp.com",
  projectId: "kamukoprusu",
  storageBucket: "kamukoprusu.firebasestorage.app",
  messagingSenderId: "12130706958",
  appId: "1:12130706958:web:1c993f59b2e40d61ffbe5f",
  measurementId: "G-8NC0W8PCQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
// React Native'de oturumun cihazda kalıcı olması için AsyncStorage tabanlı
// persistence ile başlatılır. Fast Refresh sırasında tekrar başlatma hatasını
// (auth/already-initialized) önlemek için getAuth'a düşülür.
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
