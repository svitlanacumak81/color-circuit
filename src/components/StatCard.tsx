import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

type IconCmp = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

interface Props {
  Icon: IconCmp;
  value: string;
  label: string;
  valueColor: string;
}

/** Uniform stat pill — equal width via flex:1 in a horizontal row, intrinsic height. */
export default function StatCard({ Icon, value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '44' }]}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '1A' }]}>
        <Icon size={22} color={valueColor} strokeWidth={2.5} />
      </View>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
  label: {
    color: THEME.colors.text.secondary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});
