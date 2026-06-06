# Kamu Köprüsü - 10 Haftalık Geliştirme Planı

Proje klasörünü inceledim ve geride bıraktığınız 2 haftalık süreçte **çok ciddi bir ilerleme** kaydettiğinizi gördüm. Expo Router yapısını, Firebase servislerini ve temel sayfaları başarıyla oluşturmuşsunuz. 

Aşağıda şu ana kadar **tamamlananları** ve önümüzdeki **8 hafta boyunca yapacaklarımızı** içeren güncellenmiş yol haritası bulunmaktadır.

---

## ✅ Tamamlananlar (İlk 2 Hafta)
Şu ana kadar kod tabanında (codebase) aşağıdaki özellikler başarıyla inşa edilmiş:
- **Proje Altyapısı:** Expo Router ile `app/` dizini tabanlı modern navigasyon (`_layout.tsx`) mimarisi kurulmuş.
- **Firebase ve Veritabanı:** `firebaseConfig.ts` oluşturulmuş ve `firestoreService.ts` içerisinde *Users, Institutions, Complaints, Badges* koleksiyonları için CRUD işlemleri tanımlanmış.
- **Kimlik Doğrulama (Auth Stack):** Firebase Auth kullanılarak Context API (`AuthContext.tsx`) üzerinden oturum yönetimi sağlanmış. `login.tsx`, `register.tsx`, `forgot-password.tsx` ekranları kodlanmış.
- **Vatandaş Modülü (Citizen Stack):** Tab navigasyonu içinde `index.tsx`, `create-complaint.tsx` (şikayet oluşturma), `my-complaints.tsx` (şikayetlerim) ve `profile.tsx` ekranlarının temel iskeletleri çıkarılmış.
- **Şikayet Detayı:** `complaint-detail.tsx` sayfası eklenerek bireysel şikayet inceleme altyapısı hazırlanmış.

---

## 📅 Yapılacaklar (Önümüzdeki 8 Hafta)

### ✅ Hafta 3: UI/UX İyileştirmeleri ve Tasarımın Güzelleştirilmesi (Tamamlandı)
- [x] Uygulama genelinde modern, canlı ve cam (glassmorphism) efektlerine sahip bir UI tasarım sisteminin (Design System) oturtulması.
- [x] React Native Reanimated ile dokunma ve sayfa geçişlerine mikro-animasyonların (micro-animations) eklenmesi.
- [x] Kullanıcı deneyimini artırmak için Dark/Light tema geçişlerinin pürüzsüzleştirilmesi.

### ✅ Hafta 4: State Management (Redux Toolkit) Geçişi (Tamamlandı)
- [x] Proje yönergesinde de istenen **Redux Toolkit**'in projeye dahil edilmesi.
- [x] Şikayet listelerinin (örneğin filtreleme verilerinin) ve kurum verilerinin Redux Store içerisine taşınması.
- [x] Context API ile Redux'ın iş bölümünün yapılması (Örn: Sadece oturum Context'te kalırken, veriler Redux'a geçebilir).

### ✅ Hafta 5: Kurum ve Moderatör Panellerinin Detaylandırılması (Tamamlandı)
- [x] Kullanıcı rolüne (Vatandaş / Kurum) göre farklı Home/Dashboard ekranlarının gösterilmesi. (`app/(tabs)/index.tsx` rol bazlı yönlendirme yapıyor; personel rolleri `StaffDashboard`'a, vatandaş `CitizenHome`'a düşüyor.)
- [x] Kurum yetkilileri için "Şikayet Yönetim Paneli" (Institution Dashboard) ekranının kodlanması. (`components/StaffDashboard.tsx`: istatistik kartları, durum filtreleri ve şikayet listesi.)
- [x] Şikayet durumlarının (İşleme Alındı, Çözüldü vb.) Kurum yetkilisi tarafından güncellenmesi ve `ComplaintUpdates` loglarının arayüze bağlanması. (`complaint-detail.tsx` durum güncelleme + "Süreç Geçmişi" timeline; `firestoreService.updateComplaintStatus`.)

### Hafta 6: Oyunlaştırma (Gamification) ve Rozet (Badge) Sistemi
- [ ] `firestoreService.ts` içindeki `calculateLevel` mantığının Profile ekranında görsel bir İlerleme Çubuğu (Progress Bar) ile gösterilmesi.
- [ ] Şikayetleri çözüldüğünde vatandaşa XP (deneyim puanı) ekleyen mekanizmanın kurgulanması.
- [ ] Kazanılan rozetlerin (Badges) profil ekranında şık tasarımlarla (Örn: SVG ikonlar) listelenmesi.

### Hafta 7: Harita ve Konum Entegrasyonu
- [ ] `react-native-maps` paketinin kurularak şikayetlerin harita üzerinde pin (işaretçi) olarak gösterilmesi.
- [ ] Şikayet oluşturulurken cihazın GPS konumunun (Location API) otomatik alınması ve Ters Coğrafi Kodlama (Reverse Geocoding) ile açık adrese çevrilmesi.

### Hafta 8: Anlık Bildirimler (Push Notifications)
- [ ] Expo Notifications veya Firebase Cloud Messaging (FCM) entegrasyonu.
- [ ] Şikayet durumu güncellendiğinde (Örn: "Şikayetiniz çözüldü!") vatandaşa anlık bildirim (Push Notification) gönderilmesi.
- [ ] Uygulama içi bildirim (In-app notifications) merkezinin oluşturulması.

### Hafta 9: Performans Optimizasyonu ve Medya Yönetimi
- [ ] Firebase Storage'a yüklenen görsel/medyaların sıkıştırılarak (Image Compression) optimize edilmesi.
- [ ] Liste sayfalarında (`FlatList`) pagination (sayfalama) ve "Pull to Refresh" (çekerek yenileme) eklenmesi.
- [ ] Firestore Offline Persistence (çevrimdışı veri erişimi) ayarlarının yapılması.

### Hafta 10: Testler, Hata Ayıklama ve Deployment (Yayınlama)
- [ ] Kritik fonksiyonlar (örneğin Firestore servisleri) için temel birim (unit) testlerinin yazılması.
- [ ] Expo Application Services (EAS) kurularak uygulamanın Android (.apk/.aab) ve iOS için derlenmesi (build).
- [ ] Uçtan uca son testlerin yapılması ve projenin tamamen bitirilmesi.

## Mevcut Durum
Hafta 3, Hafta 4 ve Hafta 5 görevleri başarıyla tamamlandı. Sıradaki hedef **Hafta 6: Oyunlaştırma (Gamification) ve Rozet (Badge) Sistemi**.
