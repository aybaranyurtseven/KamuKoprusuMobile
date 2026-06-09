import {
  collection, doc, getDoc, getDocs, query, where,
  updateDoc, increment, arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserData, Complaint, UserStats, XP_REWARDS } from '../types/firestore';
import { calculateLevel } from './firestoreService';
import { BADGE_DEFINITIONS, BadgeDefinition } from '../constants/badges';

// Bir oyunlaştırma aksiyonunun sonucu — geri bildirim UI'ı bununla beslenir.
export interface RewardResult {
  xpGained: number;
  leveledUp: boolean;
  newLevel: UserData['level'];
  newBadges: BadgeDefinition[];
}

// ─── XP ─────────────────────────────────────────────────────

// Kullanıcıya XP ekler, seviyeyi yeniden hesaplar ve gerekiyorsa günceller.
export const awardXp = async (uid: string, amount: number) => {
  const userRef = doc(db, 'Users', uid);
  const before = await getDoc(userRef);
  const prevData = before.data() as UserData | undefined;
  const previousLevel = prevData?.level ?? 'Bronze';
  const newXp = (prevData?.xp ?? 0) + amount;
  const newLevel = calculateLevel(newXp);

  await updateDoc(userRef, { xp: increment(amount), level: newLevel });

  return { xp: newXp, newLevel, leveledUp: newLevel !== previousLevel, previousLevel };
};

// ─── STATS ──────────────────────────────────────────────────

// Rozet değerlendirmesi için kullanıcının güncel istatistiklerini toplar.
export const getUserStats = async (uid: string): Promise<UserStats> => {
  const userSnap = await getDoc(doc(db, 'Users', uid));
  const xp = (userSnap.data() as UserData | undefined)?.xp ?? 0;

  const q = query(collection(db, 'Complaints'), where('userId', '==', uid));
  const snap = await getDocs(q);
  const complaints = snap.docs.map((d) => d.data() as Complaint);

  return {
    xp,
    totalComplaints: complaints.length,
    approvedComplaints: complaints.filter((c) => c.status === 'Approved').length,
    resolvedComplaints: complaints.filter((c) =>
      c.status === 'Resolved' || c.status === 'Closed'
    ).length,
    withMediaComplaints: complaints.filter((c) => (c.mediaUrls?.length ?? 0) > 0).length,
  };
};

// ─── BADGES ─────────────────────────────────────────────────

// Koşulları sağlanan ama henüz kazanılmamış rozetleri kullanıcıya ekler.
// Yeni kazanılan rozet tanımlarını döner (geri bildirim UI için).
export const syncBadges = async (uid: string): Promise<BadgeDefinition[]> => {
  const userRef = doc(db, 'Users', uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() as UserData | undefined;
  if (!userData) return [];

  const stats = await getUserStats(uid);
  const earned = userData.badges ?? [];

  const newlyEarned = BADGE_DEFINITIONS.filter(
    (b) => !earned.includes(b.id) && b.check(stats)
  );

  if (newlyEarned.length > 0) {
    await updateDoc(userRef, {
      badges: arrayUnion(...newlyEarned.map((b) => b.id)),
    });
  }

  return newlyEarned;
};

// ─── ORCHESTRATORS ──────────────────────────────────────────

// Şikayet oluşturulduğunda çağrılır: XP verir + rozetleri değerlendirir.
export const onComplaintCreated = async (
  uid: string,
  hasMedia: boolean
): Promise<RewardResult> => {
  const xpGained = XP_REWARDS.complaintCreated + (hasMedia ? XP_REWARDS.withMedia : 0);
  const { newLevel, leveledUp } = await awardXp(uid, xpGained);
  const newBadges = await syncBadges(uid);
  return { xpGained, leveledUp, newLevel, newBadges };
};

// Yetkili bir şikayeti Onayladığında/Çözdüğünde şikayet SAHİBİNE XP verir.
// complaint.xpAwarded sayesinde aynı ödül iki kez verilmez (idempotent).
export const rewardComplaintStatus = async (
  complaint: Complaint,
  status: Complaint['status']
) => {
  const amount =
    status === 'Approved' ? XP_REWARDS.approvedComplaint :
    status === 'Resolved' ? XP_REWARDS.resolvedComplaint : 0;
  if (amount === 0) return;
  if (complaint.xpAwarded?.includes(status)) return; // zaten verilmiş

  const complaintRef = doc(db, 'Complaints', complaint.id);
  await updateDoc(complaintRef, { xpAwarded: arrayUnion(status) });

  await awardXp(complaint.userId, amount);
  await syncBadges(complaint.userId);
};
