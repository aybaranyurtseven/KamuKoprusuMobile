import { collection, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserData, Institution, Complaint, Badge, AppNotification, ComplaintMessage, LEVEL_THRESHOLDS } from '../types/firestore';

// ─── USER SERVICES ───────────────────────────────────────────

export const getUserData = async (uid: string): Promise<UserData | null> => {
  const docRef = doc(db, 'Users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as UserData) : null;
};

export const updateUserData = async (uid: string, data: Partial<UserData>) => {
  const docRef = doc(db, 'Users', uid);
  await updateDoc(docRef, data);
};

export const calculateLevel = (xp: number): UserData['level'] => {
  for (const [level, range] of Object.entries(LEVEL_THRESHOLDS)) {
    if (xp >= range.min && xp <= range.max) {
      return level as UserData['level'];
    }
  }
  return 'Bronze';
};

// ─── INSTITUTION SERVICES ────────────────────────────────────

export const getInstitutions = async (): Promise<Institution[]> => {
  const snapshot = await getDocs(collection(db, 'Institutions'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Institution));
};

export const getInstitution = async (id: string): Promise<Institution | null> => {
  const docRef = doc(db, 'Institutions', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Institution) : null;
};

// ─── COMPLAINT SERVICES ─────────────────────────────────────

export const createComplaint = async (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'Complaints'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserComplaints = (
  uid: string,
  callback: (complaints: Complaint[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(
    collection(db, 'Complaints'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
      callback(complaints);
    },
    (error) => {
      console.error('getUserComplaints error:', error);
      onError?.(error);
    }
  );
};

export const getInstitutionComplaints = (
  institutionId: string,
  callback: (complaints: Complaint[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(
    collection(db, 'Complaints'),
    where('institutionId', '==', institutionId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
      callback(complaints);
    },
    (error) => {
      console.error('getInstitutionComplaints error:', error);
      onError?.(error);
    }
  );
};

// Moderatör / Yönetici için: tüm şikayetleri tarihe göre dinler.
// Tek alan (createdAt) sıralaması olduğundan composite index gerektirmez.
export const getAllComplaints = (
  callback: (complaints: Complaint[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(collection(db, 'Complaints'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
      callback(complaints);
    },
    (error) => {
      console.error('getAllComplaints error:', error);
      onError?.(error);
    }
  );
};

// Şikayet sahibinin kendi şikayetini düzenlemesi (başlık/açıklama/kategori).
export const updateComplaint = async (
  complaintId: string,
  data: Partial<Pick<Complaint, 'title' | 'description' | 'category'>>
) => {
  await updateDoc(doc(db, 'Complaints', complaintId), { ...data, updatedAt: serverTimestamp() });
};

// Şikayet sahibinin kendi şikayetini silmesi.
export const deleteComplaint = async (complaintId: string) => {
  await deleteDoc(doc(db, 'Complaints', complaintId));
};

// Çözülen şikayet için vatandaş değerlendirmesi (1-5 yıldız + yorum).
export const rateComplaint = async (complaintId: string, rating: number, comment: string) => {
  await updateDoc(doc(db, 'Complaints', complaintId), {
    rating,
    ratingComment: comment.trim(),
  });
};

export const updateComplaintStatus = async (complaintId: string, status: Complaint['status'], updatedBy: string, message: string) => {
  const complaintRef = doc(db, 'Complaints', complaintId);
  await updateDoc(complaintRef, { status, updatedAt: serverTimestamp() });

  await addDoc(collection(db, 'ComplaintUpdates'), {
    complaintId,
    updatedBy,
    message,
    newStatus: status,
    createdAt: serverTimestamp(),
  });
};

// ─── BADGE SERVICES ─────────────────────────────────────────

export const getBadges = async (): Promise<Badge[]> => {
  const snapshot = await getDocs(collection(db, 'Badges'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge));
};

// ─── MESSAGE SERVICES ───────────────────────────────────────

// Şikayet üzerine mesaj gönderir (vatandaş ↔ kurum yazışması).
export const sendComplaintMessage = async (data: {
  complaintId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
}) => {
  await addDoc(collection(db, 'ComplaintMessages'), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

// Bir şikayetin mesajlarını CANLI dinler. Composite index gerektirmemek için
// yalnızca eşitlik filtresi; sıralama (eskiden yeniye) istemci tarafında.
export const getComplaintMessages = (
  complaintId: string,
  callback: (items: ComplaintMessage[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(collection(db, 'ComplaintMessages'), where('complaintId', '==', complaintId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ComplaintMessage));
      items.sort((a, b) => (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0));
      callback(items);
    },
    (error) => {
      console.error('getComplaintMessages error:', error);
      onError?.(error);
    }
  );
};

// ─── NOTIFICATION SERVICES ──────────────────────────────────

// Şikayet sahibine uygulama içi bildirim oluşturur (durum değişimi veya yeni mesaj).
export const createNotification = async (data: {
  userId: string;
  complaintId: string;
  complaintTitle: string;
  type?: 'status' | 'message';
  newStatus?: string;
  message: string;
}) => {
  await addDoc(collection(db, 'Notifications'), {
    type: 'status',
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
};

// Kullanıcının bildirimlerini canlı dinler. Composite index gerektirmemek için
// yalnızca eşitlik filtresi kullanılır; sıralama istemci tarafında yapılır.
export const getUserNotifications = (
  uid: string,
  callback: (items: AppNotification[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(collection(db, 'Notifications'), where('userId', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AppNotification));
      items.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
      callback(items);
    },
    (error) => {
      console.error('getUserNotifications error:', error);
      onError?.(error);
    }
  );
};

export const markNotificationRead = async (id: string) => {
  await updateDoc(doc(db, 'Notifications', id), { read: true });
};

export const markAllNotificationsRead = async (ids: string[]) => {
  if (ids.length === 0) return;
  const batch = writeBatch(db);
  ids.forEach((id) => batch.update(doc(db, 'Notifications', id), { read: true }));
  await batch.commit();
};
