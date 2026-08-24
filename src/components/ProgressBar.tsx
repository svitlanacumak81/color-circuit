import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { THEME } from '../constants/theme';

interface Props {
  durationMs: number;
  width?: number;
}

/** One-shot loader progress bar (0 -> 100% over durationMs). */
export default function ProgressBar({ durationMs, width = 160 }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: durationMs,
      useNativeDriver: false, // width animation
    }).start();
  }, [durationMs, progress]);

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  return (
    <View style={[styles.track, { width }]}>
      <Animated.View style={{ width: fillWidth, height: '100%' }}>
        <LinearGradient
          colors={[THEME.colors.signal.cyan, THEME.colors.signal.violet]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
});
