import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ROLE_LABELS: Record<string, string> = {
  Citizen: 'Vatandaş',
  InstitutionRep: 'Kurum Temsilcisi',
  Moderator: 'Moderatör',
  Admin: 'Yönetici',
  NGOCoordinator: 'STÖ Koordinatörü',
};

/**
 * Yan menünün özel içeriği: üstte kullanıcı kartı, ortada gezinme öğeleri
 * (Drawer.Screen'lerden otomatik), altta çıkış butonu.
 */
export function DrawerContent(props: DrawerContentComponentProps) {
  const { userData, user, logout } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const name = userData?.name || user?.email?.split('@')[0] || 'Kullanıcı';
  const email = userData?.email || user?.email || '';
  const role = ROLE_LABELS[userData?.role] || userData?.role || '';

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Kullanıcı kartı */}
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          {userData?.avatar ? (
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={[styles.avatarText, { color: theme.primary }]}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {!!email && <Text style={styles.email} numberOfLines={1}>{email}</Text>}
          {!!role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{role}</Text>
            </View>
          )}
        </View>

        {/* Gezinme öğeleri */}
        <View style={styles.items}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Çıkış */}
      <TouchableOpacity
        style={[styles.logout, { borderTopColor: theme.cardBorder }]}
        onPress={logout}
        activeOpacity={0.7}
      >
        <Text style={[styles.logoutText, { color: theme.danger }]}>⎋  Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 26, fontWeight: 'bold' },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  email: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
  roleBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  items: { paddingTop: 4 },
  logout: {
    borderTopWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  logoutText: { fontSize: 15, fontWeight: '700' },
});
