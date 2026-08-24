import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { Zap } from 'lucide-react-native';
import { THEME } from '../constants/theme';

interface Props {
  moves: number;
}

export default function MovesBadge({ moves }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const low = moves <= 2;
  const color = low ? THEME.colors.signal.magenta : THEME.colors.signal.cyan;

  // One-shot pulse whenever the count changes.
  useEffect(() => {
    scale.setValue(1.25);
    Animated.spring(scale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }).start();
  }, [moves, scale]);

  return (
    <Animated.View
      style={[
        styles.pill,
        { borderColor: color + '66', transform: [{ scale }] },
      ]}
    >
      <Zap size={16} color={color} strokeWidth={2.5} />
      <Text style={[styles.text, { color }]}>{`MOVES ${moves}`}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    backgroundColor: 'rgba(0,212,255,0.08)',
  },
  text: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
});
