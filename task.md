# Kamu Köprüsü - Görev Takibi (Hafta 5)

## Hafta 5: Kurum ve Moderatör Panellerinin Detaylandırılması

- [x] Kullanıcı rolüne göre farklı Home/Dashboard ekranının gösterilmesi.
  - [x] `app/(tabs)/index.tsx` içinde rol bazlı yönlendirme (personel rolleri -> `StaffDashboard`, vatandaş -> `CitizenHome`).
- [x] Kurum/Moderatör için "Şikayet Yönetim Paneli" (`components/StaffDashboard.tsx`).
  - [x] Bekleyen / İşlemde / Çözülen istatistik kartları.
  - [x] Durum bazlı filtre çipleri (Tümü, Bekleyen, İşlemde, Çözülen).
  - [x] Moderatör tüm şikayetleri, kurum temsilcisi yalnızca kendi kurumunun şikayetlerini görür.
  - [x] Kurum atanmamış temsilci için bilgilendirici boş durum ekranı.
- [x] Şikayet durum güncelleme akışı (`app/complaint-detail.tsx`).
  - [x] Yetkili rollere özel "Durumu Güncelle" bölümü (rol/kurum bazlı yetki kontrolü).
  - [x] `firestoreService.updateComplaintStatus` ile durum güncelleme ve `ComplaintUpdates` log kaydı.
  - [x] "Süreç Geçmişi" zaman çizelgesinin (timeline) arayüze bağlanması.
- [x] TypeScript ve ESLint doğrulaması (hatasız).

## Sonraki Haftalar (Kısaca)
- [ ] Hafta 6: Oyunlaştırma (Gamification) ve Rozet (Badge) Sistemi
- [ ] Hafta 7: Harita ve Konum Entegrasyonu
- [ ] Hafta 8: Anlık Bildirimler (Push Notifications)
- [ ] Hafta 9: Performans Optimizasyonu ve Medya Yönetimi
- [ ] Hafta 10: Testler, Hata Ayıklama ve Deployment
