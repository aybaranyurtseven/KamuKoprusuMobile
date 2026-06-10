// Ters coğrafi kodlama (reverse geocoding): enlem/boylamı okunabilir adrese çevirir.
// Harici REST servisine Fetch ile asenkron istek atılır (OpenStreetMap Nominatim,
// ücretsiz ve API anahtarı gerektirmez).

const NOMINATIM_REVERSE = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Verilen koordinat için kısa, Türkçe bir adres döner. Servis erişilemezse null.
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const url =
      `${NOMINATIM_REVERSE}?format=jsonv2&lat=${latitude}&lon=${longitude}` +
      `&accept-language=tr&zoom=18`;
    const response = await fetch(url, {
      headers: {
        // Nominatim kullanım politikası gereği tanımlayıcı bir User-Agent beklenir.
        'User-Agent': 'KamuKoprusu/1.0 (mobil uygulama ödevi)',
        Accept: 'application/json',
      },
    });
    if (!response.ok) return null;

    const data = await response.json();
    const a = data?.address;
    if (a) {
      // Sokak/mahalle + ilçe + il biçiminde derli toplu bir adres oluştur.
      const parts = [
        a.road || a.neighbourhood || a.suburb,
        a.town || a.city || a.county,
        a.state,
      ].filter(Boolean);
      if (parts.length > 0) return parts.join(', ');
    }
    return data?.display_name ?? null;
  } catch (error) {
    console.error('reverseGeocode error:', error);
    return null;
  }
}
