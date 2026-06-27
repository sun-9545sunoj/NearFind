import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useApp} from '../../context/AppContext';
import {colors, spacing, borderRadius, fontSize} from '../../theme/colors';

export default function PlaceOrderScreen({route, navigation}: any) {
  const {state, placeOrder} = useApp();
  const {productId, retailerId, price, stock} = route.params;
  const [quantity, setQuantity] = useState(1);

  const product = state.products.find(p => p.id === productId);
  const retailer = state.retailers.find(r => r.id === retailerId);

  // Get live stock from context (may have changed)
  const liveInv = retailer?.inventory.find(i => i.productId === productId);
  const liveStock = liveInv?.stock ?? stock;

  const total = price * quantity;

  const handlePlaceOrder = () => {
    if (quantity > liveStock) {
      Alert.alert('Insufficient Stock', `Only ${liveStock} items available.`);
      return;
    }
    const orderId = placeOrder('c1', retailerId, productId, quantity);
    if (orderId) {
      Alert.alert('Order Placed! 🎉', `Order ${orderId} has been placed.\nThe retailer has 60 seconds to respond.`, [
        {text: 'View My Orders', onPress: () => navigation.navigate('MyOrders')},
        {text: 'OK', onPress: () => navigation.popToTop()},
      ]);
    } else {
      Alert.alert('Order Failed', 'Could not place order. Please check stock availability.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Product</Text>
        <View style={styles.productRow}>
          <Text style={styles.emoji}>{product?.emoji}</Text>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product?.name}</Text>
            <Text style={styles.productCategory}>{product?.category}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Store</Text>
        <View style={styles.productRow}>
          <Text style={styles.emoji}>{retailer?.emoji}</Text>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{retailer?.name}</Text>
            <Text style={styles.productCategory}>{retailer?.address}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Quantity</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(q => Math.max(1, q - 1))}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity
            style={[styles.qtyBtn, quantity >= liveStock && styles.qtyBtnDisabled]}
            onPress={() => setQuantity(q => Math.min(liveStock, q + 1))}
            disabled={quantity >= liveStock}>
            <Text style={[styles.qtyBtnText, quantity >= liveStock && styles.qtyBtnTextDisabled]}>+</Text>
          </TouchableOpacity>
          <Text style={styles.stockInfo}>{liveStock} available</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>{product?.name} × {quantity}</Text>
          <Text style={styles.summaryText}>₹{price} each</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder} activeOpacity={0.8}>
        <Text style={styles.placeBtnText}>Place Order · ₹{total}</Text>
      </TouchableOpacity>

      <Text style={styles.note}>⏱ Retailer has 60 seconds to accept your order</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, padding: spacing.md},
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.sm + 2, borderWidth: 1, borderColor: colors.border,
  },
  sectionLabel: {fontSize: fontSize.xs, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm},
  productRow: {flexDirection: 'row', alignItems: 'center'},
  emoji: {fontSize: 32, marginRight: spacing.md},
  productInfo: {flex: 1},
  productName: {fontSize: fontSize.md, fontWeight: '600', color: colors.text},
  productCategory: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2},
  qtyRow: {flexDirection: 'row', alignItems: 'center'},
  qtyBtn: {
    width: 40, height: 40, borderRadius: borderRadius.md, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  qtyBtnDisabled: {backgroundColor: colors.surfaceAlt},
  qtyBtnText: {fontSize: 22, fontWeight: '700', color: colors.white},
  qtyBtnTextDisabled: {color: colors.textLight},
  qtyValue: {fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, marginHorizontal: spacing.lg},
  stockInfo: {fontSize: fontSize.sm, color: colors.textSecondary, marginLeft: 'auto'},
  summaryCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.primary + '40',
  },
  summaryLabel: {fontSize: fontSize.sm, fontWeight: '700', color: colors.primary, marginBottom: spacing.sm},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs},
  summaryText: {fontSize: fontSize.sm, color: colors.textSecondary},
  divider: {height: 1, backgroundColor: colors.border, marginVertical: spacing.sm},
  totalLabel: {fontSize: fontSize.lg, fontWeight: '700', color: colors.text},
  totalValue: {fontSize: fontSize.xl, fontWeight: '800', color: colors.primary},
  placeBtn: {
    backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: spacing.md,
    alignItems: 'center', elevation: 4,
    shadowColor: colors.primaryDark, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.3, shadowRadius: 6,
  },
  placeBtnText: {fontSize: fontSize.lg, fontWeight: '700', color: colors.white},
  note: {fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md},
});
