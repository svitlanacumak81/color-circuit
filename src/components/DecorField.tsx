import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { THEME } from '../constants/theme';
import { SCREEN } from '../constants/config';

interface Props {
  dense?: boolean; // loader uses a denser node field
  opacity?: number;
}

// Deterministic pseudo-random so the field is stable across renders.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/** Printed-circuit-board decor: faint neon node dots + a few connecting traces. */
export default function DecorField({ dense = false, opacity = 0.6 }: Props) {
  const W = SCREEN.W;
  const H = SCREEN.H;
  const cyan = THEME.colors.signal.cyan;
  const violet = THEME.colors.signal.violet;

  const { dots, lines } = useMemo(() => {
    const rnd = seeded(dense ? 1337 : 4242);
    const count = dense ? 140 : 70;
    const d: { x: number; y: number; r: number; c: string }[] = [];
    for (let i = 0; i < count; i++) {
      d.push({
        x: rnd() * W,
        y: rnd() * H,
        r: 1 + rnd() * 1.4,
        c: rnd() > 0.5 ? cyan : violet,
      });
    }
    const l: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const segs = dense ? 14 : 8;
    for (let i = 0; i < segs; i++) {
      const x1 = rnd() * W;
      const y1 = rnd() * H;
      const horiz = rnd() > 0.5;
      const len = 40 + rnd() * 120;
      l.push({
        x1,
        y1,
        x2: horiz ? x1 + len : x1,
        y2: horiz ? y1 : y1 + len,
      });
    }
    return { dots: d, lines: l };
  }, [W, H, dense, cyan, violet]);

  return (
    <View style={[StyleSheet.absoluteFillObject, { opacity }]} pointerEvents="none">
      <Svg width={W} height={H}>
        {lines.map((ln, i) => (
          <Line
            key={`l${i}`}
            x1={ln.x1}
            y1={ln.y1}
            x2={ln.x2}
            y2={ln.y2}
            stroke={cyan}
            strokeWidth={1}
            strokeOpacity={0.15}
          />
        ))}
        {dots.map((dt, i) => (
          <Circle key={`d${i}`} cx={dt.x} cy={dt.y} r={dt.r} fill={dt.c} fillOpacity={0.5} />
        ))}
      </Svg>
    </View>
  );
}
