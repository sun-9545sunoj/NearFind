import React, {useState, useMemo} from 'react';
import {View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useApp} from '../../context/AppContext';
import ProductCard from '../../components/ProductCard';
import NotificationBanner from '../../components/NotificationBanner';
import {colors, spacing, borderRadius, fontSize} from '../../theme/colors';

export default function SearchScreen({navigation}: any) {
  const {state, getNotificationsForRole, dismissNotification} = useApp();
  const [query, setQuery] = useState('');
  const notifications = getNotificationsForRole('customer');

  const filtered = useMemo(() => {
    if (!query.trim()) return state.products;
    const q = query.toLowerCase();
    return state.products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [query, state.products]);

  return (
    <View style={styles.container}>
      <NotificationBanner notifications={notifications} onDismiss={dismissNotification} />
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products (e.g. Maggi, Butter)..."
          placeholderTextColor={colors.textLight}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ProductCard product={item} onPress={() => navigation.navigate('RetailerResults', {productId: item.id})} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No products found for "{query}"</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.ordersBtn} onPress={() => navigation.navigate('MyOrders')} activeOpacity={0.8}>
        <Text style={styles.ordersBtnIcon}>📦</Text>
        <Text style={styles.ordersBtnText}>My Orders</Text>
        {state.orders.filter(o => o.customerId === 'c1' && !['Delivered', 'Cancelled', 'Rejected'].includes(o.status)).length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {state.orders.filter(o => o.customerId === 'c1' && !['Delivered', 'Cancelled', 'Rejected'].includes(o.status)).length}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  searchWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, margin: spacing.md, borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, elevation: 2,
    shadowColor: colors.black, shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.08, shadowRadius: 4,
  },
  searchIcon: {fontSize: 18, marginRight: spacing.sm},
  searchInput: {flex: 1, fontSize: fontSize.md, color: colors.text, paddingVertical: spacing.md - 2},
  clearBtn: {fontSize: 16, color: colors.textLight, padding: spacing.xs},
  list: {paddingHorizontal: spacing.md, paddingBottom: 80},
  empty: {alignItems: 'center', paddingTop: spacing.xxl},
  emptyIcon: {fontSize: 48, marginBottom: spacing.md},
  emptyText: {fontSize: fontSize.md, color: colors.textSecondary},
  ordersBtn: {
    position: 'absolute', bottom: spacing.lg, right: spacing.lg,
    backgroundColor: colors.primary, borderRadius: borderRadius.full,
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md - 2, paddingHorizontal: spacing.lg,
    elevation: 6, shadowColor: colors.primaryDark, shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.3, shadowRadius: 8,
  },
  ordersBtnIcon: {fontSize: 18, marginRight: spacing.sm},
  ordersBtnText: {fontSize: fontSize.md, fontWeight: '700', color: colors.white},
  badge: {
    backgroundColor: colors.error, borderRadius: borderRadius.full,
    minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center',
    marginLeft: spacing.sm, paddingHorizontal: 5,
  },
  badgeText: {fontSize: 11, fontWeight: '700', color: colors.white},
});
