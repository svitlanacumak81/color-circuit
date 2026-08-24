import React, { useRef } from 'react';
import { Pressable, Animated, Text, View, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { THEME } from '../constants/theme';
import { SPRING } from '../constants/config';

type IconCmp = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

interface Props {
  label: string;
  onPress: () => void;
  Icon?: IconCmp;
  colors?: string[];
  style?: ViewStyle;
}

export default function PrimaryButton({ label, onPress, Icon, colors, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

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
      <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
        <LinearGradient
          colors={colors || THEME.gradients.play}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.grad}
        >
          <View style={styles.row}>
            {Icon ? <Icon size={24} color="#FFFFFF" strokeWidth={2.5} /> : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', height: 60 },
  grad: {
    height: 60,
    borderRadius: THEME.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    lineHeight: 24,
  },
});
