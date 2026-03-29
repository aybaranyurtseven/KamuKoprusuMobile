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
  location?: { latitude: number; longitude: number };
  isAnonymous: boolean;
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

// XP rewards
export const XP_REWARDS = {
  firstComplaint: 10,
  approvedComplaint: 15,
  resolvedComplaint: 25,
  mediaAttachment: 5,
  extraPhoto: 2,
};
