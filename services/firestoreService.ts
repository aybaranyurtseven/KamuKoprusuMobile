import { collection, doc, getDoc, getDocs, updateDoc, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserData, Institution, Complaint, Badge, LEVEL_THRESHOLDS } from '../types/firestore';

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
