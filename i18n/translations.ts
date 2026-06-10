// Kamu Köprüsü — çeviri sözlüğü (TR/EN).
// Düz anahtarlar; {param} yer tutucularıyla basit enterpolasyon desteklenir.

export type Language = 'tr' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Ortak
    'common.save': 'Kaydet',
    'common.cancel': 'Vazgeç',
    'common.delete': 'Sil',
    'common.edit': 'Düzenle',
    'common.logout': 'Çıkış Yap',
    'common.back': 'Geri',

    // Sekmeler
    'tabs.home': 'Ana Sayfa',
    'tabs.create': 'Yeni Şikayet',
    'tabs.myComplaints': 'Şikayetlerim',
    'tabs.profile': 'Profil',

    // Yan menü
    'drawer.home': 'Ana Sayfa',
    'drawer.about': 'Hakkında',
    'drawer.settings': 'Ayarlar',

    // Navigasyon başlıkları
    'nav.complaintDetail': 'Şikayet Detayı',
    'nav.editProfile': 'Profili Düzenle',
    'nav.statistics': 'İstatistikler',
    'nav.editComplaint': 'Şikayeti Düzenle',
    'nav.notifications': 'Bildirimler',
    'nav.about': 'Hakkında',
    'nav.settings': 'Ayarlar',
    'nav.map': 'Şikayet Haritası',

    // Kimlik doğrulama
    'auth.appName': 'Kamu Köprüsü',
    'auth.login': 'Giriş Yap',
    'auth.register': 'Kayıt Ol',
    'auth.createAccount': 'Hesap Oluştur',
    'auth.email': 'E-posta Adresi',
    'auth.password': 'Şifre',
    'auth.fullName': 'Ad Soyad',
    'auth.forgotPassword': 'Şifremi Unuttum',
    'auth.noAccount': 'Hesabın yok mu? ',
    'auth.forgotTitle': 'Şifrenizi Mi Unuttunuz?',
    'auth.forgotDesc': 'Kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.',
    'auth.sendLink': 'Bağlantı Gönder',
    'auth.fillAll': 'Lütfen tüm alanları doldurun.',

    // Ana sayfa (vatandaş)
    'home.greeting': 'Merhaba, {name} 👋',
    'home.welcome': 'Kamu Köprüsü\'ne hoş geldin',
    'home.xp': 'Deneyim Puanı',
    'home.nextLevel': 'Sonraki seviyeye {xp} XP',
    'home.total': 'Toplam',
    'home.active': 'Aktif',
    'home.resolved': 'Çözülen',
    'home.newComplaint': 'Yeni Şikayet Oluştur',
    'home.recent': 'Son Şikayetlerim',
    'home.seeAll': 'Tümü →',
    'home.emptyTitle': 'Henüz şikayetin yok',
    'home.emptySubtitle': 'İlk şikayetini oluşturmak için yukarıdaki butonu kullan.',

    // Ayarlar
    'settings.account': 'Hesap Bilgileri',
    'settings.name': 'Ad Soyad',
    'settings.email': 'E-posta',
    'settings.role': 'Rol',
    'settings.version': 'Uygulama Sürümü',
    'settings.appearance': 'Görünüm',
    'settings.theme.light': '☀️ Açık',
    'settings.theme.dark': '🌙 Koyu',
    'settings.theme.system': '⚙️ Sistem',
    'settings.themeHint': '"Sistem" seçiliyken uygulama cihazınızın açık/koyu tema ayarını izler.',
    'settings.language': 'Dil',
    'settings.languageHint': 'Uygulama arayüz dilini seçin.',
    'settings.notice': 'Bildirim tercihleri cihazınızın sistem ayarlarından yönetilir.',
  },

  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.logout': 'Log Out',
    'common.back': 'Back',

    // Tabs
    'tabs.home': 'Home',
    'tabs.create': 'New Complaint',
    'tabs.myComplaints': 'My Complaints',
    'tabs.profile': 'Profile',

    // Drawer
    'drawer.home': 'Home',
    'drawer.about': 'About',
    'drawer.settings': 'Settings',

    // Navigation titles
    'nav.complaintDetail': 'Complaint Details',
    'nav.editProfile': 'Edit Profile',
    'nav.statistics': 'Statistics',
    'nav.editComplaint': 'Edit Complaint',
    'nav.notifications': 'Notifications',
    'nav.about': 'About',
    'nav.settings': 'Settings',
    'nav.map': 'Complaint Map',

    // Auth
    'auth.appName': 'Public Bridge',
    'auth.login': 'Log In',
    'auth.register': 'Sign Up',
    'auth.createAccount': 'Create Account',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.forgotPassword': 'Forgot Password',
    'auth.noAccount': "Don't have an account? ",
    'auth.forgotTitle': 'Forgot Your Password?',
    'auth.forgotDesc': 'Enter your registered email and we will send you a password reset link.',
    'auth.sendLink': 'Send Link',
    'auth.fillAll': 'Please fill in all fields.',

    // Home (citizen)
    'home.greeting': 'Hello, {name} 👋',
    'home.welcome': 'Welcome to Public Bridge',
    'home.xp': 'Experience Points',
    'home.nextLevel': '{xp} XP to next level',
    'home.total': 'Total',
    'home.active': 'Active',
    'home.resolved': 'Resolved',
    'home.newComplaint': 'Create New Complaint',
    'home.recent': 'My Recent Complaints',
    'home.seeAll': 'All →',
    'home.emptyTitle': 'You have no complaints yet',
    'home.emptySubtitle': 'Use the button above to create your first complaint.',

    // Settings
    'settings.account': 'Account Info',
    'settings.name': 'Full Name',
    'settings.email': 'Email',
    'settings.role': 'Role',
    'settings.version': 'App Version',
    'settings.appearance': 'Appearance',
    'settings.theme.light': '☀️ Light',
    'settings.theme.dark': '🌙 Dark',
    'settings.theme.system': '⚙️ System',
    'settings.themeHint': 'When "System" is selected, the app follows your device\'s light/dark setting.',
    'settings.language': 'Language',
    'settings.languageHint': 'Choose the app interface language.',
    'settings.notice': 'Notification preferences are managed from your device system settings.',
  },
};
