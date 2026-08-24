import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Zap, Trophy, Star, Play, CircleHelp, Settings } from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { Assets } from '../assets';
import DecorField from '../components/DecorField';
import CircuitNode from '../components/CircuitNode';
import HeroTitle from '../components/HeroTitle';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { TOTAL_LEVELS, TOTAL_STARS } from '../game/levels';

interface Props {
  unlockedUpTo: number;
  totalStars: number;
  bestStars: number;
  onPlay: () => void;
  onHowTo: (tab: 'guide' | 'settings') => void;
}

export default function MenuScreen({ unlockedUpTo, totalStars, bestStars, onPlay, onHowTo }: Props) {
  const heroScale = useRef(new Animated.Value(0.7)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const blockY = useRef(new Animated.Value(16)).current;
  const blockOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heroScale, { toValue: 1, tension: 90, friction: 9, useNativeDriver: true }),
      Animated.timing(heroOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(blockY, { toValue: 0, duration: 400, delay: 160, useNativeDriver: true }),
      Animated.timing(blockOpacity, { toValue: 1, duration: 400, delay: 160, useNativeDriver: true }),
    ]).start();
  }, [heroScale, heroOpacity, blockY, blockOpacity]);

  const levelsReached = Math.min(unlockedUpTo, TOTAL_LEVELS);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={Assets.bgMenu} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient
          colors={['rgba(10,0,20,0.82)', 'rgba(18,0,42,0.86)', 'rgba(26,0,56,0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>
      <DecorField opacity={0.5} />

      {/* progress badge */}
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Star size={16} color={THEME.colors.star} fill={THEME.colors.star} strokeWidth={2} />
          <Text style={styles.badgeText}>{`${totalStars} / ${TOTAL_STARS}`}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Animated.View style={{ opacity: heroOpacity, transform: [{ scale: heroScale }] }}>
          <CircuitNode size={104} />
        </Animated.View>

        <Animated.View
          style={[styles.block, { opacity: blockOpacity, transform: [{ translateY: blockY }] }]}
        >
          <HeroTitle text="COLOR CIRCUIT" />
          <Text style={styles.tagline}>ROTATE · CONNECT · POWER UP</Text>

          <View style={styles.stats}>
            <StatCard
              Icon={Zap}
              value={`${levelsReached}/${TOTAL_LEVELS}`}
              label="levels"
              valueColor={THEME.colors.signal.cyan}
            />
            <StatCard
              Icon={Trophy}
              value={`${bestStars}★`}
              label="best"
              valueColor={THEME.colors.star}
            />
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="PLAY" Icon={Play} onPress={onPlay} />
        <View style={styles.secondaryRow}>
          <SecondaryButton label="HOW TO PLAY" Icon={CircleHelp} onPress={() => onHowTo('guide')} />
          <SecondaryButton
            label="SETTINGS"
            Icon={Settings}
            tint={THEME.colors.signal.violet}
            onPress={() => onHowTo('settings')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.colors.bg.primary },
  topRow: { paddingTop: 44, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'flex-end' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(245,215,122,0.4)',
    backgroundColor: 'rgba(245,215,122,0.08)',
  },
  badgeText: { color: THEME.colors.star, fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  block: { alignItems: 'center', width: '100%', paddingHorizontal: 28, gap: 4 },
  tagline: {
    color: THEME.colors.signal.cyan,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  stats: { flexDirection: 'row', gap: 12, width: '100%' },
  footer: { paddingHorizontal: 28, paddingBottom: 40, gap: 12 },
  secondaryRow: { flexDirection: 'row', gap: 12 },
});
