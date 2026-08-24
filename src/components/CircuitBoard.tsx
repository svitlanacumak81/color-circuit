import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tile, ColorId } from '../game/tiles';
import WireTile from './WireTile';
import HudFrame from './HudFrame';
import { PAD, BORDER, tileSize, boardWidth } from '../constants/config';
import { THEME } from '../constants/theme';

interface Props {
  tiles: Tile[];
  cols: number;
  rows: number;
  cellColor: (ColorId | null)[];
  conflict: boolean[];
  hintIndex: number | null;
  onRotate: (index: number) => void;
}

function CircuitBoard({ tiles, cols, rows, cellColor, conflict, hintIndex, onRotate }: Props) {
  const size = tileSize(cols);
  const bw = boardWidth(cols);

  return (
    <HudFrame color={THEME.colors.signal.cyan} size={22}>
      <View style={[styles.frame, { width: bw, height: tileSize(cols) * rows + 2 * (PAD + BORDER) }]}>
        <View style={[styles.grid, { width: size * cols, height: size * rows }]}>
          {tiles.map((t, i) => (
            <WireTile
              key={i}
              tile={t}
              index={i}
              size={size}
              poweredColor={cellColor[i]}
              conflict={conflict[i]}
              hint={hintIndex === i}
              onRotate={onRotate}
            />
          ))}
        </View>
      </View>
    </HudFrame>
  );
}

export default React.memo(CircuitBoard);

const styles = StyleSheet.create({
  frame: {
    padding: PAD,
    borderWidth: BORDER,
    borderColor: 'rgba(0,212,255,0.25)',
    borderRadius: THEME.radius.md,
    backgroundColor: 'rgba(10,0,20,0.55)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
