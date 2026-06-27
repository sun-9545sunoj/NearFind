import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView} from 'react-native';
import {useApp, type OrderStatus} from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';
import {colors, spacing, borderRadius, fontSize} from '../../theme/colors';

export default function OrderActionsScreen({route, navigation}: any) {
  const {state, acceptOrder, rejectOrder, updateOrderStatus} = useApp();
  const {orderId} = route.params;
  const order = state.orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  const handleAccept = () => {
    acceptOrder(orderId);
    Alert.alert('Order Accepted', `${orderId} has been accepted.`);
  };

  const handleReject = () => {
    Alert.alert('Reject Order?', 'This will notify the customer.', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Reject', style: 'destructive', onPress: () => { rejectOrder(orderId); navigation.goBack(); }},
    ]);
  };

  const handleStatusUpdate = (status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.orderId}>{order.id}</Text>
          <StatusBadge status={order.status} />
        </View>
        <View style={styles.detailSection}>
          <DetailRow label="Product" value={`${order.productName} × ${order.quantity}`} />
          <DetailRow label="Total" value={`₹${order.totalPrice}`} />
          <DetailRow label="Customer" value={`Customer #${order.customerId}`} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Status History</Text>
        {order.statusHistory.map((entry, idx) => (
          <View key={idx} style={styles.historyRow}>
            <View style={[styles.historyDot, idx === order.statusHistory.length - 1 && styles.historyDotActive]} />
            {idx < order.statusHistory.length - 1 && <View style={styles.historyLine} />}
            <View style={styles.historyInfo}>
              <Text style={styles.historyStatus}>{entry.status}</Text>
              <Text style={styles.historyTime}>{new Date(entry.timestamp).toLocaleTimeString()}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Actions</Text>
        {order.status === 'Placed' && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept} activeOpacity={0.8}>
              <Text style={styles.acceptBtnText}>✓ Accept Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} onPress={handleReject} activeOpacity={0.8}>
              <Text style={styles.rejectBtnText}>✕ Reject</Text>
            </TouchableOpacity>
          </View>
        )}
        {order.status === 'Accepted' && (
          <TouchableOpacity style={styles.statusBtn} onPress={() => handleStatusUpdate('Packed')} activeOpacity={0.8}>
            <Text style={styles.statusBtnText}>📦 Mark as Packed</Text>
          </TouchableOpacity>
        )}
        {order.status === 'Packed' && (
          <TouchableOpacity style={styles.statusBtn} onPress={() => handleStatusUpdate('ReadyForPickup')} activeOpacity={0.8}>
            <Text style={styles.statusBtnText}>🚀 Ready for Pickup</Text>
          </TouchableOpacity>
        )}
        {['ReadyForPickup', 'PickedUp', 'Delivered', 'Rejected', 'Cancelled'].includes(order.status) && (
          <Text style={styles.noActions}>No further actions available for this order.</Text>
        )}
      </View>
    </ScrollView>
  );
}

function DetailRow({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, padding: spacing.md},
  errorText: {fontSize: fontSize.md, color: colors.error, textAlign: 'center', marginTop: spacing.xxl},
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  headerRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md},
  orderId: {fontSize: fontSize.xl, fontWeight: '700', color: colors.primaryDark},
  detailSection: {borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm},
  detailRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs + 2},
  detailLabel: {fontSize: fontSize.sm, color: colors.textSecondary},
  detailValue: {fontSize: fontSize.sm, fontWeight: '600', color: colors.text},
  sectionTitle: {fontSize: fontSize.sm, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.md},
  historyRow: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm, paddingLeft: spacing.xs},
  historyDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.textLight, marginTop: 4, marginRight: spacing.md, zIndex: 1},
  historyDotActive: {backgroundColor: colors.primary},
  historyLine: {position: 'absolute', left: spacing.xs + 4, top: 14, width: 2, height: 24, backgroundColor: colors.border},
  historyInfo: {flex: 1},
  historyStatus: {fontSize: fontSize.sm, fontWeight: '600', color: colors.text},
  historyTime: {fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 1},
  actionsCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border,
  },
  actionRow: {flexDirection: 'row', gap: spacing.sm},
  acceptBtn: {
    flex: 2, backgroundColor: colors.success, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: 'center',
  },
  acceptBtnText: {fontSize: fontSize.md, fontWeight: '700', color: colors.white},
  rejectBtn: {
    flex: 1, backgroundColor: colors.errorLight, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.error,
  },
  rejectBtnText: {fontSize: fontSize.md, fontWeight: '700', color: colors.error},
  statusBtn: {
    backgroundColor: colors.primary, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: 'center',
  },
  statusBtnText: {fontSize: fontSize.md, fontWeight: '700', color: colors.white},
  noActions: {fontSize: fontSize.sm, color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center'},
});
