// ─────────────────────────────────────────────────────────────
// Kamu Köprüsü — Kurum (Institutions) seed script'i
//
// Çalıştırma:  node scripts/seedInstitutions.mjs
//
// Firestore güvenlik kuralların yazma için giriş (auth) istiyorsa,
// aşağıdaki ADMIN_EMAIL / ADMIN_PASSWORD alanlarını kendi hesabınla
// doldur. Kurallar açıksa boş bırakabilirsin.
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDIMUPpqFmB6axttb6Y9ewtHzEfFVcaxw8',
  authDomain: 'kamukoprusu.firebaseapp.com',
  projectId: 'kamukoprusu',
  storageBucket: 'kamukoprusu.firebasestorage.app',
  messagingSenderId: '12130706958',
  appId: '1:12130706958:web:1c993f59b2e40d61ffbe5f',
  measurementId: 'G-8NC0W8PCQ5',
};

// === GEREKİRSE DOLDUR ===
const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'Admin123.'; // kendi şifreni yaz; kurallar açıksa boş bırak

// Kategoriler uygulamadaki seçeneklerle aynı:
// Ulaşım, Sağlık, Eğitim, Altyapı, Çevre, Güvenlik, Diğer
const institutions = [
  {
    name: 'Ulaştırma ve Altyapı Bakanlığı',
    category: 'Ulaşım',
    contactEmail: 'iletisim@uab.gov.tr',
    contactPhone: '0312 203 10 00',
    address: 'Hakkı Turaylıç Cad. No:5, Çankaya / Ankara',
  },
  {
    name: 'Karayolları Genel Müdürlüğü',
    category: 'Ulaşım',
    contactEmail: 'bilgi@kgm.gov.tr',
    contactPhone: '0312 415 70 00',
    address: 'İnönü Bulvarı No:14, Yücetepe / Ankara',
  },
  {
    name: 'Sağlık Bakanlığı',
    category: 'Sağlık',
    contactEmail: 'sabim@saglik.gov.tr',
    contactPhone: '184',
    address: 'Bilkent Yerleşkesi, Üniversiteler Mah., Çankaya / Ankara',
  },
  {
    name: 'İl Sağlık Müdürlüğü',
    category: 'Sağlık',
    contactEmail: 'iletisim@ism.gov.tr',
    contactPhone: '0312 565 50 00',
    address: 'İl Sağlık Müdürlüğü Hizmet Binası',
  },
  {
    name: 'Millî Eğitim Bakanlığı',
    category: 'Eğitim',
    contactEmail: 'meb@meb.gov.tr',
    contactPhone: '0312 413 10 00',
    address: 'Atatürk Bulvarı No:98, Kızılay / Ankara',
  },
  {
    name: 'İl Millî Eğitim Müdürlüğü',
    category: 'Eğitim',
    contactEmail: 'iletisim@meb.gov.tr',
    contactPhone: '0312 306 50 00',
    address: 'İl Millî Eğitim Müdürlüğü Hizmet Binası',
  },
  {
    name: 'Su ve Kanalizasyon İdaresi (İSKİ/ASKİ)',
    category: 'Altyapı',
    contactEmail: 'cozummerkezi@iski.gov.tr',
    contactPhone: '185',
    address: 'Su ve Kanalizasyon İdaresi Genel Müdürlüğü',
  },
  {
    name: 'Belediye Fen İşleri Müdürlüğü',
    category: 'Altyapı',
    contactEmail: 'fenisleri@belediye.gov.tr',
    contactPhone: '153',
    address: 'Büyükşehir Belediyesi Ek Hizmet Binası',
  },
  {
    name: 'Çevre, Şehircilik ve İklim Değişikliği Bakanlığı',
    category: 'Çevre',
    contactEmail: 'bimer@csb.gov.tr',
    contactPhone: '181',
    address: 'Mustafa Kemal Mah. Eskişehir Devlet Yolu, Çankaya / Ankara',
  },
  {
    name: 'Belediye Temizlik İşleri Müdürlüğü',
    category: 'Çevre',
    contactEmail: 'temizlik@belediye.gov.tr',
    contactPhone: '153',
    address: 'Büyükşehir Belediyesi Temizlik İşleri Daire Başkanlığı',
  },
  {
    name: 'Emniyet Genel Müdürlüğü',
    category: 'Güvenlik',
    contactEmail: 'bilgi@egm.gov.tr',
    contactPhone: '155',
    address: 'Ayrancı Mah. Dikmen Cad. No:11, Çankaya / Ankara',
  },
  {
    name: 'Jandarma Genel Komutanlığı',
    category: 'Güvenlik',
    contactEmail: 'jandarma@jandarma.gov.tr',
    contactPhone: '156',
    address: 'Akyurt / Ankara',
  },
  {
    name: 'CİMER — Cumhurbaşkanlığı İletişim Merkezi',
    category: 'Diğer',
    contactEmail: 'cimer@cimer.gov.tr',
    contactPhone: '150',
    address: 'Cumhurbaşkanlığı Külliyesi, Beştepe / Ankara',
  },
  {
    name: 'Belediye Beyaz Masa',
    category: 'Diğer',
    contactEmail: 'beyazmasa@belediye.gov.tr',
    contactPhone: '153',
    address: 'Büyükşehir Belediyesi Hizmet Binası',
  },
];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  if (ADMIN_PASSWORD) {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log(`✓ Giriş yapıldı: ${ADMIN_EMAIL}`);
  } else {
    console.log('ℹ Giriş yapılmadan deneniyor (kurallar açık değilse şifre gerekir).');
  }

  // Zaten kurum varsa tekrar eklememek için kontrol
  const existing = await getDocs(collection(db, 'Institutions'));
  if (!existing.empty) {
    console.log(`⚠ Koleksiyonda zaten ${existing.size} kurum var. Yine de ekleniyor...`);
  }

  let count = 0;
  for (const inst of institutions) {
    const ref = await addDoc(collection(db, 'Institutions'), {
      ...inst,
      createdAt: serverTimestamp(),
    });
    count++;
    console.log(`  ✓ ${inst.name}  (${inst.category})  →  ${ref.id}`);
  }

  console.log(`\n✅ Toplam ${count} kurum eklendi.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('\n❌ Hata:', err.code || err.message);
  if (err.code === 'permission-denied') {
    console.error(
      'Firestore kuralları yazmaya izin vermiyor. Script içindeki ADMIN_PASSWORD\'ü doldur ' +
      'ya da Firestore kurallarında Institutions koleksiyonuna geçici yazma izni ver.'
    );
  }
  process.exit(1);
});
