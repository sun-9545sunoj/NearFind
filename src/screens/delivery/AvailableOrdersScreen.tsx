import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useApp} from '../../context/AppContext';
import EmptyState from '../../components/EmptyState';
import NotificationBanner from '../../components/NotificationBanner';
import {colors, spacing, borderRadius, fontSize} from '../../theme/colors';

const DELIVERY_PARTNER_ID = 'd1';

export default function AvailableOrdersScreen({navigation}: any) {
  const {state, acceptDelivery, getNotificationsForRole, dismissNotification} = useApp();
  const notifications = getNotificationsForRole('delivery');

  const availableOrders = state.orders
    .filter(o => o.status === 'ReadyForPickup' && !o.deliveryPartnerId)
    .sort((a, b) => b.createdAt - a.createdAt);

  const myActiveOrders = state.orders
    .filter(o => o.deliveryPartnerId === DELIVERY_PARTNER_ID && ['ReadyForPickup', 'PickedUp'].includes(o.status))
    .sort((a, b) => b.createdAt - a.createdAt);

  const handleAccept = (orderId: string) => {
    acceptDelivery(orderId, DELIVERY_PARTNER_ID);
    navigation.navigate('ActiveDelivery', {orderId});
  };

  return (
    <View style={styles.container}>
      <NotificationBanner notifications={notifications} onDismiss={dismissNotification} />
      {myActiveOrders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>🚴 My Active Deliveries</Text>
          {myActiveOrders.map(o => (
            <TouchableOpacity key={o.id} style={styles.activeCard}
              onPress={() => navigation.navigate('ActiveDelivery', {orderId: o.id})}>
              <Text style={styles.activeId}>{o.id}</Text>
              <Text style={styles.activeInfo}>{o.productName} · ₹{o.totalPrice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Text style={styles.sectionHeader}>📋 Available ({availableOrders.length})</Text>
      <FlatList
        data={availableOrders}
        keyExtractor={i => i.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.product}>{item.productName} × {item.quantity}</Text>
            <Text style={styles.info}>📍 {item.retailerName}</Text>
            <Text style={styles.info}>💰 ₹{item.totalPrice}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => handleAccept(item.id)}>
              <Text style={styles.btnText}>Accept Delivery</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="🚴" title="No deliveries available" subtitle="Orders ready for pickup will appear here" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  section: {paddingHorizontal: spacing.md},
  sectionHeader: {fontSize: fontSize.sm, fontWeight: '700', color: colors.textSecondary, padding: spacing.md, paddingBottom: spacing.sm},
  activeCard: {backgroundColor: '#FFF7ED', borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: '#FDBA74'},
  activeId: {fontSize: fontSize.sm, fontWeight: '700', color: '#C2410C'},
  activeInfo: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2},
  list: {paddingHorizontal: spacing.md, paddingBottom: spacing.xl, flexGrow: 1},
  card: {backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, elevation: 2},
  orderId: {fontSize: fontSize.sm, fontWeight: '700', color: colors.primaryDark, marginBottom: spacing.xs},
  product: {fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginBottom: spacing.xs},
  info: {fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 2},
  btn: {backgroundColor: '#EA580C', borderRadius: borderRadius.md, paddingVertical: spacing.sm + 4, alignItems: 'center', marginTop: spacing.sm},
  btnText: {fontSize: fontSize.md, fontWeight: '700', color: colors.white},
});
