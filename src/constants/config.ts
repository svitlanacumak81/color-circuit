import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const SCREEN = { W: SCREEN_W, H: SCREEN_H };

// Rule #13 — EXACTLY 8000ms. Do not lower (races test-ui capture window).
export const LOADER_DURATION_MS = 8000;

// Board geometry (rules #4, #5) — overflow <= 2px guaranteed by the frame formula.
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const PAD = 6;
export const BORDER = 2;
export const BOARD_FRAME = PAD + BORDER; // 8

export function tileSize(cols: number): number {
  return Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / cols);
}
export function boardWidth(cols: number): number {
  return tileSize(cols) * cols + 2 * BOARD_FRAME;
}
export function wireWidth(size: number): number {
  return Math.max(4, Math.round(size * 0.16));
}

// Springs
export const SPRING = {
  BUTTON: { tension: 200, friction: 12 },
  TILE: { tension: 140, friction: 11 },
};

export type SignalKey = 'cyan' | 'violet' | 'magenta';
export const SIGNAL_COLORS: Record<SignalKey, string> = {
  cyan: '#00D4FF',
  violet: '#8B00FF',
  magenta: '#FF2FB0',
};
