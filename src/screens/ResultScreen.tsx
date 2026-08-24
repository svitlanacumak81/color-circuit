import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Star, ArrowRight, RotateCcw, Home } from 'lucide-react-native';
import { THEME } from '../constants/theme';
import DecorField from '../components/DecorField';
import HudFrame from '../components/HudFrame';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

export interface ResultData {
  win: boolean;
  stars: number;
  used: number;
  moveLimit: number;
  done: number;
  total: number;
  levelId: number;
}

interface Props {
  result: ResultData;
  hasNext: boolean;
  onNext: () => void;
  onPlayAgain: () => void;
  onMenu: () => void;
}

function StarRow({ stars }: { stars: number }) {
  const anims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(
      140,
      anims.map((a, i) =>
        Animated.spring(a, {
          toValue: i < stars ? 1 : 0.55,
          tension: 160,
          friction: 7,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [anims, stars]);

  return (
    <View style={styles.starRow}>
      {[0, 1, 2].map((i) => {
        const earned = i < stars;
        return (
          <Animated.View key={i} style={{ transform: [{ scale: anims[i] }] }}>
            <Star
              size={44}
              color={THEME.colors.star}
              fill={earned ? THEME.colors.star : 'transparent'}
              strokeWidth={2}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

export default function ResultScreen({ result, hasNext, onNext, onPlayAgain, onMenu }: Props) {
  const { win } = result;
  const accent = win ? THEME.colors.signal.cyan : THEME.colors.signal.magenta;

  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, tension: 120, friction: 9, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [cardScale, cardOpacity]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#050008', '#12001F', '#0A0014']}
        style={StyleSheet.absoluteFill}
      />
      <DecorField opacity={0.4} />

      <View style={styles.center}>
        <Animated.View
          style={{ opacity: cardOpacity, transform: [{ scale: cardScale }] }}
          pointerEvents="box-none"
        >
          <HudFrame color={accent} size={22}>
            <View style={[styles.card, { borderColor: accent + '55' }]}>
              <Text style={[styles.heading, { color: accent, textShadowColor: accent }]}>
                {win ? 'CIRCUIT COMPLETE' : 'SIGNAL LOST'}
              </Text>

              {win ? (
                <>
                  <StarRow stars={result.stars} />
                  <Text style={styles.detail}>{`MOVES ${result.used} / ${result.moveLimit}`}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.subhead}>OUT OF MOVES</Text>
                  <Text
                    style={[styles.detail, { color: accent }]}
                  >{`${result.done} / ${result.total} CIRCUITS`}</Text>
                </>
              )}

              <View style={styles.buttons}>
                {win && hasNext ? (
                  <PrimaryButton label="NEXT LEVEL" Icon={ArrowRight} onPress={onNext} />
                ) : (
                  <PrimaryButton
                    label="PLAY AGAIN"
                    Icon={RotateCcw}
                    colors={win ? THEME.gradients.play : ['#FF2FB0', '#8B00FF']}
                    onPress={onPlayAgain}
                  />
                )}

                <View style={styles.secondaryRow}>
                  {win && hasNext ? (
                    <SecondaryButton label="PLAY AGAIN" Icon={RotateCcw} onPress={onPlayAgain} />
                  ) : null}
                  <SecondaryButton
                    label="MENU"
                    Icon={Home}
                    tint={THEME.colors.signal.violet}
                    onPress={onMenu}
                  />
                </View>
              </View>
            </View>
          </HudFrame>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.colors.bg.darker },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  card: {
    width: '100%',
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subhead: {
    color: THEME.colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 16,
  },
  starRow: { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 8 },
  detail: {
    color: THEME.colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 12,
  },
  buttons: { width: '100%', marginTop: 28, gap: 12 },
  secondaryRow: { flexDirection: 'row', gap: 12 },
});
