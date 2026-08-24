/**
 * Tile model — connectors are a bitmask of edges: N=1, E=2, S=4, W=8.
 */
export const N = 1;
export const E = 2;
export const S = 4;
export const W = 8;

export type TileType = 'STRAIGHT' | 'CORNER' | 'TEE' | 'SOURCE' | 'TARGET' | 'EMPTY';
export type ColorId = 'cyan' | 'violet' | 'magenta';

export interface Tile {
  type: TileType;
  mask: number; // current open edges
  solvedMask: number; // open edges in the solved orientation
  rotation: number; // 0..3 quarter-turns from solved
  color: ColorId | null; // only sources/targets carry a color
  fixed: boolean; // sources/targets/empty never rotate
}

// Rotate connectors 90° clockwise: N->E->S->W.
export function rotateCW(mask: number): number {
  return ((mask << 1) & 0b1111) | (mask >> 3);
}

export function rotateN(mask: number, n: number): number {
  let m = mask;
  const k = ((n % 4) + 4) % 4;
  for (let i = 0; i < k; i++) m = rotateCW(m);
  return m;
}

export const OPPOSITE: Record<number, number> = { 1: 4, 4: 1, 2: 8, 8: 2 };
export const DIRS: number[] = [N, E, S, W];

// [deltaRow, deltaCol] for a direction bit.
export function deltaFor(dir: number): [number, number] {
  switch (dir) {
    case N:
      return [-1, 0];
    case E:
      return [0, 1];
    case S:
      return [1, 0];
    default:
      return [0, -1];
  }
}

export function cloneTiles(tiles: Tile[]): Tile[] {
  return tiles.map((t) => ({ ...t }));
}
