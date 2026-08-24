import React, { useRef } from 'react';
import { Pressable, Animated, Text, View, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import { SPRING } from '../constants/config';

type IconCmp = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

interface Props {
  label: string;
  onPress: () => void;
  Icon: IconCmp;
  tint?: string;
}

export default function PillButton({ label, onPress, Icon, tint }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const color = tint || THEME.colors.signal.cyan;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, ...SPRING.BUTTON }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...SPRING.BUTTON }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{ height: 52 }}
    >
      <Animated.View
        style={[styles.pill, { transform: [{ scale }], borderColor: color + '66' }]}
      >
        <View style={styles.row}>
          <Icon size={24} color={color} strokeWidth={2.5} />
          <Text style={[styles.label, { color: THEME.colors.text.primary }]}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 52,
    minWidth: 120,
    paddingHorizontal: 20,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    backgroundColor: 'rgba(10,0,20,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: { fontSize: 14, fontWeight: '800', letterSpacing: 2, lineHeight: 24 },
});
