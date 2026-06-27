import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {useApp} from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';
import {colors, spacing, borderRadius, fontSize} from '../../theme/colors';

export default function ActiveDeliveryScreen({route, navigation}: any) {
  const {state, updateOrderStatus} = useApp();
  const {orderId} = route.params;
  const order = state.orders.find(o => o.id === orderId);

  if (!order) {
    return <View style={s.container}><Text style={s.error}>Order not found</Text></View>;
  }

  const handlePickedUp = () => {
    updateOrderStatus(orderId, 'PickedUp');
  };

  const handleDelivered = () => {
    Alert.alert('Confirm Delivery', 'Mark this order as delivered?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Confirm', onPress: () => {
        updateOrderStatus(orderId, 'Delivered');
        navigation.goBack();
      }},
    ]);
  };

  return (
    <ScrollView style={s.container}>
      <View style={s.card}>
        <View style={s.row}><Text style={s.orderId}>{order.id}</Text><StatusBadge status={order.status} /></View>
        <View style={s.detail}><Text style={s.label}>Product</Text><Text style={s.value}>{order.productName} × {order.quantity}</Text></View>
        <View style={s.detail}><Text style={s.label}>Total</Text><Text style={s.value}>₹{order.totalPrice}</Text></View>
        <View style={s.detail}><Text style={s.label}>Pickup</Text><Text style={s.value}>📍 {order.retailerName}</Text></View>
        <View style={s.detail}><Text style={s.label}>Deliver to</Text><Text style={s.value}>👤 Customer #{order.customerId}</Text></View>
      </View>

      <View style={s.card}>
        <Text style={s.section}>Status Timeline</Text>
        {order.statusHistory.map((e, i) => (
          <View key={i} style={s.histRow}>
            <View style={[s.dot, i === order.statusHistory.length - 1 && s.dotActive]} />
            <View><Text style={s.histStatus}>{e.status}</Text><Text style={s.histTime}>{new Date(e.timestamp).toLocaleTimeString()}</Text></View>
          </View>
        ))}
      </View>

      <View style={s.actions}>
        {(order.status === 'ReadyForPickup' && order.deliveryPartnerId) && (
          <TouchableOpacity style={s.pickupBtn} onPress={handlePickedUp}><Text style={s.btnText}>📦 Mark Picked Up</Text></TouchableOpacity>
        )}
        {order.status === 'PickedUp' && (
          <TouchableOpacity style={s.deliverBtn} onPress={handleDelivered}><Text style={s.btnText}>✅ Mark Delivered</Text></TouchableOpacity>
        )}
        {order.status === 'Delivered' && (
          <View style={s.doneCard}><Text style={s.doneText}>🎉 Delivery Complete!</Text></View>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, padding: spacing.md},
  error: {fontSize: fontSize.md, color: colors.error, textAlign: 'center', marginTop: spacing.xxl},
  card: {backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md},
  orderId: {fontSize: fontSize.xl, fontWeight: '700', color: colors.primaryDark},
  detail: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs + 2, borderTopWidth: 1, borderTopColor: colors.border},
  label: {fontSize: fontSize.sm, color: colors.textSecondary},
  value: {fontSize: fontSize.sm, fontWeight: '600', color: colors.text, maxWidth: '60%', textAlign: 'right'},
  section: {fontSize: fontSize.sm, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.md},
  histRow: {flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, paddingLeft: spacing.xs},
  dot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.textLight, marginRight: spacing.md},
  dotActive: {backgroundColor: colors.primary},
  histStatus: {fontSize: fontSize.sm, fontWeight: '600', color: colors.text},
  histTime: {fontSize: fontSize.xs, color: colors.textSecondary},
  actions: {marginBottom: spacing.xl},
  pickupBtn: {backgroundColor: '#EA580C', borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: 'center'},
  deliverBtn: {backgroundColor: colors.success, borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: 'center'},
  btnText: {fontSize: fontSize.lg, fontWeight: '700', color: colors.white},
  doneCard: {backgroundColor: colors.successLight, borderRadius: borderRadius.md, padding: spacing.lg, alignItems: 'center'},
  doneText: {fontSize: fontSize.lg, fontWeight: '700', color: '#166534'},
});
