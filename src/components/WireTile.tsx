import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, View, StyleSheet } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { Tile, N, E, S, W } from '../game/tiles';
import { ColorId } from '../game/tiles';
import { SIGNAL_COLORS, SPRING, wireWidth } from '../constants/config';
import { THEME } from '../constants/theme';

interface Props {
  tile: Tile;
  index: number;
  size: number;
  poweredColor: ColorId | null;
  conflict: boolean;
  hint: boolean;
  onRotate: (index: number) => void;
}

function edgePoint(dir: number, size: number): [number, number] {
  const h = size / 2;
  switch (dir) {
    case N:
      return [h, 0];
    case E:
      return [size, h];
    case S:
      return [h, size];
    default:
      return [0, h];
  }
}

function WireTile({ tile, index, size, poweredColor, conflict, hint, onRotate }: Props) {
  const spin = useRef(new Animated.Value(tile.rotation * 90)).current;
  const degRef = useRef(tile.rotation * 90);
  const prevRot = useRef(tile.rotation);
  const scale = useRef(new Animated.Value(1)).current;

  // Monotonic forward rotation when the tile turns (or is reset).
  useEffect(() => {
    if (tile.fixed) return;
    if (tile.rotation === prevRot.current) return;
    const delta = ((tile.rotation - prevRot.current) % 4 + 4) % 4;
    degRef.current += delta * 90;
    prevRot.current = tile.rotation;
    Animated.spring(spin, { toValue: degRef.current, useNativeDriver: true, ...SPRING.TILE }).start();
  }, [tile.rotation, tile.fixed, spin]);

  if (tile.type === 'EMPTY') {
    return <View style={{ width: size, height: size }} />;
  }

  const h = size / 2;
  const sw = wireWidth(size);
  const dim = THEME.colors.wireDim;
  const wireColor = conflict
    ? '#FFFFFF'
    : poweredColor
    ? SIGNAL_COLORS[poweredColor]
    : dim;
  const powered = !!poweredColor && !conflict;

  const edges = [N, E, S, W].filter((d) => (tile.solvedMask & d) !== 0);

  const svg = (
    <Svg width={size} height={size}>
      {edges.map((d) => {
        const [x, y] = edgePoint(d, size);
        return (
          <Line
            key={d}
            x1={h}
            y1={h}
            x2={x}
            y2={y}
            stroke={wireColor}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        );
      })}
      {tile.type === 'SOURCE' && tile.color ? (
        <Circle cx={h} cy={h} r={size * 0.22} fill={SIGNAL_COLORS[tile.color]} />
      ) : null}
      {tile.type === 'TARGET' && tile.color ? (
        <Circle
          cx={h}
          cy={h}
          r={size * 0.2}
          fill={powered ? SIGNAL_COLORS[tile.color] : 'transparent'}
          stroke={SIGNAL_COLORS[tile.color]}
          strokeWidth={sw * 0.7}
        />
      ) : null}
    </Svg>
  );

  const glow = powered
    ? {
        shadowColor: wireColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 8,
        elevation: 8,
      }
    : undefined;

  const cellStyle = [
    styles.cell,
    { width: size, height: size },
    hint ? styles.hint : null,
  ];

  // Fixed tiles (source/target) don't rotate or accept taps.
  if (tile.fixed) {
    return (
      <View style={cellStyle}>
        <View style={glow}>{svg}</View>
      </View>
    );
  }

  const rotate = spin.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, ...SPRING.BUTTON }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...SPRING.BUTTON }).start();

  return (
    <Pressable
      onPress={() => onRotate(index)}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
      style={cellStyle}
    >
      <Animated.View style={[glow, { transform: [{ rotate }, { scale }] }]}>{svg}</Animated.View>
    </Pressable>
  );
}

export default React.memo(WireTile);

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  hint: {
    borderWidth: 2,
    borderColor: '#00D4FF',
    backgroundColor: 'rgba(0,212,255,0.12)',
  },
});
