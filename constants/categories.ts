// Şikayet kategorileri — uygulamanın tek doğruluk kaynağı.
// Hem yeni şikayet formu hem de filtreleme bunu kullanır.
export interface Category {
  label: string;
  value: string;
}

export const COMPLAINT_CATEGORIES: Category[] = [
  { label: 'Ulaşım', value: 'Ulaşım' },
  { label: 'Sağlık', value: 'Sağlık' },
  { label: 'Eğitim', value: 'Eğitim' },
  { label: 'Altyapı', value: 'Altyapı' },
  { label: 'Çevre', value: 'Çevre' },
  { label: 'Güvenlik', value: 'Güvenlik' },
  { label: 'Diğer', value: 'Diğer' },
];
