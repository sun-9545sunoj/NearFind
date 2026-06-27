import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useApp} from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import {colors, spacing, borderRadius, fontSize} from '../../theme/colors';

export default function AdminPanelScreen() {
  const {state} = useApp();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const allOrders = [...state.orders].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <View style={s.container}>
      <View style={s.statsRow}>
        <StatCard label="Total" value={allOrders.length} color={colors.primary} />
        <StatCard label="Active" value={allOrders.filter(o => !['Delivered','Cancelled','Rejected'].includes(o.status)).length} color={colors.accent} />
        <StatCard label="Delivered" value={allOrders.filter(o => o.status === 'Delivered').length} color={colors.success} />
      </View>
      <FlatList
        data={allOrders}
        keyExtractor={i => i.id}
        renderItem={({item}) => (
          <View style={s.card}>
            <View style={s.header}>
              <Text style={s.orderId}>{item.id}</Text>
              <StatusBadge status={item.status} size="sm" />
            </View>
            <Text style={s.product}>{item.productName} × {item.quantity} · ₹{item.totalPrice}</Text>
            <Text style={s.info}>🏪 {item.retailerName} → 👤 #{item.customerId}</Text>
            {item.deliveryPartnerId && <Text style={s.info}>🚴 Delivery #{item.deliveryPartnerId}</Text>}
            <View style={s.timeline}>
              <Text style={s.timelineTitle}>History</Text>
              {item.statusHistory.map((e, i) => (
                <Text key={i} style={s.timelineEntry}>
                  {e.status} — {new Date(e.timestamp).toLocaleTimeString()}
                </Text>
              ))}
            </View>
          </View>
        )}
        contentContainerStyle={s.list}
        ListEmptyComponent={<EmptyState icon="📊" title="No orders in system" subtitle="Orders will appear here as they are placed" />}
      />
    </View>
  );
}

function StatCard({label, value, color}: {label: string; value: number; color: string}) {
  return (
    <View style={[s.stat, {borderTopColor: color}]}>
      <Text style={[s.statValue, {color}]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  statsRow: {flexDirection: 'row', padding: spacing.md, gap: spacing.sm},
  stat: {
    flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md,
    alignItems: 'center', borderTopWidth: 3, borderWidth: 1, borderColor: colors.border,
  },
  statValue: {fontSize: fontSize.xxl, fontWeight: '800'},
  statLabel: {fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2},
  list: {paddingHorizontal: spacing.md, paddingBottom: spacing.xl, flexGrow: 1},
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm},
  orderId: {fontSize: fontSize.sm, fontWeight: '700', color: colors.primaryDark},
  product: {fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginBottom: spacing.xs},
  info: {fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 2},
  timeline: {marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border},
  timelineTitle: {fontSize: fontSize.xs, fontWeight: '700', color: colors.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.xs},
  timelineEntry: {fontSize: fontSize.xs, color: colors.textSecondary, marginBottom: 2, paddingLeft: spacing.sm},
});
