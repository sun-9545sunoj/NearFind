import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

const roles = [
  {key: 'Customer', icon: '🛍️', desc: 'Search products, place orders & track delivery', color: '#0D9488', bg: '#F0FDFA'},
  {key: 'Retailer', icon: '🏪', desc: 'Manage incoming orders, accept & pack items', color: '#7C3AED', bg: '#F5F3FF'},
  {key: 'Delivery', icon: '🚴', desc: 'Pick up & deliver orders to customers', color: '#EA580C', bg: '#FFF7ED'},
  {key: 'Admin', icon: '📊', desc: 'View all orders & system-wide status history', color: '#0369A1', bg: '#F0F9FF'},
];

export default function RoleSelectorScreen({navigation}: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.logo}>📍 NearFind</Text>
        <Text style={styles.subtitle}>Hyperlocal Product Discovery & Delivery</Text>
      </View>
      <Text style={styles.selectLabel}>Select your role</Text>
      <View style={styles.grid}>
        {roles.map(role => (
          <TouchableOpacity
            key={role.key}
            style={[styles.card, {backgroundColor: role.bg, borderColor: role.color + '30'}]}
            activeOpacity={0.7}
            onPress={() => {
              if (role.key === 'Customer') navigation.navigate('CustomerSearch');
              else if (role.key === 'Retailer') navigation.navigate('RetailerIncoming');
              else if (role.key === 'Delivery') navigation.navigate('DeliveryAvailable');
              else navigation.navigate('AdminPanel');
            }}>
            <Text style={styles.icon}>{role.icon}</Text>
            <Text style={[styles.roleName, {color: role.color}]}>{role.key}</Text>
            <Text style={styles.desc}>{role.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg},
  header: {alignItems: 'center', paddingTop: spacing.xxl + 16, paddingBottom: spacing.lg},
  logo: {fontSize: fontSize.hero, fontWeight: '800', color: colors.primary},
  subtitle: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs},
  selectLabel: {fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginBottom: spacing.md},
  grid: {flex: 1},
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  icon: {fontSize: 36, marginRight: spacing.md},
  roleName: {fontSize: fontSize.xl, fontWeight: '700', flex: 1},
  desc: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs, width: '100%', paddingLeft: 52},
});
