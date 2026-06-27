import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useApp} from '../../context/AppContext';
import NotificationBanner from '../../components/NotificationBanner';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import {colors, spacing, borderRadius, fontSize} from '../../theme/colors';

const RETAILER_TABS = [
  {id: 'r1', name: 'Sharma Kirana', emoji: '🏪'},
  {id: 'r2', name: 'Quick Mart', emoji: '🛒'},
  {id: 'r3', name: 'Daily Needs', emoji: '🏬'},
];

export default function IncomingOrdersScreen({navigation}: any) {
  const {state, getNotificationsForRole, dismissNotification} = useApp();
  const [selectedRetailer, setSelectedRetailer] = useState('r1');
  const [, setTick] = useState(0);
  const notifications = getNotificationsForRole('retailer');

  // Force re-render every second for countdown timers
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const orders = state.orders
    .filter(o => o.retailerId === selectedRetailer)
    .sort((a, b) => b.createdAt - a.createdAt);

  const pendingOrders = orders.filter(o => o.status === 'Placed');
  const activeOrders = orders.filter(o => ['Accepted', 'Packed', 'ReadyForPickup'].includes(o.status));
  const completedOrders = orders.filter(o => ['PickedUp', 'Delivered', 'Rejected', 'Cancelled'].includes(o.status));

  return (
    <View style={styles.container}>
      <NotificationBanner notifications={notifications} onDismiss={dismissNotification} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow} contentContainerStyle={styles.tabContent}>
        {RETAILER_TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedRetailer === tab.id && styles.tabActive]}
            onPress={() => setSelectedRetailer(tab.id)}>
            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
            <Text style={[styles.tabText, selectedRetailer === tab.id && styles.tabTextActive]}>{tab.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={[...pendingOrders, ...activeOrders, ...completedOrders]}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <View>
            {index === 0 && pendingOrders.length > 0 && <Text style={styles.sectionHeader}>⏳ Pending ({pendingOrders.length})</Text>}
            {index === pendingOrders.length && activeOrders.length > 0 && <Text style={styles.sectionHeader}>📦 Active ({activeOrders.length})</Text>}
            {index === pendingOrders.length + activeOrders.length && completedOrders.length > 0 && (
              <Text style={styles.sectionHeader}>✅ Completed / Closed ({completedOrders.length})</Text>
            )}
            <RetailerOrderCard order={item} onPress={() => navigation.navigate('OrderActions', {orderId: item.id})} />
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="📋" title="No orders yet" subtitle="Orders from customers will appear here" />}
      />
    </View>
  );
}

function RetailerOrderCard({order, onPress}: {order: any; onPress: () => void}) {
  const remaining = order.status === 'Placed' ? Math.max(0, 60 - Math.floor((Date.now() - order.createdAt) / 1000)) : null;

  return (
    <TouchableOpacity style={[styles.orderCard, order.status === 'Placed' && styles.orderCardUrgent]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        <StatusBadge status={order.status} size="sm" />
      </View>
      <Text style={styles.orderProduct}>{order.productName} × {order.quantity}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.orderPrice}>₹{order.totalPrice}</Text>
        {remaining !== null && (
          <View style={[styles.timerBadge, remaining <= 15 && styles.timerBadgeUrgent]}>
            <Text style={[styles.timerText, remaining <= 15 && styles.timerTextUrgent]}>⏱ {remaining}s</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  tabRow: {maxHeight: 56, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface},
  tabContent: {paddingHorizontal: spacing.sm, alignItems: 'center'},
  tab: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
    marginHorizontal: spacing.xs, borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceAlt,
  },
  tabActive: {backgroundColor: colors.primary},
  tabEmoji: {fontSize: 16, marginRight: spacing.xs + 2},
  tabText: {fontSize: fontSize.sm, fontWeight: '600', color: colors.textSecondary},
  tabTextActive: {color: colors.white},
  list: {paddingHorizontal: spacing.md, paddingBottom: spacing.xl, flexGrow: 1},
  sectionHeader: {
    fontSize: fontSize.sm, fontWeight: '700', color: colors.textSecondary,
    marginTop: spacing.md, marginBottom: spacing.sm,
  },
  orderCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
    elevation: 2, shadowColor: colors.black, shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.08, shadowRadius: 4,
  },
  orderCardUrgent: {borderColor: colors.accent, borderWidth: 1.5},
  orderHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm},
  orderId: {fontSize: fontSize.sm, fontWeight: '700', color: colors.primaryDark, letterSpacing: 0.5},
  orderProduct: {fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginBottom: spacing.sm},
  orderFooter: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  orderPrice: {fontSize: fontSize.lg, fontWeight: '800', color: colors.primary},
  timerBadge: {backgroundColor: colors.warningLight, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full},
  timerBadgeUrgent: {backgroundColor: colors.errorLight},
  timerText: {fontSize: fontSize.sm, fontWeight: '600', color: '#B45309'},
  timerTextUrgent: {color: colors.error},
});
