# Kamu Köprüsü – Video Senaryoları (Hafta 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 & 15)

> Format: Her video **2–4 dakika**, samimi/anlatıcı ton.
> Her sahnede **🎬 Ne göstereceksin** (ekran) ve **🎤 Ne söyleyeceksin** (anlatım) ayrı veriliyor.
> Anlatım metinlerini kelimesi kelimesine okumak zorunda değilsin; kendi cümlelerinle akıt.

---

## 🎥 VIDEO — Hafta 1: Proje Temeli, Veritabanı ve Kimlik Doğrulama

**Hedef süre:** ~3.5 dakika
**Ana mesaj:** "Bu hafta projenin temelini attım: Expo Router ile modern bir navigasyon mimarisi kurdum, Firebase'i bağladım, veritabanı işlemlerini tek bir servis katmanında topladım ve kullanıcıların giriş yapıp kayıt olabildiği kimlik doğrulama akışını tamamladım."

### Sahne 1 — Açılış ve Proje Tanıtımı (0:00 – 0:25)
**🎬 Ne göstereceksin:** Uygulama açık, **Giriş Yap** (login) ekranı görünüyor.
**🎤 Ne söyleyeceksin:**
"Merhaba, bu Kamu Köprüsü projemin ilk hafta videosu. Kamu Köprüsü, vatandaşların kamu kurumlarına şikayet ve önerilerini iletebildiği bir mobil uygulama. Bu ilk haftada görsel tasarıma değil, projenin sağlam temeline odaklandım: navigasyon yapısı, veritabanı bağlantısı ve kullanıcı giriş sistemi. Şimdi sırayla neler kurduğumu göstereyim."

### Sahne 2 — Klasör Yapısı ve Expo Router (0:25 – 1:05)
**🎬 Ne göstereceksin:** Editörde `app/` dizinini aç; `(auth)` ve `(tabs)` klasörlerini, içlerindeki `_layout.tsx` dosyalarını göster. Kısaca `app/_layout.tsx` (kök) dosyasını da göster.
**🎤 Ne söyleyeceksin:**
"Navigasyon için Expo Router'ı seçtim; dosya tabanlı bir yapı, yani klasör ve dosya isimleri doğrudan ekran yollarına dönüşüyor. İki ana grubum var: `(auth)` giriş–kayıt ekranlarını, `(tabs)` ise giriş yaptıktan sonraki sekmeli ana uygulamayı tutuyor. Her grubun kendi `_layout.tsx` düzen dosyası var. Bu parantezli klasörler URL'de görünmüyor, sadece ekranları mantıksal olarak gruplamama yarıyor."

### Sahne 3 — Firebase Bağlantısı (1:05 – 1:45)
**🎬 Ne göstereceksin:** `firebaseConfig.ts` dosyasını aç. `initializeApp`, `initializeAuth` (AsyncStorage persistence ile) ve dışa aktarılan `auth`, `db`, `storage` satırlarını göster.
**🎤 Ne söyleyeceksin:**
"Arka uç için Firebase kullanıyorum. `firebaseConfig.ts` dosyasında uygulamayı başlatıyorum ve üç servisi dışa aktarıyorum: kimlik doğrulama için `auth`, veritabanı için `db` yani Firestore, ve dosya yükleme için `storage`. Önemli bir nokta: girişin cihazda kalıcı olması için auth'u AsyncStorage tabanlı persistence ile başlattım — yani uygulamayı kapatıp açınca kullanıcı tekrar giriş yapmak zorunda kalmıyor."

### Sahne 4 — Veritabanı Servis Katmanı (1:45 – 2:30)
**🎬 Ne göstereceksin:** `services/firestoreService.ts` dosyasını aç. Bölüm başlıklarını (`USER SERVICES`, `INSTITUTION SERVICES`, `COMPLAINT SERVICES`) kaydırarak göster; `getUserData`, `getInstitutions`, `createComplaint` gibi birkaç fonksiyona işaret et. `types/firestore.ts`'i kısaca açıp `Complaint` ve `UserData` tiplerini göster.
**🎤 Ne söyleyeceksin:**
"Veritabanı işlemlerini ekranların içine dağıtmak yerine tek bir yerde topladım: `firestoreService.ts`. Burada Users, Institutions, Complaints ve Badges koleksiyonları için okuma–yazma fonksiyonlarım var. Örneğin `getUserData` kullanıcı bilgisini çekiyor, `createComplaint` yeni şikayet ekliyor. Ayrıca `types/firestore.ts` dosyasında tüm veri tiplerini tanımladım; böylece TypeScript sayesinde yanlış alan kullanırsam daha kod yazarken uyarı alıyorum."

### Sahne 5 — Kimlik Doğrulama ve Korumalı Yönlendirme (2:30 – 3:10)
**🎬 Ne göstereceksin:** `context/AuthContext.tsx`'i aç; `onAuthStateChanged` ile oturumun dinlendiği yeri göster. Sonra `app/_layout.tsx`'e geç; `useEffect` içindeki "kullanıcı yoksa login'e, varsa tabs'a yönlendir" mantığını göster.
**🎤 Ne söyleyeceksin:**
"Oturum yönetimini `AuthContext` ile yapıyorum. Firebase'in `onAuthStateChanged` dinleyicisi sayesinde kullanıcı giriş veya çıkış yaptığında uygulama anında haberdar oluyor ve kullanıcının bilgilerini Firestore'dan çekiyorum. Kök `_layout.tsx`'te ise korumalı yönlendirme var: giriş yapmamış biri uygulamanın içine girmeye çalışırsa otomatik olarak giriş ekranına, giriş yapmış biri de doğrudan ana uygulamaya yönlendiriliyor. Yani izinsiz erişim engelleniyor."

### Sahne 6 — Auth Ekranları (Canlı Demo) (3:10 – 3:40)
**🎬 Ne göstereceksin:** Uygulamaya geç. Giriş ekranını göster, sonra **Kayıt Ol**'a tıklayıp kayıt ekranını (Ad Soyad, E-posta, Şifre), ardından **Şifremi Unuttum**'a tıklayıp şifre sıfırlama ekranını göster. Mümkünse gerçek bir hesapla giriş yapıp ana ekrana düştüğünü göster.
**🎤 Ne söyleyeceksin:**
"Şimdi gerçekte görelim. Üç ekranım var: Giriş Yap, Kayıt Ol ve Şifre Sıfırlama. Kayıt ekranında ad, e-posta ve şifre alıyorum; şifremi unuttum ekranı ise Firebase üzerinden sıfırlama bağlantısı gönderiyor. Giriş yaptığımda da az önce anlattığım korumalı yönlendirme devreye giriyor ve beni doğrudan ana uygulamaya alıyor."

### Sahne 7 — Kapanış (3:40 – 3:50)
**🎬 Ne göstereceksin:** Editörde proje klasör ağacını (app, services, context, firebaseConfig) genel olarak göster.
**🎤 Ne söyleyeceksin:**
"Özetle bu hafta; Expo Router ile navigasyon mimarisini kurdum, Firebase'i bağladım, veritabanı servis katmanını ve veri tiplerini yazdım, ve giriş–kayıt akışını korumalı yönlendirmeyle tamamladım. Artık üzerine özellik ekleyebileceğim sağlam bir temel var. Bir sonraki videoda görüşmek üzere, izlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 1 — Hafta 3: Tasarım ve Arayüz İyileştirmeleri

**Hedef süre:** ~3 dakika
**Ana mesaj:** "Bu hafta uygulamaya modern, canlı, cam efektli bir tasarım dili kazandırdım; geçişlere animasyon ekledim ve karanlık/aydınlık tema desteğini oturttum."

### Sahne 1 — Açılış (0:00 – 0:20)
**🎬 Ne göstereceksin:** Uygulama açık, ana akış görünüyor (telefon ya da emülatör ekranı).
**🎤 Ne söyleyeceksin:**
"Merhaba, bu Kamu Köprüsü projemin üçüncü hafta videosu. Bu hafta tamamen arayüz ve kullanıcı deneyimine odaklandım. Amacım, uygulamayı sıradan bir formdan modern, canlı ve profesyonel görünen bir uygulamaya dönüştürmekti. Şimdi neler yaptığımı tek tek göstereyim."

### Sahne 2 — Tasarım Sistemi / Renk Paleti (0:20 – 1:00)
**🎬 Ne göstereceksin:** `constants/theme.ts` dosyasını aç. `Colors` nesnesindeki `light` ve `dark` bloklarını göster, kaydırarak `primary`, `secondary`, `card`, `glass` gibi değerlere işaret et.
**🎤 Ne söyleyeceksin:**
"Önce tek bir tasarım sistemi kurdum. Bütün renkleri tek bir yerde, `theme.ts` içinde topladım. Burada hem aydınlık hem karanlık tema için ayrı renk paletim var: modern bir mavi ana renk, mor bir ikincil renk, başarı–uyarı–hata renkleri… Önemli kısım şu: kartlar için yarı saydam 'glass' renkleri tanımladım. Artık ekranlarda renk kodunu elle yazmıyorum, hep bu merkezi paletten çekiyorum. Bu da hem tutarlılık sağlıyor hem de tema değiştirmeyi çok kolaylaştırıyor."

### Sahne 3 — Cam Efekti (Glassmorphism) (1:00 – 1:40)
**🎬 Ne göstereceksin:** `components/ui/GlassCard.tsx` dosyasını aç; `BlurView`, `intensity` ve `tint` satırlarını göster. Sonra uygulamaya dönüp "Şikayetlerim" ekranındaki kart tasarımını göster (kartların arkasının bulanık/cam göründüğü yer).
**🎤 Ne söyleyeceksin:**
"Tasarımın yıldızı bu `GlassCard` bileşeni. `expo-blur` kütüphanesinin `BlurView`'ını kullanarak gerçek bir cam efekti, yani glassmorphism elde ettim. Bileşene `intensity` veriyorum, bulanıklık miktarını ayarlıyorum; `tint` ise temaya göre otomatik olarak açık ya da koyu oluyor. Şimdi uygulamada görelim — şikayet kartlarının arka planı yumuşak, bulanık ve derinlikli görünüyor. Tek tek her kartta bu efekti tekrar yazmıyorum; sadece `GlassCard` ile sarmalıyorum."

### Sahne 4 — Mikro Animasyonlar (Reanimated) (1:40 – 2:25)
**🎬 Ne göstereceksin:** `components/ui/AnimatedButton.tsx` dosyasını aç; `useSharedValue`, `withSpring(0.95)` ve `useAnimatedStyle` satırlarını göster. Sonra uygulamada bir butona basıp bırakırken (örn. "Giriş Yap" veya "Şikayeti Gönder") butonun hafifçe küçülüp geri yaylanmasını göster.
**🎤 Ne söyleyeceksin:**
"Sonra dokunsal his için animasyon ekledim. `react-native-reanimated` ile `AnimatedButton` adında bir buton bileşeni yaptım. Butona basıldığında bir 'shared value' ile ölçeği 0.95'e indiriyorum, bırakınca yay efektiyle, yani `withSpring` ile eski boyutuna dönüyor. İzleyin — basınca buton hafifçe içeri çöküyor, bırakınca zıplayarak geri geliyor. Ayrıca yükleme durumunda otomatik olarak spinner gösteriyor ve pasifken soluklaşıyor. Bu küçük detaylar uygulamayı çok daha canlı hissettiriyor."

### Sahne 5 — Karanlık / Aydınlık Tema (2:25 – 2:50)
**🎬 Ne göstereceksin:** Cihazın/emülatörün sistem temasını karanlıktan aydınlığa (veya tersi) değiştir; uygulamanın renklerinin, kartların ve metinlerin anında uyum sağladığını göster.
**🎤 Ne söyleyeceksin:**
"Son olarak karanlık ve aydınlık tema geçişlerini pürüzsüzleştirdim. `useColorScheme` hook'u sayesinde uygulama cihazın temasını otomatik algılıyor. Bakın, temayı değiştirdiğimde arka plan, kartlar, metin renkleri… hepsi anında ve uyumlu şekilde değişiyor. Çünkü her şey o merkezi renk paletinden besleniyor."

### Sahne 6 — Kapanış (2:50 – 3:00)
**🎬 Ne göstereceksin:** Uygulamada birkaç ekran arasında hızlıca gezin.
**🎤 Ne söyleyeceksin:**
"Özetle bu hafta; merkezi bir tasarım sistemi, cam efektli kartlar, dokunma animasyonları ve tam tema desteği ekledim. Bir sonraki videoda durum yönetimini Redux Toolkit'e taşıyacağım. İzlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 2 — Hafta 4: Redux Toolkit ile Durum Yönetimi

**Hedef süre:** ~3.5 dakika
**Ana mesaj:** "Bu hafta uygulamanın verilerini bileşenlerin içinden çıkarıp merkezi bir Redux store'a taşıdım; oturum yönetimi Context'te kalırken veri yönetimi Redux'a geçti."

### Sahne 1 — Açılış ve "Neden?" (0:00 – 0:30)
**🎬 Ne göstereceksin:** Uygulama açık; "Yeni Şikayet" ve "Şikayetlerim" ekranlarını kısaca göster.
**🎤 Ne söyleyeceksin:**
"Merhaba, bu da dördüncü hafta videosu. Bu hafta proje yönergesinde de istenen Redux Toolkit'i projeye ekledim. Neden? Çünkü kurum listesi, şikayet verileri gibi bilgiler birden fazla ekranda lazım oluyordu. Bunları her ekranda ayrı ayrı tutmak yerine, tek bir merkezi 'store'da toplamak çok daha temiz. Şimdi nasıl kurguladığımı göstereyim."

### Sahne 2 — Store Kurulumu (0:30 – 1:10)
**🎬 Ne göstereceksin:** `store/index.ts` dosyasını aç. `configureStore`, `reducer` içindeki `complaints` ve `institutions` satırlarını, ve alttaki `useAppDispatch` / `useAppSelector` tanımlarını göster.
**🎤 Ne söyleyeceksin:**
"İşte merkez: `store/index.ts`. `configureStore` ile store'u oluşturdum ve içine iki tane 'slice' bağladım — biri şikayetler, biri kurumlar için. Firebase'in zaman damgası nesnelerinde sorun çıkmasın diye serileştirme kontrolünü kapattım. Ayrıca tip güvenli kullanmak için kendi `useAppDispatch` ve `useAppSelector` hook'larımı tanımladım; ekranlarda hep bunları kullanıyorum."

### Sahne 3 — Slice'lar (Dilimler) (1:10 – 2:00)
**🎬 Ne göstereceksin:** Önce `store/slices/complaintsSlice.ts` — `initialState` ve `setComplaints`, `setFilter` reducer'larını göster. Sonra `store/slices/institutionsSlice.ts` — `fetchInstitutionsThunk` ve `extraReducers` içindeki `pending / fulfilled / rejected` durumlarını göster.
**🎤 Ne söyleyeceksin:**
"Şimdi slice'lara bakalım. `complaintsSlice` şikayetlerin listesini, yüklenme durumunu ve filtreyi tutuyor; `setComplaints` ve `setFilter` gibi basit aksiyonlarım var. `institutionsSlice` ise biraz daha gelişmiş: içinde bir 'thunk' var. `fetchInstitutionsThunk`, Firebase'den kurumları asenkron olarak çekiyor. Güzel tarafı, `extraReducers` ile bu işlemin üç durumunu da otomatik yönetiyorum — istek başlarken 'yükleniyor', başarılı olunca veriyi yaz, hata olursa hatayı kaydet. Yani yüklenme ve hata durumlarını elle takip etmeme gerek kalmıyor."

### Sahne 4 — Provider ve Context + Redux İş Bölümü (2:00 – 2:40)
**🎬 Ne göstereceksin:** `app/_layout.tsx` dosyasını aç; uygulamanın `<Provider store={store}>` ile sarmalandığını göster. Kısaca `context/AuthContext.tsx`'e geç ve oturumun (user) hâlâ burada yönetildiğini göster.
**🎤 Ne söyleyeceksin:**
"Redux'ı uygulamaya tanıtmak için tüm uygulamayı `_layout.tsx` içinde `Provider` ile sardım. Burada önemli bir tasarım kararı verdim: her şeyi Redux'a taşımadım. Oturum yönetimi, yani kullanıcının giriş–çıkış durumu hâlâ `AuthContext`'te. Veriler ise — şikayetler, kurumlar — Redux'ta. Yani net bir iş bölümü var: kimlik doğrulama Context'in, veri yönetimi Redux'ın işi."

### Sahne 5 — Ekranlarda Kullanımı (Canlı Demo) (2:40 – 3:20)
**🎬 Ne göstereceksin:** `app/(tabs)/create-complaint.tsx`'te `useEffect` içindeki `dispatch(fetchInstitutionsThunk())` ve `useAppSelector` ile `institutions` çekilen satırı göster. Sonra uygulamaya geç: "Yeni Şikayet" ekranında kurum seçiciyi aç (kurumların Redux'tan geldiği yer). Ardından "Şikayetlerim" ekranını aç, listenin Redux store'dan geldiğini anlat.
**🎤 Ne söyleyeceksin:**
"Şimdi gerçek kullanımda görelim. 'Yeni Şikayet' ekranı açıldığında `fetchInstitutionsThunk`'ı dispatch ediyorum; kurumlar Redux'a yükleniyor ve seçiciyi açtığımda buradan geliyorlar. 'Şikayetlerim' ekranında da şikayetleri Firebase'den dinleyip `setComplaints` ile store'a yazıyorum, liste de doğrudan store'dan okunuyor. Yani veri tek bir kaynaktan, merkezden akıyor."

### Sahne 6 — Kapanış (3:20 – 3:30)
**🎬 Ne göstereceksin:** Klasör yapısında `store/` dizinini göster (index + slices).
**🎤 Ne söyleyeceksin:**
"Özetle bu hafta; Redux Toolkit store'unu kurdum, şikayet ve kurum slice'larını yazdım, asenkron veri çekmeyi thunk ile yönettim ve Context ile Redux arasında temiz bir iş bölümü oluşturdum. Bir sonraki hafta kurum ve moderatör panellerini detaylandıracağım. İzlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 3 — Hafta 5: Kurum ve Moderatör Panelleri, Durum Yönetimi

**Hedef süre:** ~4 dakika
**Ana mesaj:** "Bu hafta uygulamayı tek tip kullanıcıdan çıkardım: artık kullanıcının rolüne göre farklı ekranlar gösteriliyor. Kurum yetkilileri için bir şikayet yönetim paneli kodladım ve yetkililerin şikayet durumunu güncelleyip vatandaşa süreç geçmişi olarak yansıtmasını sağladım."

### Sahne 1 — Açılış (0:00 – 0:25)
**🎬 Ne göstereceksin:** Uygulama açık, vatandaş ana sayfası görünüyor.
**🎤 Ne söyleyeceksin:**
"Merhaba, Kamu Köprüsü'nün beşinci hafta videosu. Şimdiye kadar herkes aynı ekranları görüyordu. Bu hafta rol kavramını devreye soktum: vatandaş bir şey görüyor, kurum yetkilisi bambaşka bir yönetim paneli görüyor. Ayrıca yetkililer artık şikayetlerin durumunu güncelleyebiliyor. Sırayla gösteriyorum."

### Sahne 2 — Rol Bazlı Yönlendirme (0:25 – 1:05)
**🎬 Ne göstereceksin:** `app/(tabs)/index.tsx`'i aç; en üstteki `HomeScreen` fonksiyonunu göster — `userData.role` kontrol edilip personel rolündeyse `StaffDashboard`, değilse `CitizenHome` döndürülüyor. Kısaca `context/AuthContext.tsx`'te kullanıcının `role` ve `institutionId` alanlarının Firestore'dan geldiğini göster.
**🎤 Ne söyleyeceksin:**
"İşin kalbi burada. Ana sayfa artık tek bir ekran değil; bir yönlendirici. Giriş yapan kullanıcının rolüne bakıyorum — bu bilgi `AuthContext` üzerinden Firestore'daki kullanıcı kaydından geliyor. Eğer kullanıcı kurum temsilcisi, moderatör ya da yönetici ise yönetim panelini gösteriyorum; sıradan bir vatandaşsa kendi ana sayfasını. Yani aynı kod, role göre farklı deneyim sunuyor."

### Sahne 3 — Kurum / Moderatör Paneli (1:05 – 1:55)
**🎬 Ne göstereceksin:** `components/StaffDashboard.tsx`'i aç. Üstte istatistik kartlarını (Bekleyen / İşlemde / Çözülen), filtre çiplerini ve şikayet listesini göster. İstenirse kod tarafında `counts` ve `filtered` `useMemo`'larına işaret et.
**🎤 Ne söyleyeceksin:**
"Yönetim panelini `StaffDashboard` bileşeninde topladım. Tepede üç özet kart var: bekleyen, işlemde ve çözülen şikayet sayıları. Altında filtre çipleri — yetkili tek dokunuşla sadece bekleyenleri ya da çözülenleri görebiliyor. Bu sayıları ve filtrelenmiş listeyi `useMemo` ile hesaplıyorum; yani liste her değiştiğinde gereksiz yere yeniden hesaplanmıyor. Her kartta şikayetin başlığı, kategorisi, vatandaşın adı — anonimse 'Anonim' — ve durumu görünüyor."

### Sahne 4 — Veri Katmanı: Doğru Şikayetleri Çekmek (1:55 – 2:30)
**🎬 Ne göstereceksin:** `services/firestoreService.ts`'te `getInstitutionComplaints` ve `getAllComplaints` fonksiyonlarını göster. `onSnapshot`'taki başarı ve hata callback'lerine işaret et.
**🎤 Ne söyleyeceksin:**
"Panel hangi şikayetleri gösterecek? Burada iki ayrı sorgum var. Kurum temsilcisi giriş yaptıysa `getInstitutionComplaints` ile sadece kendi kurumuna gelen şikayetleri çekiyorum. Moderatör veya yönetici ise `getAllComplaints` ile tüm şikayetleri. İkisi de `onSnapshot` kullanıyor, yani veriler canlı; yeni bir şikayet geldiğinde panel anında güncelleniyor. Ayrıca her ikisine de bir hata callback'i ekledim, böylece bir sorun olsa bile ekran sonsuza kadar dönmüyor."

### Sahne 5 — Durum Güncelleme ve Süreç Kaydı (2:30 – 3:20)
**🎬 Ne göstereceksin:** `app/complaint-detail.tsx`'i aç. `canManage` kontrolünü (rol + kurum eşleşmesi) göster. Sonra "Durumu Güncelle" bölümünü — durum seçenekleri, not alanı ve butonu. `handleUpdateStatus` içinde `updateComplaintStatus` çağrısını göster. `firestoreService.ts`'te `updateComplaintStatus`'ın hem şikayeti güncelleyip hem `ComplaintUpdates` koleksiyonuna log eklediğini göster.
**🎤 Ne söyleyeceksin:**
"Şimdi en önemli kısım: durum güncelleme. Şikayet detayında önce yetki kontrolü yapıyorum — `canManage`. Kullanıcı moderatör mü, ya da şikayetin ait olduğu kurumun temsilcisi mi? Sadece bu durumda güncelleme arayüzü görünüyor; vatandaşa hiç gösterilmiyor. Yetkili yeni durumu seçip isteğe bağlı bir not yazıyor ve `updateComplaintStatus`'ı çağırıyorum. Bu fonksiyonun güzel tarafı: aynı anda hem şikayetin durumunu değiştiriyor, hem de `ComplaintUpdates` koleksiyonuna bir kayıt düşüyor. Yani her durum değişikliği bir geçmiş kaydına dönüşüyor."

### Sahne 6 — Canlı Demo (3:20 – 4:00)
**🎬 Ne göstereceksin:** Kurum/moderatör hesabıyla giriş yap; yönetim paneli açılsın. Bir şikayete dokun, detayda durumu "İşlemde" yap ve kısa bir not ekle, güncelle. Ardından (mümkünse vatandaş hesabıyla) aynı şikayeti aç ve "Süreç Geçmişi"nde bu güncellemenin göründüğünü göster.
**🎤 Ne söyleyeceksin:**
"Gerçekte görelim. Kurum hesabıyla girdiğimde doğrudan yönetim paneli açılıyor. Bir şikayeti seçiyorum, durumunu 'İşlemde' yapıp bir not bırakıyorum ve güncelliyorum. Üstteki durum etiketi anında değişti. Şimdi vatandaş tarafına geçtiğimde, aynı şikayetin 'Süreç Geçmişi' bölümünde bu güncelleme bir zaman çizelgesi olarak görünüyor. Yani vatandaş şikayetinin ne aşamada olduğunu canlı takip edebiliyor."

### Sahne 7 — Kapanış (4:00 – 4:10)
**🎬 Ne göstereceksin:** Yönetim paneli ve şikayet detayını yan yana (ya da arka arkaya) göster.
**🎤 Ne söyleyeceksin:**
"Özetle bu hafta; rol bazlı yönlendirmeyi kurdum, kurum ve moderatör için yönetim panelini kodladım ve durum güncelleme ile süreç geçmişini uçtan uca bağladım. Artık uygulama gerçek bir şikayet yönetim akışına sahip. Bir sonraki hafta oyunlaştırma ve rozet sistemine geçiyorum. İzlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 4 — Hafta 6: Oyunlaştırma ve Rozet Sistemi

**Hedef süre:** ~4 dakika
**Ana mesaj:** "Bu hafta uygulamaya hayat kattım: kullanıcılar artık şikayet oluşturdukça XP kazanıyor, seviye atlıyor ve koşulları sağladıkça otomatik rozetler açıyor. Bu mantığı tek bir oyunlaştırma servisinde topladım ve kazanımları canlı bir geri bildirim ekranıyla kullanıcıya gösterdim."

### Sahne 1 — Açılış ve "Neden?" (0:00 – 0:30)
**🎬 Ne göstereceksin:** Uygulama açık, vatandaş ana sayfasındaki Deneyim Puanı kartı ve seviye rozeti görünüyor.
**🎤 Ne söyleyeceksin:**
"Merhaba, Kamu Köprüsü'nün altıncı hafta videosu. Önceki haftalarda profilde XP ve rozet alanları vardı ama aslında sadece görünüyorlardı — arkada onları besleyen bir mantık yoktu. Bu hafta tam da bunu kurdum: vatandaşları katılıma teşvik eden gerçek bir oyunlaştırma sistemi. Şikayet oluştur, XP kazan, seviye atla, rozet aç. Nasıl çalıştığını göstereyim."

### Sahne 2 — Kurallar: XP ve Seviyeler (0:30 – 1:05)
**🎬 Ne göstereceksin:** `types/firestore.ts` dosyasını aç. `XP_REWARDS` (complaintCreated, withMedia, approvedComplaint, resolvedComplaint) ve `LEVEL_THRESHOLDS` (Bronze→Diamond) bloklarını göster.
**🎤 Ne söyleyeceksin:**
"Önce kuralları tek bir yerde tanımladım. `XP_REWARDS` her aksiyonun kaç puan ettiğini tutuyor: şikayet oluşturmak 10, fotoğraf eklemek 5 ek puan, moderatör onaylayınca 15, kurum çözünce 25 puan. `LEVEL_THRESHOLDS` ise puan aralıklarını seviyelere bağlıyor — Bronz, Gümüş, Altın, Platin, Elmas. Böylece tüm denge ayarları kodun tek bir noktasından yönetiliyor."

### Sahne 3 — Rozet Tanımları (Tek Doğruluk Kaynağı) (1:05 – 1:45)
**🎬 Ne göstereceksin:** `constants/badges.ts` dosyasını aç. `BADGE_DEFINITIONS` listesini kaydırarak göster; bir rozetin `icon`, `name` ve özellikle `check: (s) => s.totalComplaints >= 5` gibi `check` fonksiyonuna işaret et.
**🎤 Ne söyleyeceksin:**
"Rozetleri `badges.ts` içinde tanımladım ve burayı tek doğruluk kaynağı yaptım. Her rozetin bir ikonu, adı, açıklaması ve en önemlisi bir `check` fonksiyonu var. Bu fonksiyon kullanıcının istatistiklerine bakıp rozetin hak edilip edilmediğini söylüyor. Örneğin 'Aktif Vatandaş' rozeti toplam beş şikayete, 'Çözüm Ortağı' ilk çözülen şikayete, 'Gümüş Üye' ise yüz XP'ye bağlı. Yeni rozet eklemek için tek yapmam gereken bu listeye bir satır eklemek."

### Sahne 4 — Oyunlaştırma Motoru (1:45 – 2:40)
**🎬 Ne göstereceksin:** `services/gamificationService.ts` dosyasını aç. Sırayla `awardXp` (Firestore `increment` ve `calculateLevel` ile seviye yeniden hesabı), `getUserStats` (kullanıcının şikayetlerini sayar), `syncBadges` (koşulu sağlanan ama henüz kazanılmamış rozetleri `arrayUnion` ile ekler) ve `onComplaintCreated` fonksiyonlarını göster.
**🎤 Ne söyleyeceksin:**
"İşin beyni bu `gamificationService`. `awardXp` kullanıcıya puan ekliyor ve `increment` sayesinde yarış durumuna düşmeden, ardından seviyeyi yeniden hesaplıyor. `getUserStats` kullanıcının şikayetlerini çekip istatistik çıkarıyor. `syncBadges` ise bu istatistikleri rozet koşullarıyla karşılaştırıp yeni hak edilenleri ekliyor — daha önce kazanılmışları atlıyor, yani çift rozet vermiyor. En üstte `onComplaintCreated` bunların hepsini birleştiriyor: puanı ver, rozetleri değerlendir ve sonucu geri döndür. Ekranlar bu tek fonksiyonu çağırıyor, detayları bilmesine gerek yok."

### Sahne 5 — İdempotent Durum Ödülleri (2:40 – 3:10)
**🎬 Ne göstereceksin:** Aynı dosyada `rewardComplaintStatus` fonksiyonunu göster; `complaint.xpAwarded?.includes(status)` kontrolünü ve `arrayUnion(status)` satırını vurgula. Kısaca `app/complaint-detail.tsx`'te `handleUpdateStatus` içinde bu fonksiyonun çağrıldığı yeri göster.
**🎤 Ne söyleyeceksin:**
"Bir incelik var: kurum bir şikayeti çözünce puan, şikayeti yazan vatandaşa gitmeli. Bunu `rewardComplaintStatus` yapıyor. Ama yetkili aynı şikayeti birkaç kez güncellerse vatandaş aynı ödülü tekrar tekrar almamalı. Bunun için şikayetin üzerinde `xpAwarded` diye bir liste tutuyorum; bir ödül verildiyse oraya işliyorum ve bir daha vermiyorum. Yani sistem idempotent — kaç kez tetiklenirse tetiklensin sonuç aynı kalıyor."

### Sahne 6 — Canlı Demo: Kazanım Anı (3:10 – 3:50)
**🎬 Ne göstereceksin:** Uygulamada "Yeni Şikayet" oluştur, fotoğraf da ekle ve gönder. Açılan `RewardModal`'ı göster: "+15 XP", varsa seviye atlama ve yeni rozet kartları. Modalı kapat, Profil sekmesine geç; XP çubuğunun ilerlediğini ve rozetin artık "Kazanıldı" göründüğünü göster. (İstersen `components/ui/RewardModal.tsx`'i kısaca göster.)
**🎤 Ne söyleyeceksin:**
"Şimdi gerçekte görelim. Bir şikayet oluşturuyorum, fotoğraf da ekliyorum ve gönderiyorum. Bakın — karşıma bir tebrik ekranı çıkıyor: kazandığım XP, eğer seviye atladıysam o bilgi ve yeni açtığım rozet burada animasyonla beliriyor. Bu `RewardModal` bileşeni. Kapatıp profile gidiyorum; deneyim çubuğu ilerlemiş, rozetlerden biri artık 'Kazanıldı' rozetiyle aydınlanmış. Profil ekranı her açıldığında `useFocusEffect` ile verisini tazelediği için bu değişiklikler anında yansıyor."

### Sahne 7 — Kapanış (3:50 – 4:05)
**🎬 Ne göstereceksin:** Klasör yapısında yeni eklenenleri göster: `services/gamificationService.ts`, `constants/badges.ts`, `components/ui/RewardModal.tsx`.
**🎤 Ne söyleyeceksin:**
"Özetle bu hafta; merkezi bir oyunlaştırma servisi yazdım, XP ve seviye mantığını kurdum, koşula bağlı otomatik rozet sistemini ve idempotent ödülleri ekledim, hepsini de canlı bir geri bildirim ekranıyla taçlandırdım. Artık uygulama sadece şikayet toplamıyor, katılımı ödüllendiriyor. İzlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 5 — Hafta 7: Custom Hooks ile Temiz Mimari

**Hedef süre:** ~3.5 dakika
**Ana mesaj:** "Bu hafta tek satır görsel değişiklik yapmadan kodu çok daha temiz hale getirdim: ekranların içine dağılmış olan veritabanı iletişimini özel React hook'larına soyutladım ve tekrar eden sabitleri tek doğruluk kaynağına taşıdım."

### Sahne 1 — Açılış ve "Neden?" (0:00 – 0:30)
**🎬 Ne göstereceksin:** Bölünmüş ekran ya da hızlı geçişle iki dosyayı yan yana göster: `app/(tabs)/index.tsx` ve `app/(tabs)/my-complaints.tsx`. İkisinin de aynı `getUserComplaints` aboneliğini içerdiği eski hali (git geçmişi veya hafıza) hatırlat.
**🎤 Ne söyleyeceksin:**
"Merhaba, Kamu Köprüsü'nün yedinci hafta videosu. Bu hafta kullanıcı yeni bir özellik görmeyecek; ama kod tabanı çok daha profesyonel olacak. Çünkü bir sorunum vardı: aynı veritabanı kodu birden fazla ekranda kopyalanmıştı. Örneğin kullanıcının şikayetlerini dinleyen abonelik mantığı hem ana sayfada hem 'Şikayetlerim' ekranında birebir aynıydı. Proje yönergesinin de istediği gibi, bu backend diyalogunu özel React hook'larına taşıdım."

### Sahne 2 — Hook Klasörü (0:30 – 1:00)
**🎬 Ne göstereceksin:** `hooks/` klasörünü aç; yeni dosyaları göster: `useUserComplaints.ts`, `useUserData.ts`, `useComplaintDetail.ts`, `useStaffComplaints.ts`, `useInstitutions.ts`, `useCreateComplaint.ts`.
**🎤 Ne söyleyeceksin:**
"İşte yeni `hooks` klasörüm. Her bir hook, belirli bir veri ihtiyacını kapsüller. İsimlerinden ne yaptıkları anlaşılıyor: kullanıcının şikayetleri, profil verisi, tek bir şikayetin detayı, yetkili paneli verisi, kurum listesi ve şikayet oluşturma. Mantık artık ekranlarda değil, burada — tek bir yerde."

### Sahne 3 — Basit Bir Hook: useUserComplaints (1:00 – 1:40)
**🎬 Ne göstereceksin:** `hooks/useUserComplaints.ts`'i aç; `useEffect` içindeki `getUserComplaints` aboneliğini ve `return { complaints, loading, error }` satırını göster. Sonra `my-complaints.tsx`'e geç; ekranın artık sadece `const { complaints, loading } = useUserComplaints();` çağırdığını ve ne kadar kısaldığını göster.
**🎤 Ne söyleyeceksin:**
"En basit örnek bu. `useUserComplaints` hook'u Firebase aboneliğini kuruyor, gelen veriyi Redux'a yazıyor ve bana şikayetleri, yüklenme durumunu ve hatayı döndürüyor. Bakın 'Şikayetlerim' ekranı ne hale geldi — eskiden onlarca satırlık abonelik kodu vardı, şimdi tek satır. Aynı hook'u ana sayfa da kullanıyor; yani kopya kod tamamen ortadan kalktı."

### Sahne 4 — Canlı Dinleyiciler: useComplaintDetail & useStaffComplaints (1:40 – 2:20)
**🎬 Ne göstereceksin:** `hooks/useComplaintDetail.ts`'i aç; iki `onSnapshot` aboneliğini (şikayet + süreç geçmişi) ve temizlik fonksiyonunu göster. Sonra `app/complaint-detail.tsx`'in artık Firestore'u hiç import etmediğini, sadece `useComplaintDetail(id)` çağırdığını göster. Kısaca `useStaffComplaints`'in rol bazlı dallanmasını da göster.
**🎤 Ne söyleyeceksin:**
"Daha karmaşık hook'lar da var. `useComplaintDetail` bir şikayeti ve süreç geçmişini canlı dinliyor; iki ayrı `onSnapshot` aboneliğini ve bunların temizlenmesini tek başına yönetiyor. Sonuçta şikayet detay ekranı artık Firestore'u hiç tanımıyor bile — sadece hook'u çağırıp dönen veriyi gösteriyor. `useStaffComplaints` ise kullanıcının rolüne göre ya tüm şikayetleri ya da sadece kurumun şikayetlerini dinliyor; bu karar da artık ekranda değil, hook'ta."

### Sahne 5 — En Güçlü Örnek: useCreateComplaint (2:20 – 3:00)
**🎬 Ne göstereceksin:** `hooks/useCreateComplaint.ts`'i aç; `submit` fonksiyonunu göster — şikayet kaydı, arka planda fotoğraf yükleme ve arka planda oyunlaştırma. `return { submit, submitting, reward, clearReward }` satırını vurgula. Sonra `create-complaint.tsx`'in `handleSubmit`'inin ne kadar sadeleştiğini (sadece doğrulama + formu sıfırlama) göster.
**🎤 Ne söyleyeceksin:**
"En güçlü örnek bu: `useCreateComplaint`. Şikayet gönderiminin tüm karmaşık akışını kapsüllüyor — kaydı oluştur, fotoğrafları arka planda yükle, oyunlaştırmayı arka planda çalıştır ve ödülü dışarı ver. Geçen hafta düzelttiğim 'butonun takılması' korumasını da bu hook taşıyor. Ekran tarafında geriye sadece form doğrulaması ve başarılıysa formu temizlemek kaldı. Yani UI mantığı ile veri mantığı net biçimde ayrıldı."

### Sahne 6 — Tek Doğruluk Kaynağı: Paylaşılan Sabitler (3:00 – 3:25)
**🎬 Ne göstereceksin:** `constants/complaintStatus.ts`'i aç; `COMPLAINT_STATUS` sözlüğünü ve `getStatusInfo` yardımcısını göster. Kısaca `utils/date.ts`'teki `formatDate`'i göster. Bunların önceden 4-5 ekranda kopyalandığını belirt.
**🎤 Ne söyleyeceksin:**
"Bir de tekrar eden sabitler vardı. Şikayet durumlarının renk ve etiket sözlüğü tam dört ayrı ekranda kopyalanmıştı; tarih biçimleme fonksiyonu ise neredeyse her ekranda. Bunları da tek dosyaya topladım: durumlar için `complaintStatus.ts`, tarihler için `date.ts`. Artık bir durumun rengini değiştirmek istersem tek bir yeri düzenliyorum, tüm uygulama birden güncelleniyor."

### Sahne 7 — Canlı Demo ve Kapanış (3:25 – 3:50)
**🎬 Ne göstereceksin:** Uygulamada hızlıca gezin: ana sayfa, şikayetlerim, yeni şikayet gönder (ödül modalı hâlâ çıkıyor), detay ekranı. Her şeyin önceki gibi sorunsuz çalıştığını göster.
**🎤 Ne söyleyeceksin:**
"Ve en güzel kısmı: uygulama kullanıcı açısından hiç değişmedi — her şey aynı çalışıyor, şikayet gönderiyorum, ödülümü alıyorum. Ama artık kodun arkası çok daha temiz, test edilebilir ve bakımı kolay. Özetle bu hafta; veritabanı iletişimini özel hook'lara soyutladım, kopya kodu yok ettim ve tekrar eden sabitleri tek kaynağa taşıdım. İzlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 6 — Hafta 8: Push Bildirimleri

**Hedef süre:** ~3.5 dakika
**Ana mesaj:** "Bu hafta projenin en önemli şeffaflık özelliğini ekledim: bir kurum şikayetin durumunu güncellediğinde, vatandaşa anlık bir push bildirimi gidiyor ve bildirime dokununca doğrudan ilgili şikayetin detayına açılıyor."

### Sahne 1 — Açılış ve "Neden?" (0:00 – 0:30)
**🎬 Ne göstereceksin:** Uygulamada bir şikayetin detay ekranı, "Süreç Geçmişi" görünüyor.
**🎤 Ne söyleyeceksin:**
"Merhaba, Kamu Köprüsü'nün sekizinci hafta videosu. Şimdiye kadar vatandaş, şikayetinin durumunu görmek için uygulamayı açıp kontrol etmek zorundaydı. Bu hafta bunu tersine çevirdim: artık durum değişince uygulama vatandaşa kendisi haber veriyor. Yani proje yönergesinde de vurgulanan, push bildirimleriyle şeffaf süreç takibini ekledim."

### Sahne 2 — İzin ve Token Kaydı (0:30 – 1:15)
**🎬 Ne göstereceksin:** `services/notificationService.ts`'i aç; `registerForPushNotificationsAsync` fonksiyonunu göster — Android kanalı, izin isteği ve `getExpoPushTokenAsync`. Sonra `hooks/usePushNotifications.ts`'e geç; giriş yapınca token alınıp `updateUserData` ile kullanıcının Firestore kaydına yazıldığı `useEffect`'i göster.
**🎤 Ne söyleyeceksin:**
"Bildirim göndermek için önce her cihazın benzersiz bir adresi olması lazım — buna push token deniyor. `notificationService` içindeki `registerForPushNotificationsAsync` kullanıcıdan bildirim izni istiyor ve Expo'dan bu token'ı alıyor. `usePushNotifications` hook'um da kullanıcı giriş yapar yapmaz bu token'ı alıp Firestore'daki kullanıcı kaydına yazıyor. Böylece 'bu kullanıcıya nasıl ulaşırım' bilgisi veritabanında hazır duruyor."

### Sahne 3 — Bildirim Gönderme (Expo Push API) (1:15 – 2:00)
**🎬 Ne göstereceksin:** `notificationService.ts`'te `sendExpoPush` fonksiyonunu göster — `fetch` ile Expo Push API'ye POST. Sonra `notifyComplaintStatus`'ı göster: şikayet sahibinin kaydından `pushToken`'ı çekip Türkçe bir mesajla bildirim gönderiyor.
**🎤 Ne söyleyeceksin:**
"Token elimizde; peki bildirimi nasıl gönderiyorum? `sendExpoPush` fonksiyonu, `fetch` ile Expo'nun Push API'sine bir HTTP isteği atıyor — yönergedeki harici servislere Fetch ile asenkron istek atma gereksinimini de burada karşılıyorum. `notifyComplaintStatus` ise işin mantığını kuruyor: şikayetin sahibini buluyor, onun kaydından push token'ını alıyor ve 'Şikayetin güncellendi' başlıklı, yeni durumu içeren bir mesaj gönderiyor. Önemli kısım: bildirimin içine şikayetin kimliğini de gömüyorum, birazdan bunu kullanacağız."

### Sahne 4 — Durum Değişiminde Tetikleme (2:00 – 2:30)
**🎬 Ne göstereceksin:** `app/complaint-detail.tsx`'te `handleUpdateStatus` içinde, `updateComplaintStatus`'tan hemen sonra çağrılan `notifyComplaintStatus(...)` satırını göster; arka planda (`.catch` ile) çağrıldığını vurgula.
**🎤 Ne söyleyeceksin:**
"Peki bu ne zaman çalışıyor? Yetkili bir şikayetin durumunu güncellediği anda. Durum güncelleme fonksiyonunun hemen ardından bildirimi tetikliyorum. Dikkat edin, bunu arka planda çağırıyorum — yani bildirim gönderimi gecikse bile yetkilinin ekranı asla kilitlenmiyor; durum güncellemesi anında tamamlanıyor."

### Sahne 5 — Bildirime Dokunma ve Yönlendirme (2:30 – 3:05)
**🎬 Ne göstereceksin:** `usePushNotifications.ts`'te `setNotificationHandler` (uygulama açıkken bildirimin nasıl görüneceği) ve `addNotificationResponseReceivedListener` bloğunu göster — `data.complaintId` okunup `router.push` ile detaya gidiliyor.
**🎤 Ne söyleyeceksin:**
"Son parça da kullanıcı deneyimi. `setNotificationHandler` ile uygulama açıkken bile bildirimin üstte banner olarak görünmesini sağlıyorum. Asıl güzellik şu: kullanıcı bildirime dokununca, az önce mesajın içine gömdüğüm şikayet kimliğini okuyup `router.push` ile doğrudan o şikayetin detayına yönlendiriyorum. Yani tek dokunuşla, ilgili şikayetin önünde oluyor."

### Sahne 6 — Canlı Demo ve Kapanış (3:05 – 3:35)
**🎬 Ne göstereceksin:** (Mümkünse iki cihaz/iki hesap.) Kurum hesabıyla bir şikayetin durumunu "İşlemde" yap. Vatandaş cihazında bildirimin geldiğini göster, bildirime dokun, şikayet detayının açıldığını göster.
**🎤 Ne söyleyeceksin:**
"Gerçekte görelim. Kurum tarafında bir şikayeti 'İşlemde' yapıyorum. Vatandaş tarafında anında bildirim düşüyor: 'Şikayetin güncellendi'. Dokunuyorum ve uygulama doğrudan o şikayetin detayına açılıyor. Küçük bir not: uzak push bildirimleri Expo Go'da değil, gerçek bir development build'de tam çalışır; ben de demoyu onunla çekiyorum. Özetle bu hafta; izin ve token yönetimini kurdum, Expo Push API ile bildirim gönderimini ekledim, durum değişimine bağladım ve bildirimden detaya yönlendirmeyi tamamladım. İzlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 7 — Hafta 9: Drawer (Yan Menü) Navigasyon

**Hedef süre:** ~3 dakika
**Ana mesaj:** "Bu hafta proje yönergesinin istediği üç navigasyon türünü bir araya getirdim: alttaki sekmeleri bir yan menünün (Drawer) içine alarak Stack, Tab ve Drawer'ı iç içe çalıştırdım ve uygulamaya Hakkında ile Ayarlar ekranlarını ekledim."

### Sahne 1 — Açılış ve "Neden?" (0:00 – 0:25)
**🎬 Ne göstereceksin:** Uygulama açık; sol üstteki hamburger ikonuna dokunup yan menüyü aç, sonra kapat.
**🎤 Ne söyleyeceksin:**
"Merhaba, Kamu Köprüsü'nün dokuzuncu hafta videosu. Yönergede üç navigasyon yapısı isteniyordu: Stack, alt sekmeler ve yan menü, yani Drawer. İlk ikisi zaten vardı; bu hafta üçüncüsünü ekledim ve hepsini iç içe çalışır hale getirdim. Ayrıca menüye yeni ekranlar koydum. Nasıl kurguladığımı göstereyim."

### Sahne 2 — Navigasyon Mimarisi (0:25 – 1:05)
**🎬 Ne göstereceksin:** Editörde `app/` ağacını göster: `_layout.tsx` (kök Stack), `(drawer)/_layout.tsx`, `(drawer)/(tabs)/` (taşınan sekmeler), `(drawer)/about.tsx`, `(drawer)/settings.tsx`.
**🎤 Ne söyleyeceksin:**
"Önce klasör yapısına bakalım. Kökte hâlâ bir Stack var. Onun içine yeni bir `(drawer)` grubu ekledim. Eskiden doğrudan kökte olan `(tabs)` sekme grubunu bu drawer'ın içine taşıdım. Yani hiyerarşi artık şöyle: Stack, onun içinde Drawer, onun içinde de alt sekmeler. Parantezli klasörler URL'i değiştirmediği için, ekranların yolları aynı kaldı — yani uygulamanın geri kalanında hiçbir bağlantıyı bozmadım."

### Sahne 3 — Drawer Layout ve Özel Menü İçeriği (1:05 – 1:45)
**🎬 Ne göstereceksin:** `app/(drawer)/_layout.tsx`'i aç; `Drawer` bileşenini, `drawerContent={(props) => <DrawerContent {...props} />}` satırını ve üç `Drawer.Screen`'i (Ana Sayfa, Hakkında, Ayarlar) göster. Sonra `components/DrawerContent.tsx`'i aç; üstteki kullanıcı kartını ve alttaki çıkış butonunu göster.
**🎤 Ne söyleyeceksin:**
"Drawer'ı `expo-router/drawer`'dan gelen `Drawer` bileşeniyle kurdum. Üç ekranım var: Ana Sayfa — ki bu aslında tüm sekme grubu —, Hakkında ve Ayarlar. Menünün görünümünü de özelleştirdim: `DrawerContent` bileşeniminde en üstte kullanıcının adını, e-postasını ve rolünü gösteren bir kart, ortada otomatik gezinme bağlantıları, en altta da bir çıkış butonu var. Yani menü hem işlevsel hem de kişiselleştirilmiş."

### Sahne 4 — Yeni Ekranlar: Hakkında ve Ayarlar (1:45 – 2:15)
**🎬 Ne göstereceksin:** `app/(drawer)/about.tsx` ve `app/(drawer)/settings.tsx`'i kısaca göster. Sonra uygulamada menüden ikisine de gir: Hakkında'da uygulama açıklaması/sürüm/GitHub bağlantısı, Ayarlar'da hesap bilgileri ve çıkış.
**🎤 Ne söyleyeceksin:**
"Menüye iki de yeni ekran ekledim. 'Hakkında' uygulamanın ne işe yaradığını, sürümünü ve geliştirici bilgisini gösteriyor; GitHub deposuna bağlantı da burada. 'Ayarlar' ise hesap bilgilerini özetliyor ve bildirimler hakkında kısa bir not ile çıkış seçeneği sunuyor. Bunlar sekmelere sığmayacak, ama her an erişilebilir olması gereken türden ekranlar — yan menü tam da bunun için ideal."

### Sahne 5 — Köke Bağlama (2:15 – 2:40)
**🎬 Ne göstereceksin:** `app/_layout.tsx`'i aç; `<Stack.Screen name="(drawer)">`, `GestureHandlerRootView` sarmalını ve giriş sonrası `router.replace('/')` yönlendirmesini göster.
**🎤 Ne söyleyeceksin:**
"Son olarak bunu köke bağladım. Kök Stack artık ilk ekran olarak drawer grubunu açıyor. Drawer'ın kaydırma jestlerinin çalışması için tüm uygulamayı `GestureHandlerRootView` ile sardım. Giriş yapan kullanıcıyı da doğrudan ana ekrana yönlendiriyorum. Korumalı yönlendirme mantığım aynen korundu — sadece artık varış noktası drawer'ın içindeki sekmeler."

### Sahne 6 — Canlı Demo ve Kapanış (2:40 – 3:05)
**🎬 Ne göstereceksin:** Uygulamada: hamburger ile menüyü aç, kullanıcı kartını göster, Hakkında'ya geç, geri menüden Ayarlar'a geç, sonra Ana Sayfa'ya dön ve alt sekmeler arasında gezin. İstersen bir şikayet detayına girip Stack geçişinin de çalıştığını göster.
**🎤 Ne söyleyeceksin:**
"Gerçekte görelim. Hamburger'a dokunuyorum, menü açılıyor; üstte kendi kartım. Hakkında'ya, sonra Ayarlar'a geçiyorum. Ana Sayfa'ya dönünce alt sekmelerim hâlâ orada, sorunsuz çalışıyor. Bir şikayete girince de Stack geçişi devrede. Yani üç navigasyon türü bir arada, uyum içinde. Özetle bu hafta; sekmeleri bir Drawer'ın içine aldım, özel bir menü içeriği yazdım ve Hakkında ile Ayarlar ekranlarını ekledim. İzlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 8 — Hafta 10: Konum ve Ters Coğrafi Kodlama

**Hedef süre:** ~3.5 dakika
**Ana mesaj:** "Bu hafta şikayetlere konum boyutunu ekledim: vatandaş tek dokunuşla bulunduğu yerin GPS koordinatını ekleyebiliyor, harici bir API ile bu koordinat okunabilir bir adrese çevriliyor ve yetkili şikayet detayında konumu haritada açabiliyor."

### Sahne 1 — Açılış ve "Neden?" (0:00 – 0:30)
**🎬 Ne göstereceksin:** Uygulamada "Yeni Şikayet" ekranı açık.
**🎤 Ne söyleyeceksin:**
"Merhaba, Kamu Köprüsü'nün onuncu hafta videosu. Bir şikayette en kritik bilgilerden biri 'nerede?' sorusudur. Bozuk bir yol, taşan bir rögar — yetkilinin tam yeri bilmesi lazım. Bu hafta cihazın GPS'ini kullanarak şikayete konum ekleme özelliğini ve yönergede istenen, harici bir servise Fetch ile bağlanan ters coğrafi kodlamayı ekledim."

### Sahne 2 — Ters Coğrafi Kodlama Servisi (0:30 – 1:15)
**🎬 Ne göstereceksin:** `services/geocodingService.ts`'i aç; `reverseGeocode` fonksiyonunu göster — `fetch` ile OpenStreetMap Nominatim uç noktasına istek, `accept-language=tr`, ve adresin sokak/ilçe/il biçiminde derlenmesi.
**🎤 Ne söyleyeceksin:**
"Önce çeviri katmanını kurdum. `geocodingService` içindeki `reverseGeocode`, bir enlem-boylam alıyor ve `fetch` ile OpenStreetMap'in ücretsiz Nominatim servisine istek atıyor — yönergedeki 'harici REST servislerine Fetch ile asenkron istek' maddesini tam da burada karşılıyorum. Dönen ham veriden sokak, ilçe ve il bilgisini alıp derli toplu, Türkçe bir adres oluşturuyorum. Servis erişilemezse de uygulama çökmüyor, sadece koordinatla devam ediyor."

### Sahne 3 — Konum Hook'u (1:15 – 1:50)
**🎬 Ne göstereceksin:** `hooks/useDeviceLocation.ts`'i aç; `fetchLocation` içinde sırayla `requestForegroundPermissionsAsync`, `getCurrentPositionAsync` ve `reverseGeocode` çağrılarını göster.
**🎤 Ne söyleyeceksin:**
"Bu mantığı yine bir hook'ta topladım: `useDeviceLocation`. `fetchLocation` çağrıldığında önce konum izni istiyor, sonra `expo-location` ile cihazın anlık koordinatını okuyor, ardından az önceki servisle bu koordinatı adrese çeviriyor. Geriye enlem, boylam ve adresi tek bir nesne olarak döndürüyor. Yani ekran tarafında tek bir fonksiyon çağrısı yetiyor."

### Sahne 4 — Şikayete Konum Ekleme (1:50 – 2:30)
**🎬 Ne göstereceksin:** `create-complaint.tsx`'te "Mevcut Konumu Ekle" butonunu ve konum eklendiğinde adresin/koordinatın gösterildiği kartı göster. `submit`'e `location` alanının geçtiğini ve `useCreateComplaint`'te Firestore'a yalnızca konum varsa eklendiğini (`undefined` göndermemek için) göster.
**🎤 Ne söyleyeceksin:**
"Yeni şikayet ekranına 'Mevcut Konumu Ekle' butonu koydum. Dokununca hook devreye giriyor, konum alınıyor ve hemen altında çözümlenen adres ile koordinat görünüyor. Gönderirken bu konumu şikayet verisine ekliyorum. Küçük ama önemli bir detay: konum eklenmediyse bu alanı hiç göndermiyorum, çünkü Firestore tanımsız değerleri kabul etmiyor."

### Sahne 5 — Detayda Konumu Görüntüleme (2:30 – 3:00)
**🎬 Ne göstereceksin:** `app/complaint-detail.tsx`'te yeni "Konum" bölümünü göster; adres, koordinat ve "Haritada Aç" butonu. Kodda `Linking.openURL` ile platforma göre harita uygulamasının açıldığını göster.
**🎤 Ne söyleyeceksin:**
"Şikayet detayında da yeni bir 'Konum' bölümü var. Adresi ve koordinatı gösteriyorum; 'Haritada Aç' butonuna basınca da `Linking` ile cihazın harita uygulamasını o noktaya odaklanmış şekilde açıyorum. Böylece yetkili, şikayetin tam yerini tek dokunuşla harita üzerinde görebiliyor."

### Sahne 6 — Canlı Demo ve Kapanış (3:00 – 3:30)
**🎬 Ne göstereceksin:** Yeni şikayet oluştururken konum ekle, adresin geldiğini göster, gönder. Sonra şikayet detayını aç, konum bölümünü ve "Haritada Aç" ile haritanın açıldığını göster.
**🎤 Ne söyleyeceksin:**
"Gerçekte görelim. Şikayeti yazıyorum, 'Mevcut Konumu Ekle'ye dokunuyorum; birkaç saniye içinde adresim çözümleniyor. Gönderiyorum. Detayı açtığımda konum bölümü orada; 'Haritada Aç' diyorum ve harita uygulaması tam o noktada açılıyor. Özetle bu hafta; GPS ile konum almayı, Fetch ile harici bir servisten adres çözümlemeyi ve konumu hem oluşturma hem detay ekranına entegre etmeyi tamamladım. İzlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 9 — Hafta 11: Arama ve Filtreleme

**Hedef süre:** ~3 dakika
**Ana mesaj:** "Bu hafta listeleri kullanılabilir hale getirdim: hem vatandaş hem yetkili artık şikayetler arasında metinle arama yapabiliyor ve kategoriye/duruma göre filtreleyebiliyor. Bu mantığı yeniden kullanılabilir tek bir hook ve ortak bir filtre çubuğu bileşeninde topladım."

### Sahne 1 — Açılış ve "Neden?" (0:00 – 0:25)
**🎬 Ne göstereceksin:** Yetkili panelinde uzun bir şikayet listesi görünüyor.
**🎤 Ne söyleyeceksin:**
"Merhaba, Kamu Köprüsü'nün on birinci hafta videosu. Şikayet sayısı arttıkça düz bir liste yetmiyor; aranan şikayeti bulmak zorlaşıyor. Bu hafta hem vatandaş hem yetkili tarafına arama ve filtreleme ekledim — hepsini de tekrar kullanılabilir, tek bir yapı olarak."

### Sahne 2 — Filtre Hook'u (0:25 – 1:05)
**🎬 Ne göstereceksin:** `hooks/useComplaintFilters.ts`'i aç; `search`, `category`, `status` durumlarını, `STATUS_FILTERS` gruplamasını ve `useMemo` ile hesaplanan `filtered` sonucunu göster. Türkçe için `toLocaleLowerCase('tr-TR')` satırına işaret et.
**🎤 Ne söyleyeceksin:**
"İşin kalbi `useComplaintFilters` hook'u. Üç filtreyi yönetiyor: serbest metin araması, kategori ve durum. Bir şikayet listesi alıyor ve filtrelenmiş sonucu `useMemo` ile döndürüyor — yani liste ya da filtreler değişmedikçe yeniden hesaplama yapılmıyor. Arama yaparken `tr-TR` diline duyarlı küçük harf kullanıyorum ki 'İ' ve 'ı' gibi Türkçe karakterler doğru eşleşsin. Başlık, açıklama ve kurum adında arama yapıyor."

### Sahne 3 — Ortak Bileşenler (1:05 – 1:45)
**🎬 Ne göstereceksin:** `components/ui/SearchBar.tsx`'i (temizle butonlu arama kutusu) ve `components/ComplaintFilterBar.tsx`'i (arama + durum çipleri + kategori çipleri) göster. Sonra `constants/categories.ts`'i göster ve kategorilerin artık tek kaynaktan geldiğini, yeni şikayet formunun da aynı listeyi kullandığını belirt.
**🎤 Ne söyleyeceksin:**
"Arayüz tarafında iki bileşen yaptım: yeniden kullanılabilir bir `SearchBar` ve bunları birleştiren `ComplaintFilterBar` — arama kutusu, durum çipleri ve kaydırılabilir kategori çipleri. Bir de kategorileri `categories.ts` içinde tek doğruluk kaynağına taşıdım; hem bu filtre hem de yeni şikayet formu artık aynı listeyi kullanıyor, yani kategori eklemek tek satır."

### Sahne 4 — Vatandaş Tarafı: Şikayetlerim (1:45 – 2:15)
**🎬 Ne göstereceksin:** `app/(drawer)/(tabs)/my-complaints.tsx`'te hook'un çağrılışını ve `FlatList`'in `ListHeaderComponent` olarak filtre çubuğunu, `data` olarak `filters.filtered`'ı kullandığını göster. Uygulamada bir kelime arat, kategori seç, listenin daraldığını göster.
**🎤 Ne söyleyeceksin:**
"Şikayetlerim ekranında hook'u çağırıyorum ve filtre çubuğunu listenin başlığı olarak veriyorum; liste de filtrelenmiş veriyi gösteriyor. Bakın — bir kelime yazıyorum, liste anında daralıyor; bir kategori seçiyorum, sadece o kategoriden şikayetler kalıyor. Sonuç çıkmazsa da kullanıcıya 'sonuç bulunamadı' mesajı gösteriyorum."

### Sahne 5 — Yetkili Tarafı: Panel (2:15 – 2:40)
**🎬 Ne göstereceksin:** `components/StaffDashboard.tsx`'te aynı hook ve `ComplaintFilterBar`'ın kullanıldığını göster. Üstteki özet sayıların hâlâ TÜM şikayetlere göre, listenin ise filtreye göre olduğunu vurgula.
**🎤 Ne söyleyeceksin:**
"Yetkili panelinde de tam olarak aynı hook ve aynı filtre çubuğunu kullanıyorum — tek satır kod paylaşımı. Önemli bir ayrım: en üstteki bekleyen/işlemde/çözülen özet sayıları her zaman tüm şikayetlere göre kalıyor; arama ve filtre yalnızca alttaki listeyi etkiliyor. Böylece yetkili genel tabloyu kaybetmeden arama yapabiliyor."

### Sahne 6 — Canlı Demo ve Kapanış (2:40 – 3:05)
**🎬 Ne göstereceksin:** Panelde bir kurum adı/kelime arat, durum çipiyle daralt, kategoriyle daralt, sonra filtreleri temizle.
**🎤 Ne söyleyeceksin:**
"Gerçekte görelim. Bir kelime aratıyorum, 'Bekleyen' durumunu seçiyorum, ardından bir kategori ekliyorum — liste tam istediğim şikayetlere iniyor. Özetle bu hafta; arama ve filtreleme mantığını tek bir hook'ta topladım, yeniden kullanılabilir filtre bileşenleri yaptım ve bunları hem vatandaş hem yetkili listelerine uyguladım. İzlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 10 — Hafta 12: Profil Düzenleme ve Avatar

**Hedef süre:** ~3 dakika
**Ana mesaj:** "Bu hafta salt-okunur olan profili düzenlenebilir hale getirdim: kullanıcı artık adını, telefonunu ve avatarını değiştirebiliyor; avatar Firebase Storage'a yükleniyor ve değişiklik uygulamanın her yerine anında yansıyor."

### Sahne 1 — Açılış ve "Neden?" (0:00 – 0:25)
**🎬 Ne göstereceksin:** Profil ekranı açık; yeni eklenen "Profili Düzenle" butonunu göster.
**🎤 Ne söyleyeceksin:**
"Merhaba, Kamu Köprüsü'nün on ikinci hafta videosu. Şimdiye kadar profil ekranı sadece bilgi gösteriyordu — değiştirilemiyordu. Bu hafta onu düzenlenebilir yaptım: ad, telefon ve en güzeli, profil fotoğrafı. Nasıl kurguladığımı göstereyim."

### Sahne 2 — Paylaşılan Yükleme Servisi ve Güncelleme Hook'u (0:25 – 1:10)
**🎬 Ne göstereceksin:** `services/storageService.ts`'i aç; `uploadImageAsync(uri, path)` fonksiyonunu göster. Sonra `hooks/useUpdateProfile.ts`'i aç; `save` içinde avatar yükleme koşulunu (`!uri.startsWith('http')`), `updateUserData` ve `refreshUserData` çağrılarını göster.
**🎤 Ne söyleyeceksin:**
"Önce yükleme mantığını tek bir yere aldım: `storageService` içindeki `uploadImageAsync`, herhangi bir yerel dosyayı Firebase Storage'a yükleyip indirme linkini döndürüyor. Güzel tarafı, şikayet fotoğrafları zaten bu fonksiyonu kullanıyor — yani kopya kod yok. Güncelleme işini de `useUpdateProfile` hook'unda topladım: eğer kullanıcı yeni bir avatar seçtiyse onu yüklüyor, sonra ad-telefon-avatar bilgisini Firestore'da güncelliyor ve en sonunda `refreshUserData` ile oturumu tazeliyor. Bu son adım kritik: birazdan göreceğiz."

### Sahne 3 — Düzenleme Ekranı (1:10 – 1:50)
**🎬 Ne göstereceksin:** `app/edit-profile.tsx`'i aç; avatar seçici (dokununca galeri açan `pickAvatar`), ad ve telefon alanları, salt-okunur e-posta alanı ve "Kaydet" butonunu göster.
**🎤 Ne söyleyeceksin:**
"Düzenleme ekranı `edit-profile`. En üstte avatar var; üzerine dokununca galeriden kare formatta bir fotoğraf seçiyorum. Altında ad ve telefon alanları, mevcut değerlerle dolu geliyor. E-postayı ise bilerek salt-okunur bıraktım, çünkü kimlik doğrulama e-postası burada değişmemeli. 'Kaydet'e basınca az önceki hook devreye giriyor."

### Sahne 4 — Her Yere Yansıma (1:50 – 2:20)
**🎬 Ne göstereceksin:** `app/(drawer)/(tabs)/profile.tsx` ve `components/DrawerContent.tsx`'te avatarın artık `userData.avatar` varsa `Image` olarak gösterildiğini göster.
**🎤 Ne söyleyeceksin:**
"Peki kaydettikten sonra ne oluyor? `refreshUserData` sayesinde oturumdaki kullanıcı bilgisi anında güncelleniyor. Bu yüzden yeni avatar sadece profil ekranında değil, yan menüdeki kullanıcı kartında da hemen görünüyor. Her iki yerde de artık avatar varsa fotoğrafı, yoksa baş harfi gösteriyorum."

### Sahne 5 — Canlı Demo (2:20 – 2:55)
**🎬 Ne göstereceksin:** Profilde "Profili Düzenle" → avatar seç, adı değiştir, kaydet. Geri dönünce profilde yeni avatar/ad. Yan menüyü aç, orada da güncellendiğini göster.
**🎤 Ne söyleyeceksin:**
"Gerçekte görelim. 'Profili Düzenle'ye giriyorum, bir fotoğraf seçiyorum, adımı güncelliyorum ve kaydediyorum. Profile döndüğümde yeni fotoğrafım ve adım orada. Yan menüyü açtığımda kullanıcı kartım da güncellenmiş. Tek bir kaydetme, tüm uygulamaya yansıdı."

### Sahne 6 — Kapanış (2:55 – 3:05)
**🎬 Ne göstereceksin:** Güncel profil ekranını göster.
**🎤 Ne söyleyeceksin:**
"Özetle bu hafta; profili düzenlenebilir yaptım, avatar yüklemeyi paylaşılan bir servisle ekledim ve değişikliklerin uygulamanın her yerine anında yansımasını sağladım. İzlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 11 — Hafta 13: İstatistik ve Analitik Paneli

**Hedef süre:** ~3 dakika
**Ana mesaj:** "Bu hafta yetkililere veriyi anlamlandıran bir analitik panel ekledim: şikayetlerin duruma ve kategoriye göre dağılımını, son yedi günün eğilimini ve çözüm oranını grafiklerle gösteriyorum — hem de hiçbir harici grafik kütüphanesi kullanmadan."

### Sahne 1 — Açılış ve "Neden?" (0:00 – 0:25)
**🎬 Ne göstereceksin:** Yetkili panelinde uzun bir şikayet listesi; üstte yeni "İstatistik & Analitik" butonu.
**🎤 Ne söyleyeceksin:**
"Merhaba, Kamu Köprüsü'nün on üçüncü hafta videosu. Yetkili panelinde yüzlerce şikayet olabilir; ama düz bir liste 'genel durum ne?' sorusunu cevaplamıyor. Bu hafta veriyi grafiklere döken bir analitik panel ekledim. En güzeli, bunu ekstra bir kütüphane kurmadan, sade React Native bileşenleriyle yaptım."

### Sahne 2 — İstatistik Hook'u (0:25 – 1:10)
**🎬 Ne göstereceksin:** `hooks/useComplaintStats.ts`'i aç; `useMemo` içinde toplam, duruma göre sayım, kategoriye göre sayım, çözüm oranı ve son 7 günün gün gün hesaplandığı yeri göster.
**🎤 Ne söyleyeceksin:**
"Tüm hesaplamayı `useComplaintStats` hook'unda topladım. Bir şikayet listesi alıyor ve `useMemo` ile özet çıkarıyor: toplam sayı, duruma göre dağılım, kategoriye göre dağılım, çözüm oranı ve son yedi günün günlük şikayet sayısı. Liste değişmedikçe yeniden hesaplama yapmıyor — yani performanslı. Veriyi de zaten var olan `useStaffComplaints` hook'undan, yani aynı canlı akıştan alıyorum."

### Sahne 3 — Bağımlılıksız Grafik Bileşeni (1:10 – 1:45)
**🎬 Ne göstereceksin:** `components/charts/BarChart.tsx`'i aç; barların en büyük değere göre orantılandığı `max` hesabını ve dolan bar genişliğini göster.
**🎤 Ne söyleyeceksin:**
"Grafikler için harici bir kütüphane kurmak yerine kendi `BarChart` bileşenimi yazdım. Mantığı çok basit: en büyük değeri buluyor ve her barı ona göre orantılı genişlikte çiziyor — sadece View'lar ve yüzde. Bağımlılık yok demek; daha hafif, daha az hata, her platformda aynı görünüm demek. Üstelik temaya da duyarlı."

### Sahne 4 — Analitik Ekranı (1:45 – 2:25)
**🎬 Ne göstereceksin:** `app/statistics.tsx`'i aç ve uygulamada ekranı göster: üstte özet kartlar (Toplam / Çözülen / Çözüm Oranı), çözüm oranı çubuğu, duruma göre bar grafiği, kategoriye göre bar grafiği ve son 7 günün dikey sütun grafiği.
**🎤 Ne söyleyeceksin:**
"İşte panel. En üstte üç özet kart: toplam şikayet, çözülen sayısı ve yüzde olarak çözüm oranı. Altında çözüm oranını gösteren bir çubuk. Sonra iki bar grafiği: biri duruma göre — bekleyen, işlemde, çözülen renkleriyle —, diğeri kategoriye göre, çoktan aza sıralı. En altta da son yedi günün dikey sütun grafiği; hangi gün kaç şikayet gelmiş, bir bakışta görünüyor. Bütün renkler yine merkezi tasarım sisteminden geliyor."

### Sahne 5 — Panele Erişim (2:25 – 2:45)
**🎬 Ne göstereceksin:** `components/StaffDashboard.tsx`'te "İstatistik & Analitik" butonunun `router.push('/statistics')` ile yönlendirdiğini göster; bu butonun yalnızca yetkililere görünen panelde olduğunu belirt.
**🎤 Ne söyleyeceksin:**
"Bu panele yalnızca yetkililer erişiyor; çünkü butonu kurum/moderatör panelinin içine koydum. Vatandaş bu ekranı hiç görmüyor. Tek dokunuşla istatistiklere geçiliyor, geri dönünce kaldığı yerden listeye devam ediyor."

### Sahne 6 — Canlı Demo ve Kapanış (2:45 – 3:05)
**🎬 Ne göstereceksin:** Panelden "İstatistik & Analitik"e dokun, grafikleri kaydırarak göster, geri dön.
**🎤 Ne söyleyeceksin:**
"Gerçekte görelim. Butona dokunuyorum, panel açılıyor; durum dağılımı, kategoriler, haftalık eğilim, çözüm oranı — hepsi canlı veriyle. Özetle bu hafta; analitik hesaplamayı bir hook'ta topladım, bağımlılıksız bir grafik bileşeni yazdım ve yetkililer için görsel bir istatistik paneli kurdum. İzlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 12 — Hafta 14: Şikayet Düzenleme ve Silme

**Hedef süre:** ~3 dakika
**Ana mesaj:** "Bu hafta vatandaşa kontrol verdim: kullanıcı, henüz moderatör incelemesine girmemiş kendi şikayetini düzenleyebiliyor veya silebiliyor. Bunu hem arayüzde yetki kontrolüyle hem de güvenlik kurallarıyla iki katmanlı güvenceye aldım."

### Sahne 1 — Açılış ve "Neden?" (0:00 – 0:25)
**🎬 Ne göstereceksin:** Bir şikayetin detay ekranı; durumu "Moderatör İncelemesinde".
**🎤 Ne söyleyeceksin:**
"Merhaba, Kamu Köprüsü'nün on dördüncü hafta videosu. Vatandaş şikayet gönderdikten sonra bir yazım hatası fark edebilir ya da yanlış bir şey yazmış olabilir. Şimdiye kadar bunu düzeltemiyordu. Bu hafta, şikayet henüz incelenmemişken kullanıcının onu düzenlemesine ya da silmesine izin verdim."

### Sahne 2 — Servis ve İşlem Hook'u (0:25 – 1:05)
**🎬 Ne göstereceksin:** `services/firestoreService.ts`'te `updateComplaint` ve `deleteComplaint` fonksiyonlarını göster. Sonra `hooks/useComplaintActions.ts`'i aç; `saveEdit`, `remove` ve ortak `busy` durumunu göster.
**🎤 Ne söyleyeceksin:**
"Önce veri katmanına iki fonksiyon ekledim: `updateComplaint` başlık, açıklama ve kategoriyi güncelliyor; `deleteComplaint` ise şikayeti siliyor. Bunları `useComplaintActions` hook'unda topladım — düzenleme ve silme işlemlerini, ortak bir yüklenme durumuyla birlikte tek bir yerden sunuyor. Yani ekranlar yine sade kalıyor."

### Sahne 3 — Yetki Kontrolü (Arayüz) (1:05 – 1:45)
**🎬 Ne göstereceksin:** `app/complaint-detail.tsx`'te `canEditOwn` kontrolünü göster — `complaint.userId === user.uid && status === 'PendingModeration'`. Sonra uygulamada: kendi bekleyen şikayetinde "Düzenle" ve "Sil" butonları görünüyor; onaylanmış bir şikayette ya da başkasının şikayetinde görünmüyor.
**🎤 Ne söyleyeceksin:**
"Asıl mantık bu `canEditOwn` kontrolünde. İki şart birden gerekiyor: şikayet bu kullanıcıya ait olacak VE durumu hâlâ 'moderatör incelemesinde' olacak. Yani bir kez onaylandıktan sonra kullanıcı artık değiştiremiyor — süreç kilitleniyor. Bakın, kendi bekleyen şikayetimde Düzenle ve Sil butonları var; ama onaylanmış bir şikayette ya da başkasının şikayetinde hiç görünmüyor."

### Sahne 4 — Düzenleme Ekranı (1:45 – 2:15)
**🎬 Ne göstereceksin:** "Düzenle"ye dokun; `app/edit-complaint.tsx` açılsın, alanlar mevcut değerlerle dolu gelsin. Başlığı değiştir, kaydet, detayın güncellendiğini göster.
**🎤 Ne söyleyeceksin:**
"Düzenle'ye basınca özel düzenleme ekranı açılıyor; başlık, açıklama ve kategori mevcut değerleriyle dolu geliyor. Kurum ve ekleri burada bilerek kilitli tuttum, sadece içeriği düzeltmeye odaklandım. Başlığı değiştirip kaydediyorum — detay ekranı canlı dinleme sayesinde anında güncelleniyor."

### Sahne 5 — İkinci Katman: Güvenlik Kuralı (2:15 – 2:45)
**🎬 Ne göstereceksin:** `firestore.rules`'ta Complaints için `allow delete` kuralını göster — `resource.data.userId == request.auth.uid && resource.data.status == 'PendingModeration'`.
**🎤 Ne söyleyeceksin:**
"Ama sadece arayüzde butonu gizlemek güvenlik değildir. Bu yüzden aynı kuralı Firestore güvenlik kurallarına da yazdım: bir şikayet ancak sahibi tarafından ve yalnızca incelenmemişken silinebilir. Yani biri arayüzü atlatıp doğrudan istek atsa bile, sunucu reddeder. İki katmanlı güvenlik."

### Sahne 6 — Canlı Demo ve Kapanış (2:45 – 3:05)
**🎬 Ne göstereceksin:** Bekleyen bir şikayette "Sil" → onay penceresi → sil; listeden anında kalktığını göster.
**🎤 Ne söyleyeceksin:**
"Son olarak silme. Bekleyen bir şikayette Sil'e basıyorum, bir onay penceresi çıkıyor, onaylıyorum ve şikayet listeden anında kayboluyor. Özetle bu hafta; şikayet düzenleme ve silmeyi ekledim, sahip-ve-bekleyen yetki kontrolünü kurdum ve bunu hem arayüzde hem güvenlik kurallarında güvenceye aldım. İzlediğiniz için teşekkürler!"

---

## 🎥 VIDEO 13 — Hafta 15: Bildirim Merkezi

**Hedef süre:** ~3.5 dakika
**Ana mesaj:** "Bu hafta uygulama içi bir bildirim merkezi ekledim: bir yetkili şikayet durumunu değiştirdiğinde vatandaşa bir bildirim düşüyor, ana sayfadaki zilde okunmamış sayısı görünüyor ve vatandaş bu bildirimleri tek ekranda görüp okundu işaretleyebiliyor."

### Sahne 1 — Açılış ve "Neden?" (0:00 – 0:25)
**🎬 Ne göstereceksin:** Ana sayfa; sağ üstte zil ikonu ve üzerinde kırmızı okunmamış rozeti.
**🎤 Ne söyleyeceksin:**
"Merhaba, Kamu Köprüsü'nün on beşinci hafta videosu. Sekizinci haftada anlık push bildirimleri eklemiştim; ama push'u kaçıran ya da silen kullanıcı, geçmiş bildirimlere ulaşamıyordu. Bu hafta uygulama içi kalıcı bir bildirim merkezi ekledim. Bakın, ana sayfada bir zil ve üzerinde okunmamış bildirim sayısı var."

### Sahne 2 — Veri Modeli ve Servis (0:25 – 1:10)
**🎬 Ne göstereceksin:** `services/firestoreService.ts`'te `createNotification`, `getUserNotifications`, `markNotificationRead` ve `markAllNotificationsRead` fonksiyonlarını göster. `getUserNotifications`'ta yalnızca eşitlik filtresi + istemci tarafı sıralama yorumuna işaret et.
**🎤 Ne söyleyeceksin:**
"Ayrı bir `Notifications` koleksiyonu açtım. `createNotification` durum değiştiğinde sahibi için bir kayıt oluşturuyor; içinde şikayet başlığı, yeni durum, mesaj ve bir 'okundu' bayrağı var. `getUserNotifications` ise kullanıcının bildirimlerini canlı dinliyor. Küçük bir optimizasyon: composite index gerektirmemek için sorguda yalnızca kullanıcı eşitliğiyle filtreliyorum, sıralamayı istemci tarafında yapıyorum. Bir de toplu okundu işaretlemeyi `writeBatch` ile tek seferde yapıyorum."

### Sahne 3 — Bildirim Hook'u (1:10 – 1:45)
**🎬 Ne göstereceksin:** `hooks/useNotifications.ts`'i aç; canlı dinleme, `unreadCount` hesabı ve `markRead` / `markAllRead` fonksiyonlarını göster.
**🎤 Ne söyleyeceksin:**
"Tüm bunları `useNotifications` hook'unda topladım. Bildirimleri canlı veriyor, okunmamış sayısını hesaplıyor ve okundu işaretleme fonksiyonlarını sunuyor. Bu hook'u iki yerde kullanıyorum: hem ana sayfadaki zil rozetinde hem de birazdan göreceğimiz bildirim merkezi ekranında. Yani tek kaynak, iki kullanım."

### Sahne 4 — Bildirim Merkezi Ekranı (1:45 – 2:30)
**🎬 Ne göstereceksin:** `app/notifications.tsx`'i ve uygulamada ekranı göster: okunmamış bildirimler vurgulu (mavi arka plan + nokta), her kartta durum ikonu/etiketi, mesaj ve tarih. Üstte "Tümünü okundu işaretle" butonu. Bir bildirime dokun → ilgili şikayet detayına gidiyor ve okundu oluyor.
**🎤 Ne söyleyeceksin:**
"İşte bildirim merkezi. Okunmamış bildirimler mavi arka plan ve bir noktayla vurgulu; her kartta durumun ikonu, etiketi, yetkilinin notu ve tarih var. Üstte 'Tümünü okundu işaretle' butonu. Bir bildirime dokununca otomatik olarak okundu işaretleniyor ve doğrudan ilgili şikayetin detayına gidiyorum. Yani bildirim, kullanıcıyı tam ilgili yere götürüyor."

### Sahne 5 — Tetikleme ve Zil Rozeti (2:30 – 3:00)
**🎬 Ne göstereceksin:** `app/complaint-detail.tsx`'te durum güncellemenin yanında `createNotification` çağrısını göster (arka planda). Sonra `app/(drawer)/(tabs)/index.tsx`'te zil ve `unreadCount` rozetini göster.
**🎤 Ne söyleyeceksin:**
"Peki bu kayıtlar ne zaman oluşuyor? Yetkili durumu güncellediği anda, push bildiriminin hemen yanında uygulama içi bildirimi de oluşturuyorum — yine arka planda, paneli bloke etmeden. Ana sayfadaki zil de `useNotifications`'tan gelen okunmamış sayısını gösteriyor; yeni bildirim gelince rozet anında artıyor, hepsini okuyunca kayboluyor."

### Sahne 6 — Canlı Demo ve Kapanış (3:00 – 3:30)
**🎬 Ne göstereceksin:** (İki hesap) Kurum hesabıyla bir şikayetin durumunu değiştir. Vatandaş hesabında ana sayfadaki zil rozetinin arttığını, bildirim merkezini açıp yeni bildirimi gördüğünü ve dokununca şikayete gittiğini göster.
**🎤 Ne söyleyeceksin:**
"Gerçekte görelim. Kurum tarafında bir şikayeti 'İşlemde' yapıyorum. Vatandaş tarafına geçtiğimde zildeki sayı bir arttı. Bildirim merkezini açıyorum, yeni bildirim en üstte ve vurgulu; dokunuyorum, hem okundu oluyor hem de şikayet detayı açılıyor. Özetle bu hafta; uygulama içi bildirim merkezini kurdum, okunmamış rozetini ana sayfaya ekledim ve durum güncellemelerini bu akışa bağladım. İzlediğiniz için teşekkürler!"

---

## 🎬 Genel Çekim İpuçları
- **Ekran düzeni:** Kod gösterirken yazı tipini büyüt (editörde Ctrl + "+"), küçük metin videoda okunmuyor.
- **Tempo:** Kısa videoda kodun her satırını okuma; sadece işaret edip ne işe yaradığını söyle.
- **Demo önce, kod sonra:** Mümkünse önce çalışan özelliği göster, sonra "bunu şu kod yapıyor" de — izleyici bağlamı daha iyi kuruyor.
- **Kayıt sırası:** Uygulama demolarını ayrı, kod gösterimlerini ayrı çekip sonra birleştirmek daha az hata çıkarır.
- **Geçiş cümlesi:** Her sahne sonunda "şimdi şuna bakalım" gibi kısa bir köprü cümlesi kullan, video akıcı olur.
