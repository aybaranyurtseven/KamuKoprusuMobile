import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
