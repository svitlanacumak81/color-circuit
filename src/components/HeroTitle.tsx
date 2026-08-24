import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { THEME } from '../constants/theme';

interface Props {
  text: string;
  size?: number;
  style?: TextStyle;
}

export default function HeroTitle({ text, size = 40, style }: Props) {
  return <Text style={[styles.title, { fontSize: size }, style]}>{text}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: THEME.colors.text.primary,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
    textShadowColor: THEME.colors.signal.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
});
