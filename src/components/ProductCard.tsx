import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {Product} from '../data/mockData';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

interface Props {
  product: Product;
  onPress: () => void;
}

export default function ProductCard({product, onPress}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{product.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  emoji: {fontSize: 24},
  info: {flex: 1},
  name: {fontSize: fontSize.md, fontWeight: '600', color: colors.text},
  category: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2},
  arrow: {fontSize: 24, color: colors.textLight, fontWeight: '300'},
});
