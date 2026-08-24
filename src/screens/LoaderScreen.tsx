import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { THEME } from '../constants/theme';
import { LOADER_DURATION_MS } from '../constants/config';
import { Assets } from '../assets';
import DecorField from '../components/DecorField';
import CircuitNode from '../components/CircuitNode';
import HudFrame from '../components/HudFrame';
import ProgressBar from '../components/ProgressBar';

interface Props {
  onDone: () => void;
}

export default function LoaderScreen({ onDone }: Props) {
  const nodeScale = useRef(new Animated.Value(0.6)).current;
  const nodeOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(12)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const rootOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(nodeScale, { toValue: 1, tension: 90, friction: 9, useNativeDriver: true }),
      Animated.timing(nodeOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(titleY, { toValue: 0, duration: 400, delay: 250, useNativeDriver: true }),
      Animated.timing(titleOpacity, { toValue: 1, duration: 400, delay: 250, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(rootOpacity, { toValue: 0, duration: 400, useNativeDriver: true }).start(
        () => onDone(),
      );
    }, LOADER_DURATION_MS);

    return () => clearTimeout(timer);
  }, [nodeScale, nodeOpacity, titleY, titleOpacity, rootOpacity, onDone]);

  return (
    <Animated.View style={[styles.root, { opacity: rootOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={Assets.bgLoader} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,18,22,0.97)', 'rgba(0,30,38,0.98)', 'rgba(0,10,14,0.99)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>
      <DecorField dense opacity={0.7} />

      <View style={styles.center}>
        <HudFrame color="rgba(0,212,255,0.35)" size={18} style={styles.card}>
          <View style={styles.cardInner}>
            <Animated.View style={{ opacity: nodeOpacity, transform: [{ scale: nodeScale }] }}>
              <CircuitNode size={84} />
            </Animated.View>
          </View>
        </HudFrame>

        <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}>
          <Text style={styles.title}>COLOR CIRCUIT</Text>
          <Text style={styles.subtitle}>ROUTE THE SIGNAL</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <ProgressBar durationMs={LOADER_DURATION_MS} />
        <Text style={styles.loading}>LOADING…</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.colors.bg.darker },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28 },
  card: {
    borderRadius: 20,
  },
  cardInner: {
    width: 140,
    height: 140,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: THEME.colors.text.primary,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
    textShadowColor: THEME.colors.signal.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subtitle: {
    color: THEME.colors.signal.cyan,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 8,
  },
  footer: { alignItems: 'center', paddingBottom: 60, gap: 10 },
  loading: { color: THEME.colors.text.muted, fontSize: 10, letterSpacing: 2, fontWeight: '600' },
});
