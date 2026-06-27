import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useApp} from '../../context/AppContext';
import OrderCard from '../../components/OrderCard';
import NotificationBanner from '../../components/NotificationBanner';
import EmptyState from '../../components/EmptyState';
import {colors, spacing, fontSize} from '../../theme/colors';

export default function MyOrdersScreen() {
  const {state, getNotificationsForRole, dismissNotification} = useApp();
  const [, setTick] = useState(0);
  const notifications = getNotificationsForRole('customer');

  // Force re-render every 5s to update "time ago" and live status
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const customerOrders = state.orders
    .filter(o => o.customerId === 'c1')
    .sort((a, b) => b.createdAt - a.createdAt);

  const activeOrders = customerOrders.filter(o => !['Delivered', 'Cancelled', 'Rejected'].includes(o.status));
  const pastOrders = customerOrders.filter(o => ['Delivered', 'Cancelled', 'Rejected'].includes(o.status));

  return (
    <View style={styles.container}>
      <NotificationBanner notifications={notifications} onDismiss={dismissNotification} />
      <FlatList
        data={[...activeOrders, ...pastOrders]}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <View>
            {index === 0 && activeOrders.length > 0 && <Text style={styles.sectionHeader}>Active Orders</Text>}
            {index === activeOrders.length && pastOrders.length > 0 && <Text style={styles.sectionHeader}>Past Orders</Text>}
            <OrderCard order={item} showRetailer />
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="📦" title="No orders yet" subtitle="Search for products and place your first order!" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  list: {paddingHorizontal: spacing.md, paddingBottom: spacing.xl, flexGrow: 1},
  sectionHeader: {
    fontSize: fontSize.sm, fontWeight: '700', color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginTop: spacing.md, marginBottom: spacing.sm,
  },
});
