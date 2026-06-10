# 🎥 Kamu Köprüsü — Hafta 1 Video Taslağı

> **Konu:** Proje Temeli, Veritabanı ve Kimlik Doğrulama
> **Hedef süre:** ~3.5 – 4 dakika
> **Ton:** Samimi, anlatıcı; izleyiciye "ne yaptım ve neden" anlatan.
>
> Format: Her sahnede **🎬 Ne göstereceksin** (ekran) ve **🎤 Ne söyleyeceksin** (anlatım) ayrı.
> Anlatım metnini kelimesi kelimesine okuma; kendi cümlelerinle akıt.

**Ana mesaj (tek cümle):**
"Bu hafta görsele değil, sağlam temele odaklandım: Expo Router ile modern bir navigasyon mimarisi kurdum, Firebase'i bağladım, tüm veritabanı işlemlerini tek bir servis katmanında topladım ve kullanıcıların giriş yapıp kayıt olabildiği, korumalı yönlendirmeli bir kimlik doğrulama akışı tamamladım."

---

## ✅ Çekim Öncesi Kontrol Listesi
- [ ] Editörde yazı tipini büyüt (Ctrl + "+") — küçük kod videoda okunmuyor.
- [ ] Açık tutulacak dosyalar sekmede hazır olsun: `app/_layout.tsx`, `firebaseConfig.ts`, `services/firestoreService.ts`, `types/firestore.ts`, `context/AuthContext.tsx`.
- [ ] Uygulama emülatörde/telefonda çalışır durumda; en az bir test hesabı hazır.
- [ ] Demo ekranlarını (Giriş / Kayıt / Şifre Sıfırlama) önceden bir kez dene ki kayıtta takılma olmasın.
- [ ] Bildirimleri/sessize al, ekranı temizle (gereksiz sekme, masaüstü dağınıklığı yok).

---

## Sahne 1 — Açılış ve Proje Tanıtımı (0:00 – 0:25)
**🎬 Ne göstereceksin:** Uygulama açık, **Giriş Yap** (login) ekranı görünüyor.
**🎤 Ne söyleyeceksin:**
"Merhaba, bu Kamu Köprüsü projemin ilk hafta videosu. Kamu Köprüsü, vatandaşların kamu kurumlarına şikayet ve önerilerini iletebildiği bir mobil uygulama. Bu ilk haftada görsel tasarıma değil, projenin sağlam temeline odaklandım: navigasyon yapısı, veritabanı bağlantısı ve kullanıcı giriş sistemi. Şimdi sırayla neler kurduğumu göstereyim."

## Sahne 2 — Klasör Yapısı ve Expo Router (0:25 – 1:05)
**🎬 Ne göstereceksin:** Editörde `app/` dizinini aç; `(auth)` ve `(tabs)` klasörlerini, içlerindeki `_layout.tsx` dosyalarını göster. Kısaca kök `app/_layout.tsx` dosyasını da göster.
**🎤 Ne söyleyeceksin:**
"Navigasyon için Expo Router'ı seçtim; dosya tabanlı bir yapı, yani klasör ve dosya isimleri doğrudan ekran yollarına dönüşüyor. İki ana grubum var: `(auth)` giriş–kayıt ekranlarını, `(tabs)` ise giriş yaptıktan sonraki sekmeli ana uygulamayı tutuyor. Her grubun kendi `_layout.tsx` düzen dosyası var. Parantezli klasörler URL'de görünmüyor; sadece ekranları mantıksal olarak gruplamama yarıyor."

## Sahne 3 — Firebase Bağlantısı (1:05 – 1:45)
**🎬 Ne göstereceksin:** `firebaseConfig.ts` dosyasını aç. `initializeApp`, `initializeAuth` (AsyncStorage persistence ile) ve dışa aktarılan `auth`, `db`, `storage` satırlarını göster.
**🎤 Ne söyleyeceksin:**
"Arka uç için Firebase kullanıyorum. `firebaseConfig.ts` dosyasında uygulamayı başlatıyorum ve üç servisi dışa aktarıyorum: kimlik doğrulama için `auth`, veritabanı için `db` yani Firestore, ve dosya yükleme için `storage`. Önemli bir nokta: girişin cihazda kalıcı olması için auth'u AsyncStorage tabanlı persistence ile başlattım — uygulamayı kapatıp açınca kullanıcı tekrar giriş yapmak zorunda kalmıyor."

## Sahne 4 — Veritabanı Servis Katmanı (1:45 – 2:30)
**🎬 Ne göstereceksin:** `services/firestoreService.ts` dosyasını aç. Bölüm başlıklarını (`USER SERVICES`, `INSTITUTION SERVICES`, `COMPLAINT SERVICES`) kaydırarak göster; `getUserData`, `getInstitutions`, `createComplaint` gibi birkaç fonksiyona işaret et. Sonra `types/firestore.ts`'i kısaca açıp `Complaint` ve `UserData` tiplerini göster.
**🎤 Ne söyleyeceksin:**
"Veritabanı işlemlerini ekranların içine dağıtmak yerine tek bir yerde topladım: `firestoreService.ts`. Burada Users, Institutions, Complaints ve Badges koleksiyonları için okuma–yazma fonksiyonlarım var. Örneğin `getUserData` kullanıcı bilgisini çekiyor, `createComplaint` yeni şikayet ekliyor. Ayrıca `types/firestore.ts` dosyasında tüm veri tiplerini tanımladım; böylece TypeScript sayesinde yanlış bir alan kullanırsam daha kod yazarken uyarı alıyorum."

## Sahne 5 — Kimlik Doğrulama ve Korumalı Yönlendirme (2:30 – 3:10)
**🎬 Ne göstereceksin:** `context/AuthContext.tsx`'i aç; `onAuthStateChanged` ile oturumun dinlendiği yeri göster. Sonra `app/_layout.tsx`'e geç; `useEffect` içindeki "kullanıcı yoksa login'e, varsa tabs'a yönlendir" mantığını göster.
**🎤 Ne söyleyeceksin:**
"Oturum yönetimini `AuthContext` ile yapıyorum. Firebase'in `onAuthStateChanged` dinleyicisi sayesinde kullanıcı giriş veya çıkış yaptığında uygulama anında haberdar oluyor ve kullanıcının bilgilerini Firestore'dan çekiyorum. Kök `_layout.tsx`'te ise korumalı yönlendirme var: giriş yapmamış biri uygulamanın içine girmeye çalışırsa otomatik giriş ekranına, giriş yapmış biri de doğrudan ana uygulamaya yönlendiriliyor. Yani izinsiz erişim engelleniyor."

## Sahne 6 — Auth Ekranları (Canlı Demo) (3:10 – 3:40)
**🎬 Ne göstereceksin:** Uygulamaya geç. Giriş ekranını göster, sonra **Kayıt Ol**'a tıklayıp kayıt ekranını (Ad Soyad, E-posta, Şifre), ardından **Şifremi Unuttum**'a tıklayıp şifre sıfırlama ekranını göster. Mümkünse gerçek bir hesapla giriş yapıp ana ekrana düştüğünü göster.
**🎤 Ne söyleyeceksin:**
"Şimdi gerçekte görelim. Üç ekranım var: Giriş Yap, Kayıt Ol ve Şifre Sıfırlama. Kayıt ekranında ad, e-posta ve şifre alıyorum; şifremi unuttum ekranı ise Firebase üzerinden sıfırlama bağlantısı gönderiyor. Giriş yaptığımda da az önce anlattığım korumalı yönlendirme devreye giriyor ve beni doğrudan ana uygulamaya alıyor."

## Sahne 7 — Kapanış (3:40 – 3:55)
**🎬 Ne göstereceksin:** Editörde proje klasör ağacını (`app`, `services`, `context`, `firebaseConfig`) genel olarak göster.
**🎤 Ne söyleyeceksin:**
"Özetle bu hafta; Expo Router ile navigasyon mimarisini kurdum, Firebase'i bağladım, veritabanı servis katmanını ve veri tiplerini yazdım, ve giriş–kayıt akışını korumalı yönlendirmeyle tamamladım. Artık üzerine özellik ekleyebileceğim sağlam bir temel var. Bir sonraki videoda tasarım ve arayüze geçiyorum — görüşmek üzere, izlediğiniz için teşekkürler!"

---

## 🎬 Çekim İpuçları (Hafta 1'e özel)
- **Demo önce, kod sonra:** İstersen Sahne 6'daki canlı demoyu en başta kısa bir "önizleme" olarak da gösterip sonra "şimdi bunu nasıl yaptığımı anlatayım" diyebilirsin — izleyici bağlamı daha iyi kuruyor.
- **Tempo:** Kodun her satırını okuma; sadece işaret edip ne işe yaradığını söyle.
- **Kayıt sırası:** Uygulama demolarını ayrı, kod gösterimlerini ayrı çekip sonra birleştir — daha az hata çıkar.
- **Köprü cümleleri:** Her sahne sonunda "şimdi şuna bakalım" gibi kısa bir geçiş cümlesi kullan; video akıcı olur.
- **Gizlilik:** `firebaseConfig.ts`'i gösterirken API anahtarlarının çok net/uzun süre ekranda kalmamasına dikkat et (mümkünse kısa göster veya bulanıklaştır).
