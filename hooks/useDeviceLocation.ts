import { useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { reverseGeocode } from '@/services/geocodingService';

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

/**
 * Cihazın GPS konumunu alır ve harici servisle adrese çevirir.
 *  1) Konum izni ister
 *  2) Anlık koordinatı okur (expo-location)
 *  3) reverseGeocode ile okunabilir adres ekler (Fetch / Nominatim)
 */
export function useDeviceLocation() {
  const [loading, setLoading] = useState(false);

  const fetchLocation = async (): Promise<DeviceLocation | null> => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Konum eklemek için konum erişim izni gereklidir.');
        return null;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = position.coords;

      // Adres çözümleme başarısız olsa bile koordinatla devam et.
      const address = await reverseGeocode(latitude, longitude);
      return { latitude, longitude, address: address ?? undefined };
    } catch (error) {
      console.error('useDeviceLocation:', error);
      Alert.alert('Hata', 'Konum alınamadı. Lütfen tekrar deneyin.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchLocation, loading };
}
