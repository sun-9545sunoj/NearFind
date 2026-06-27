import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useApp} from '../../context/AppContext';
import {colors, spacing, borderRadius, fontSize} from '../../theme/colors';

export default function RetailerResultsScreen({route, navigation}: any) {
  const {state} = useApp();
  const {productId} = route.params;
  const product = state.products.find(p => p.id === productId);

  const retailersWithProduct = state.retailers
    .map(r => {
      const inv = r.inventory.find(i => i.productId === productId);
      return inv ? {retailer: r, price: inv.price, stock: inv.stock} : null;
    })
    .filter(Boolean) as {retailer: (typeof state.retailers)[0]; price: number; stock: number}[];

  return (
    <View style={styles.container}>
      {product && (
        <View style={styles.productHeader}>
          <Text style={styles.emoji}>{product.emoji}</Text>
          <View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productCategory}>{product.category}</Text>
          </View>
        </View>
      )}
      <Text style={styles.sectionTitle}>Available at {retailersWithProduct.length} nearby store{retailersWithProduct.length !== 1 ? 's' : ''}</Text>
      <FlatList
        data={retailersWithProduct}
        keyExtractor={item => item.retailer.id}
        renderItem={({item}) => {
          const outOfStock = item.stock <= 0;
          return (
            <TouchableOpacity
              style={[styles.retailerCard, outOfStock && styles.retailerCardDisabled]}
              activeOpacity={outOfStock ? 1 : 0.7}
              disabled={outOfStock}
              onPress={() => navigation.navigate('PlaceOrder', {
                productId, retailerId: item.retailer.id, price: item.price, stock: item.stock,
              })}>
              <View style={styles.retailerHeader}>
                <Text style={styles.retailerEmoji}>{item.retailer.emoji}</Text>
                <View style={styles.retailerInfo}>
                  <Text style={[styles.retailerName, outOfStock && styles.textDisabled]}>{item.retailer.name}</Text>
                  <Text style={[styles.retailerAddress, outOfStock && styles.textDisabled]}>{item.retailer.address} · {item.retailer.distance}</Text>
                </View>
              </View>
              <View style={styles.retailerFooter}>
                <Text style={[styles.price, outOfStock && styles.textDisabled]}>₹{item.price}</Text>
                {outOfStock ? (
                  <View style={styles.outOfStockBadge}>
                    <Text style={styles.outOfStockText}>Out of Stock</Text>
                  </View>
                ) : (
                  <View style={styles.inStockBadge}>
                    <Text style={styles.inStockText}>{item.stock} in stock</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏪</Text>
            <Text style={styles.emptyText}>No nearby retailers carry this product</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  productHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.lg, backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  emoji: {fontSize: 40, marginRight: spacing.md},
  productName: {fontSize: fontSize.xl, fontWeight: '700', color: colors.text},
  productCategory: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2},
  sectionTitle: {fontSize: fontSize.sm, fontWeight: '600', color: colors.textSecondary, padding: spacing.md, paddingBottom: spacing.sm},
  list: {paddingHorizontal: spacing.md, paddingBottom: spacing.xl},
  retailerCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.sm + 2, borderWidth: 1, borderColor: colors.border,
    elevation: 2, shadowColor: colors.black, shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.08, shadowRadius: 4,
  },
  retailerCardDisabled: {backgroundColor: colors.surfaceAlt, opacity: 0.7},
  retailerHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md},
  retailerEmoji: {fontSize: 28, marginRight: spacing.md},
  retailerInfo: {flex: 1},
  retailerName: {fontSize: fontSize.md, fontWeight: '600', color: colors.text},
  retailerAddress: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2},
  textDisabled: {color: colors.textLight},
  retailerFooter: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  price: {fontSize: fontSize.xl, fontWeight: '800', color: colors.primary},
  outOfStockBadge: {backgroundColor: colors.errorLight, paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs, borderRadius: borderRadius.full},
  outOfStockText: {fontSize: fontSize.xs, fontWeight: '600', color: colors.error},
  inStockBadge: {backgroundColor: colors.successLight, paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs, borderRadius: borderRadius.full},
  inStockText: {fontSize: fontSize.xs, fontWeight: '600', color: '#166534'},
  empty: {alignItems: 'center', paddingTop: spacing.xxl},
  emptyIcon: {fontSize: 48, marginBottom: spacing.md},
  emptyText: {fontSize: fontSize.md, color: colors.textSecondary},
});
