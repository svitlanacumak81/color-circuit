import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import { SignalKey, SIGNAL_COLORS } from '../constants/config';

interface Props {
  colorId: SignalKey;
  powered: boolean;
}

export default function GoalChip({ colorId, powered }: Props) {
  const color = SIGNAL_COLORS[colorId];
  return (
    <View
      style={[
        styles.chip,
        {
          borderColor: color + (powered ? 'AA' : '44'),
          backgroundColor: powered ? color + '22' : 'rgba(255,255,255,0.03)',
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          powered
            ? {
                backgroundColor: color,
                shadowColor: color,
                shadowOpacity: 0.9,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 0 },
                elevation: 6,
              }
            : { backgroundColor: 'transparent', borderWidth: 2, borderColor: color },
        ]}
      />
      <Text style={[styles.status, { color: powered ? color : THEME.colors.text.muted }]}>
        {powered ? 'ON' : 'OFF'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    height: 28,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
  },
  dot: { width: 12, height: 12, borderRadius: 6 },
  status: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
});
