import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { THEME } from '../constants/theme';

interface Props {
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

/** Sci-fi HUD corner brackets around content (not a full frame). */
export default function HudFrame({ children, color, size = 20, style }: Props) {
  const c = color || THEME.colors.signal.cyan;
  const B = 2;
  const base: ViewStyle = { position: 'absolute', width: size, height: size, borderColor: c };
  return (
    <View style={[styles.wrap, style]}>
      {children}
      <View style={[base, { top: -1, left: -1, borderTopWidth: B, borderLeftWidth: B }]} />
      <View style={[base, { top: -1, right: -1, borderTopWidth: B, borderRightWidth: B }]} />
      <View style={[base, { bottom: -1, left: -1, borderBottomWidth: B, borderLeftWidth: B }]} />
      <View style={[base, { bottom: -1, right: -1, borderBottomWidth: B, borderRightWidth: B }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
