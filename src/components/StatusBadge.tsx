import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {OrderStatus} from '../context/AppContext';
import {colors, borderRadius, fontSize, spacing} from '../theme/colors';

const statusConfig: Record<OrderStatus, {bg: string; text: string; label: string}> = {
  Placed: {bg: '#DBEAFE', text: '#1D4ED8', label: 'Placed'},
  Accepted: {bg: '#E0E7FF', text: '#4338CA', label: 'Accepted'},
  Rejected: {bg: colors.errorLight, text: colors.error, label: 'Rejected'},
  Packed: {bg: '#FEF3C7', text: '#B45309', label: 'Packed'},
  ReadyForPickup: {bg: '#D1FAE5', text: '#065F46', label: 'Ready for Pickup'},
  PickedUp: {bg: colors.primaryLight, text: colors.primaryDark, label: 'Picked Up'},
  Delivered: {bg: colors.successLight, text: '#166534', label: 'Delivered'},
  Cancelled: {bg: colors.cancelledLight, text: '#475569', label: 'Cancelled'},
};

interface Props {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({status, size = 'md'}: Props) {
  const config = statusConfig[status] || statusConfig.Placed;
  return (
    <View style={[styles.badge, {backgroundColor: config.bg}, size === 'sm' && styles.badgeSm]}>
      <View style={[styles.dot, {backgroundColor: config.text}]} />
      <Text style={[styles.text, {color: config.text}, size === 'sm' && styles.textSm]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {paddingHorizontal: spacing.sm, paddingVertical: spacing.xs - 1},
  dot: {width: 6, height: 6, borderRadius: 3, marginRight: spacing.xs + 1},
  text: {fontSize: fontSize.sm, fontWeight: '600'},
  textSm: {fontSize: fontSize.xs},
});
