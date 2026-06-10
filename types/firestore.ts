// Firestore Collection Types for Kamu Köprüsü

export interface UserData {
  uid: string;
  name: string;
  email: string;
  role: 'Citizen' | 'InstitutionRep' | 'NGOCoordinator' | 'Moderator' | 'Admin';
  createdAt: any; // Firestore Timestamp
  xp: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  badges: string[];
  institutionId?: string;
  phone?: string;
  avatar?: string;
  pushToken?: string; // Expo push token (durum bildirimleri için)
}

export interface Institution {
  id: string;
  name: string;
  category: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  createdAt: any;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  institutionId: string;
  institutionName: string;
  title: string;
  description: string;
  category: string;
  status: 'PendingModeration' | 'Approved' | 'Rejected' | 'InProgress' | 'Resolved' | 'Closed';
  type: 'Complaint' | 'Suggestion';
  mediaUrls: string[];
  location?: { latitude: number; longitude: number; address?: string };
  isAnonymous: boolean;
  // Hangi durum-temelli XP ödüllerinin verildiğini takip eder (idempotency).
  // Örn: ['Approved', 'Resolved'] → bu ödüller bir daha verilmez.
  xpAwarded?: string[];
  // Çözüm sonrası vatandaş değerlendirmesi (1-5) ve yorum.
  rating?: number;
  ratingComment?: string;
  createdAt: any;
  updatedAt: any;
}

export interface ComplaintUpdate {
  id: string;
  complaintId: string;
  updatedBy: string;
  message: string;
  newStatus: string;
  createdAt: any;
}

export interface ComplaintMessage {
  id: string;
  complaintId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  createdAt: any;
}

export interface AppNotification {
  id: string;
  userId: string;          // bildirimin sahibi (şikayet sahibi)
  complaintId: string;
  complaintTitle: string;
  type?: 'status' | 'message'; // bildirim türü (varsayılan: status)
  newStatus?: string;      // status türü için
  message: string;
  read: boolean;
  createdAt: any;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

// Level thresholds
export const LEVEL_THRESHOLDS = {
  Bronze: { min: 0, max: 99 },
  Silver: { min: 100, max: 249 },
  Gold: { min: 250, max: 499 },
  Platinum: { min: 500, max: 999 },
  Diamond: { min: 1000, max: Infinity },
};

// XP rewards (kazanılan deneyim puanları)
export const XP_REWARDS = {
  complaintCreated: 10,   // her şikayet/öneri oluşturma
  withMedia: 5,           // fotoğraf eklenmişse ek puan
  approvedComplaint: 15,  // moderatör onayladığında (şikayet sahibine)
  resolvedComplaint: 25,  // kurum çözdüğünde (şikayet sahibine)
};

// Rozet değerlendirmesi için kullanıcı istatistikleri
export interface UserStats {
  totalComplaints: number;
  approvedComplaints: number;
  resolvedComplaints: number;
  withMediaComplaints: number;
  xp: number;
}
