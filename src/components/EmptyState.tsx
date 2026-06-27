import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, spacing, fontSize} from '../theme/colors';

interface Props {
  icon: string;
  title: string;
  subtitle?: string;
}

export default function EmptyState({icon, title, subtitle}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, minHeight: 300},
  icon: {fontSize: 56, marginBottom: spacing.md},
  title: {fontSize: fontSize.lg, fontWeight: '600', color: colors.text, textAlign: 'center'},
  subtitle: {fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20},
});
