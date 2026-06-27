import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {Order} from '../context/AppContext';
import StatusBadge from './StatusBadge';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

interface Props {
  order: Order;
  onPress?: () => void;
  showRetailer?: boolean;
  showCustomer?: boolean;
}

export default function OrderCard({order, onPress, showRetailer = true, showCustomer = false}: Props) {
  const timeAgo = getTimeAgo(order.createdAt);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress}>
      <View style={styles.header}>
        <Text style={styles.orderId}>{order.id}</Text>
        <StatusBadge status={order.status} size="sm" />
      </View>
      <View style={styles.body}>
        <Text style={styles.productName}>{order.productName}</Text>
        <Text style={styles.detail}>Qty: {order.quantity} · ₹{order.totalPrice}</Text>
        {showRetailer && <Text style={styles.sub}>📍 {order.retailerName}</Text>}
        {showCustomer && <Text style={styles.sub}>👤 Customer #{order.customerId}</Text>}
      </View>
      <View style={styles.footer}>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>
    </TouchableOpacity>
  );
}

function getTimeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm},
  orderId: {fontSize: fontSize.sm, fontWeight: '700', color: colors.primaryDark, letterSpacing: 0.5},
  body: {marginBottom: spacing.sm},
  productName: {fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginBottom: 2},
  detail: {fontSize: fontSize.sm, color: colors.textSecondary},
  sub: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2},
  footer: {flexDirection: 'row', justifyContent: 'flex-end'},
  time: {fontSize: fontSize.xs, color: colors.textLight},
});
