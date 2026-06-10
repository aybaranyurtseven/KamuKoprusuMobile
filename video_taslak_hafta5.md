# 🎥 Kamu Köprüsü — Hafta 5 Video Taslağı

> **Konu:** Kurum ve Moderatör Panelleri, Rol Bazlı Deneyim ve Durum Yönetimi
> **Hedef süre:** ~4 dakika
> **Ton:** Samimi, anlatıcı; "ne yaptım ve neden" anlatan.
>
> Format: Her sahnede **🎬 Ne göstereceksin** (ekran) ve **🎤 Ne söyleyeceksin** (anlatım) ayrı.
> Anlatım metnini kelimesi kelimesine okuma; kendi cümlelerinle akıt.

**Ana mesaj (tek cümle):**
"Bu hafta uygulamayı tek tip kullanıcıdan çıkardım: artık kullanıcının rolüne göre farklı ekranlar gösteriliyor. Kurum yetkilileri için bir şikayet yönetim paneli kodladım ve yetkililerin şikayet durumunu güncelleyip vatandaşa süreç geçmişi olarak yansıtmasını sağladım."

---

## ✅ Çekim Öncesi Kontrol Listesi
- [ ] Editörde yazı tipini büyüt (Ctrl + "+").
- [ ] Açık tutulacak dosyalar hazır: `app/(tabs)/index.tsx`, `components/StaffDashboard.tsx`, `services/firestoreService.ts`, `app/complaint-detail.tsx`, `context/AuthContext.tsx`.
- [ ] **İki test hesabı** hazır: (1) bir vatandaş, (2) bir kurum temsilcisi/moderatör (`role` ve `institutionId` alanları Firestore'da tanımlı).
- [ ] Aynı kuruma ait en az birkaç şikayet veritabanında dursun ki panel ve filtreler dolu görünsün.
- [ ] Demo akışını bir kez prova et: kurum hesabıyla durum güncelle → vatandaş hesabıyla süreç geçmişinde gör.
- [ ] Bildirimleri sessize al, ekranı temizle.

---

## Sahne 1 — Açılış (0:00 – 0:25)
**🎬 Ne göstereceksin:** Uygulama açık, vatandaş ana sayfası görünüyor.
**🎤 Ne söyleyeceksin:**
"Merhaba, Kamu Köprüsü'nün beşinci hafta videosu. Şimdiye kadar herkes aynı ekranları görüyordu. Bu hafta rol kavramını devreye soktum: vatandaş bir şey görüyor, kurum yetkilisi bambaşka bir yönetim paneli görüyor. Ayrıca yetkililer artık şikayetlerin durumunu güncelleyebiliyor. Sırayla gösteriyorum."

## Sahne 2 — Rol Bazlı Yönlendirme (0:25 – 1:05)
**🎬 Ne göstereceksin:** `app/(tabs)/index.tsx`'i aç; en üstteki `HomeScreen` fonksiyonunu göster — `userData.role` kontrol edilip personel rolündeyse `StaffDashboard`, değilse `CitizenHome` döndürülüyor. Kısaca `context/AuthContext.tsx`'te kullanıcının `role` ve `institutionId` alanlarının Firestore'dan geldiğini göster.
**🎤 Ne söyleyeceksin:**
"İşin kalbi burada. Ana sayfa artık tek bir ekran değil; bir yönlendirici. Giriş yapan kullanıcının rolüne bakıyorum — bu bilgi `AuthContext` üzerinden Firestore'daki kullanıcı kaydından geliyor. Kullanıcı kurum temsilcisi, moderatör ya da yönetici ise yönetim panelini gösteriyorum; sıradan bir vatandaşsa kendi ana sayfasını. Yani aynı kod, role göre farklı bir deneyim sunuyor."

## Sahne 3 — Kurum / Moderatör Paneli (1:05 – 1:55)
**🎬 Ne göstereceksin:** `components/StaffDashboard.tsx`'i aç. Üstte istatistik kartlarını (Bekleyen / İşlemde / Çözülen), filtre çiplerini ve şikayet listesini göster. İstersen kod tarafında `counts` ve `filtered` `useMemo`'larına işaret et.
**🎤 Ne söyleyeceksin:**
"Yönetim panelini `StaffDashboard` bileşeninde topladım. Tepede üç özet kart var: bekleyen, işlemde ve çözülen şikayet sayıları. Altında filtre çipleri — yetkili tek dokunuşla sadece bekleyenleri ya da çözülenleri görebiliyor. Bu sayıları ve filtrelenmiş listeyi `useMemo` ile hesaplıyorum; yani liste her değiştiğinde gereksiz yere yeniden hesaplanmıyor. Her kartta şikayetin başlığı, kategorisi, vatandaşın adı — anonimse 'Anonim' — ve durumu görünüyor."

## Sahne 4 — Veri Katmanı: Doğru Şikayetleri Çekmek (1:55 – 2:35)
**🎬 Ne göstereceksin:** `services/firestoreService.ts`'te `getInstitutionComplaints` ve `getAllComplaints` fonksiyonlarını göster. `onSnapshot`'taki başarı ve hata callback'lerine işaret et. İstersen `StaffDashboard`'a dönüp kurum atanmamış kullanıcı için gösterilen bilgilendirici boş durum ekranını da göster.
**🎤 Ne söyleyeceksin:**
"Panel hangi şikayetleri gösterecek? Burada iki ayrı sorgum var. Kurum temsilcisi giriş yaptıysa `getInstitutionComplaints` ile sadece kendi kurumuna gelen şikayetleri çekiyorum. Moderatör veya yönetici ise `getAllComplaints` ile tüm şikayetleri. İkisi de `onSnapshot` kullanıyor, yani veri canlı; yeni bir şikayet geldiğinde panel anında güncelleniyor. Her ikisine de bir hata callback'i ekledim, böylece bir sorun olsa bile ekran sonsuza kadar dönmüyor. Ayrıca bir yetkiliye henüz kurum atanmamışsa onu boş bir listeyle baş başa bırakmıyorum; 'hesabınıza henüz kurum atanmamış' diye açıklayıcı bir ekran gösteriyorum."

## Sahne 5 — Durum Güncelleme ve Süreç Kaydı (2:35 – 3:20)
**🎬 Ne göstereceksin:** `app/complaint-detail.tsx`'i aç. `canManage` kontrolünü (rol + kurum eşleşmesi) göster. Sonra "Durumu Güncelle" bölümünü — durum seçenekleri, not alanı ve buton. `handleUpdateStatus` içinde `updateComplaintStatus` çağrısını göster. `services/firestoreService.ts`'te `updateComplaintStatus`'ın hem şikayeti güncelleyip hem `ComplaintUpdates` koleksiyonuna log eklediğini göster.
**🎤 Ne söyleyeceksin:**
"Şimdi en önemli kısım: durum güncelleme. Şikayet detayında önce yetki kontrolü yapıyorum — `canManage`. Kullanıcı moderatör mü, ya da şikayetin ait olduğu kurumun temsilcisi mi? Sadece bu durumda güncelleme arayüzü görünüyor; vatandaşa hiç gösterilmiyor. Yetkili yeni durumu seçip isteğe bağlı bir not yazıyor ve `updateComplaintStatus`'ı çağırıyorum. Bu fonksiyonun güzel tarafı: aynı anda hem şikayetin durumunu değiştiriyor, hem de `ComplaintUpdates` koleksiyonuna bir kayıt düşüyor. Yani her durum değişikliği bir geçmiş kaydına dönüşüyor."

## Sahne 6 — Canlı Demo (3:20 – 4:00)
**🎬 Ne göstereceksin:** Kurum/moderatör hesabıyla giriş yap; yönetim paneli açılsın. Bir şikayete dokun, detayda durumu "İşlemde" yap ve kısa bir not ekle, güncelle. Ardından vatandaş hesabıyla aynı şikayeti aç ve "Süreç Geçmişi"nde bu güncellemenin göründüğünü göster.
**🎤 Ne söyleyeceksin:**
"Gerçekte görelim. Kurum hesabıyla girdiğimde doğrudan yönetim paneli açılıyor. Bir şikayeti seçiyorum, durumunu 'İşlemde' yapıp bir not bırakıyorum ve güncelliyorum. Üstteki durum etiketi anında değişti. Şimdi vatandaş tarafına geçtiğimde, aynı şikayetin 'Süreç Geçmişi' bölümünde bu güncelleme bir zaman çizelgesi olarak görünüyor. Yani vatandaş şikayetinin hangi aşamada olduğunu canlı takip edebiliyor."

## Sahne 7 — Kapanış (4:00 – 4:10)
**🎬 Ne göstereceksin:** Yönetim paneli ve şikayet detayını arka arkaya göster.
**🎤 Ne söyleyeceksin:**
"Özetle bu hafta; rol bazlı yönlendirmeyi kurdum, kurum ve moderatör için yönetim panelini kodladım ve durum güncelleme ile süreç geçmişini uçtan uca bağladım. Artık uygulama gerçek bir şikayet yönetim akışına sahip. Bir sonraki hafta oyunlaştırma ve rozet sistemine geçiyorum. İzlediğiniz için teşekkürler!"

---

## 🎬 Çekim İpuçları (Hafta 5'e özel)
- **İki hesap kritik:** Bu videonun can damarı vatandaş ↔ yetkili karşılaştırması. Geçişi pürüzsüz yapmak için iki cihaz/emülatör yan yana ya da iki ayrı kayıt + montaj kullan.
- **Canlı güncellemeyi vurgula:** Durumu güncelledikten sonra diğer hesapta otomatik değiştiğini gösterirsen `onSnapshot`'ın gücü görsel olarak anlaşılıyor.
- **Demo önce, kod sonra:** İstersen Sahne 6'yı kısa bir önizleme olarak en başa koyup sonra koda inebilirsin.
- **Tempo:** Kodun her satırını okuma; sadece işaret edip ne işe yaradığını söyle.
- **Köprü cümleleri:** Her sahne sonunda kısa bir geçiş cümlesiyle akışı koru.
