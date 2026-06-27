import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import type {AppNotification} from '../context/AppContext';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

const typeColors: Record<string, {bg: string; border: string; icon: string}> = {
  info: {bg: '#EFF6FF', border: '#93C5FD', icon: 'ℹ️'},
  success: {bg: colors.successLight, border: colors.success, icon: '✅'},
  warning: {bg: colors.warningLight, border: colors.warning, icon: '⚠️'},
  error: {bg: colors.errorLight, border: colors.error, icon: '❌'},
};

interface Props {
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
}

export default function NotificationBanner({notifications, onDismiss}: Props) {
  if (notifications.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications.slice(-3)}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const tc = typeColors[item.type] || typeColors.info;
          return (
            <View style={[styles.banner, {backgroundColor: tc.bg, borderLeftColor: tc.border}]}>
              <Text style={styles.icon}>{tc.icon}</Text>
              <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
              <TouchableOpacity onPress={() => onDismiss(item.id)} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {paddingHorizontal: spacing.md, paddingTop: spacing.sm},
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm + 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs + 2,
    borderLeftWidth: 4,
  },
  icon: {fontSize: 16, marginRight: spacing.sm},
  message: {flex: 1, fontSize: fontSize.sm, color: colors.text, lineHeight: 18},
  close: {fontSize: 14, color: colors.textSecondary, paddingLeft: spacing.sm},
});
