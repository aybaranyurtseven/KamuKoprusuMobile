# Kamu Köprüsü – Video Senaryoları (Hafta 1, 3, 4, 5, 6 & 7)

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

## 🎬 Genel Çekim İpuçları
- **Ekran düzeni:** Kod gösterirken yazı tipini büyüt (editörde Ctrl + "+"), küçük metin videoda okunmuyor.
- **Tempo:** Kısa videoda kodun her satırını okuma; sadece işaret edip ne işe yaradığını söyle.
- **Demo önce, kod sonra:** Mümkünse önce çalışan özelliği göster, sonra "bunu şu kod yapıyor" de — izleyici bağlamı daha iyi kuruyor.
- **Kayıt sırası:** Uygulama demolarını ayrı, kod gösterimlerini ayrı çekip sonra birleştirmek daha az hata çıkarır.
- **Geçiş cümlesi:** Her sahne sonunda "şimdi şuna bakalım" gibi kısa bir köprü cümlesi kullan, video akıcı olur.
