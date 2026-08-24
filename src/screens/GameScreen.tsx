import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Lightbulb, RotateCcw } from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { Assets } from '../assets';
import { Level } from '../game/levels';
import { ColorId } from '../game/tiles';
import { useCircuit } from '../hooks/useCircuit';
import { SignalKey } from '../constants/config';
import DecorField from '../components/DecorField';
import ScreenHeader from '../components/ScreenHeader';
import MovesBadge from '../components/MovesBadge';
import GoalChip from '../components/GoalChip';
import CircuitBoard from '../components/CircuitBoard';
import PillButton from '../components/PillButton';

interface Props {
  level: Level;
  onExit: () => void;
  onWin: (stars: number, used: number) => void;
  onLose: (done: number, total: number) => void;
}

export default function GameScreen({ level, onExit, onWin, onLose }: Props) {
  const api = useCircuit(level, onWin, onLose);

  // Goal colors (unique source colors) + whether each target is powered.
  const colors: ColorId[] = [];
  level.tiles.forEach((t) => {
    if (t.type === 'SOURCE' && t.color && !colors.includes(t.color)) colors.push(t.color);
  });
  const poweredByColor: Record<string, boolean> = {};
  api.tiles.forEach((t, i) => {
    if (t.type === 'TARGET' && t.color) poweredByColor[t.color] = api.poweredTarget[i];
  });

  return (
    <View style={styles.root}>
      <ImageBackground source={Assets.bgGame} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient
          colors={['rgba(8,0,15,0.9)', 'rgba(10,0,20,0.92)']}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>
      <DecorField opacity={0.35} />

      <ScreenHeader
        title={`LEVEL ${level.id}`}
        subtitle={level.name}
        onBack={onExit}
        rightSlot={<MovesBadge moves={api.moves} />}
      />

      <View style={styles.goals}>
        {colors.map((c) => (
          <GoalChip key={c} colorId={c as SignalKey} powered={!!poweredByColor[c]} />
        ))}
      </View>

      <View style={styles.arena}>
        <CircuitBoard
          tiles={api.tiles}
          cols={level.cols}
          rows={level.rows}
          cellColor={api.cellColor}
          conflict={api.conflict}
          hintIndex={api.hintIndex}
          onRotate={api.rotate}
        />
      </View>

      <View style={styles.controls}>
        <PillButton label="HINT" Icon={Lightbulb} onPress={api.hint} />
        <PillButton
          label="RESET"
          Icon={RotateCcw}
          tint={THEME.colors.signal.violet}
          onPress={api.reset}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.colors.bg.primary },
  goals: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 14,
  },
  arena: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  controls: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
});
