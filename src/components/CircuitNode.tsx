import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Defs, RadialGradient, Stop } from 'react-native-svg';
import { THEME } from '../constants/theme';

interface Props {
  size?: number;
  glow?: boolean;
}

/** Glowing circuit hub: a central node with four neon wires radiating out. */
export default function CircuitNode({ size = 96, glow = true }: Props) {
  const cyan = THEME.colors.signal.cyan;
  const violet = THEME.colors.signal.violet;
  const cx = size / 2;
  const cy = size / 2;
  const arm = size * 0.42;
  const sw = Math.max(3, size * 0.05);

  return (
    <View
      style={
        glow
          ? {
              shadowColor: cyan,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.9,
              shadowRadius: 18,
              elevation: 12,
            }
          : undefined
      }
    >
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="hub" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="45%" stopColor={cyan} stopOpacity="1" />
            <Stop offset="100%" stopColor={violet} stopOpacity="1" />
          </RadialGradient>
        </Defs>
        {/* four wires */}
        <Line x1={cx} y1={cy} x2={cx} y2={cy - arm} stroke={cyan} strokeWidth={sw} strokeLinecap="round" />
        <Line x1={cx} y1={cy} x2={cx + arm} y2={cy} stroke={violet} strokeWidth={sw} strokeLinecap="round" />
        <Line x1={cx} y1={cy} x2={cx} y2={cy + arm} stroke={violet} strokeWidth={sw} strokeLinecap="round" />
        <Line x1={cx} y1={cy} x2={cx - arm} y2={cy} stroke={cyan} strokeWidth={sw} strokeLinecap="round" />
        {/* end nodes */}
        <Circle cx={cx} cy={cy - arm} r={sw * 0.9} fill={cyan} />
        <Circle cx={cx + arm} cy={cy} r={sw * 0.9} fill={violet} />
        <Circle cx={cx} cy={cy + arm} r={sw * 0.9} fill={violet} />
        <Circle cx={cx - arm} cy={cy} r={sw * 0.9} fill={cyan} />
        {/* hub */}
        <Circle cx={cx} cy={cy} r={size * 0.16} fill="url(#hub)" />
      </Svg>
    </View>
  );
}
