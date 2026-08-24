import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { THEME } from '../constants/theme';
import { SCREEN } from '../constants/config';
import DecorField from '../components/DecorField';
import ScreenHeader from '../components/ScreenHeader';
import LevelNode, { NodeStatus } from '../components/LevelNode';
import { LEVELS, TOTAL_LEVELS } from '../game/levels';

interface Props {
  unlockedUpTo: number;
  stars: Record<number, number>;
  onBack: () => void;
  onSelect: (id: number) => void;
}

const COLS = 2;
const ROWS = 5;
const GAP = 16;

export default function LevelMapScreen({ unlockedUpTo, stars, onBack, onSelect }: Props) {
  const availW = SCREEN.W - 40;
  const availH = SCREEN.H - 72 - 72;
  const byW = (availW - GAP) / COLS;
  const byH = (availH - GAP * (ROWS - 1)) / ROWS;
  const size = Math.floor(Math.min(byW, byH, 132));

  const statusFor = (id: number): NodeStatus => {
    if ((stars[id] || 0) > 0) return 'completed';
    if (id <= unlockedUpTo) return 'available';
    return 'locked';
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#08000F', '#12002A', '#1A0038']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <DecorField opacity={0.4} />

      <ScreenHeader
        title="SELECT LEVEL"
        onBack={onBack}
        rightSlot={
          <Text style={styles.count}>{`${Math.min(unlockedUpTo, TOTAL_LEVELS)}/${TOTAL_LEVELS}`}</Text>
        }
      />

      <View style={styles.body}>
        <View style={[styles.grid, { width: size * COLS + GAP, gap: GAP }]}>
          {LEVELS.map((lvl, i) => (
            <LevelNode
              key={lvl.id}
              levelId={lvl.id}
              status={statusFor(lvl.id)}
              stars={stars[lvl.id] || 0}
              index={i}
              size={size}
              onPress={onSelect}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.colors.bg.primary },
  count: {
    color: THEME.colors.signal.cyan,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    paddingRight: 8,
  },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
