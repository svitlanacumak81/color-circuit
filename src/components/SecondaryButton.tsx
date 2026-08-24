import React, { useRef } from 'react';
import { Pressable, Animated, Text, View, StyleSheet, ViewStyle } from 'react-native';
import { THEME } from '../constants/theme';
import { SPRING } from '../constants/config';

type IconCmp = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

interface Props {
  label: string;
  onPress: () => void;
  Icon?: IconCmp;
  tint?: string;
  style?: ViewStyle;
}

export default function SecondaryButton({ label, onPress, Icon, tint, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const color = tint || THEME.colors.signal.cyan;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, ...SPRING.BUTTON }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...SPRING.BUTTON }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.wrap, style]}
    >
      <Animated.View
        style={[
          styles.inner,
          { transform: [{ scale }], borderColor: color + '55' },
        ]}
      >
        <View style={styles.row}>
          {Icon ? <Icon size={24} color={color} strokeWidth={2.5} /> : null}
          <Text style={[styles.label, { color: THEME.colors.text.primary }]}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, height: 48 },
  inner: {
    flex: 1,
    height: 48,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: { fontSize: 13, fontWeight: '700', letterSpacing: 1.5, lineHeight: 24 },
});
