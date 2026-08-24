import { Tile, TileType, ColorId, rotateN, N, E, S, W } from './tiles';

interface PathSpec {
  color: ColorId;
  cells: [number, number][]; // ordered source -> target, orthogonally adjacent
}
export interface LevelSpec {
  id: number;
  name: string;
  cols: number;
  rows: number;
  paths: PathSpec[];
  moveLimit: number;
  optimal: number;
}
export interface Level {
  id: number;
  name: string;
  cols: number;
  rows: number;
  moveLimit: number;
  optimal: number;
  tiles: Tile[];
}

// Direction bit pointing from cell `a` toward adjacent cell `b`.
function bitBetween(a: [number, number], b: [number, number]): number {
  const dr = b[0] - a[0];
  const dc = b[1] - a[1];
  if (dr === -1) return N;
  if (dr === 1) return S;
  if (dc === 1) return E;
  return W;
}

// Deterministic scramble so the board never starts fully solved.
function scramble(r: number, c: number, levelId: number, type: TileType): number {
  if (type === 'STRAIGHT') {
    return 1; // one quarter-turn away from solved (period 2 -> always needs a turn)
  }
  return ((r * 7 + c * 3 + levelId * 5) % 3) + 1; // 1..3 for corners
}

/**
 * Builds a level from disjoint source->target paths. Connectors are derived from
 * path adjacency, so the solved state (wire rotation 0) is always winnable.
 */
export function buildLevel(spec: LevelSpec): Level {
  const n = spec.cols * spec.rows;
  const tiles: Tile[] = new Array(n);
  for (let i = 0; i < n; i++) {
    tiles[i] = { type: 'EMPTY', mask: 0, solvedMask: 0, rotation: 0, color: null, fixed: true };
  }

  for (const p of spec.paths) {
    const cells = p.cells;
    for (let i = 0; i < cells.length; i++) {
      const [r, c] = cells[i];
      const id = r * spec.cols + c;
      let mask = 0;
      let type: TileType;
      let color: ColorId | null = null;
      let fixed = false;

      if (i === 0) {
        mask = bitBetween(cells[0], cells[1]);
        type = 'SOURCE';
        color = p.color;
        fixed = true;
      } else if (i === cells.length - 1) {
        mask = bitBetween(cells[i], cells[i - 1]);
        type = 'TARGET';
        color = p.color;
        fixed = true;
      } else {
        const b1 = bitBetween(cells[i], cells[i - 1]);
        const b2 = bitBetween(cells[i], cells[i + 1]);
        mask = b1 | b2;
        type = mask === (N | S) || mask === (E | W) ? 'STRAIGHT' : 'CORNER';
      }

      const solvedMask = mask;
      let rotation = 0;
      let curMask = solvedMask;
      if (!fixed) {
        rotation = scramble(r, c, spec.id, type);
        curMask = rotateN(solvedMask, rotation);
      }
      tiles[id] = { type, mask: curMask, solvedMask, rotation, color, fixed };
    }
  }

  return {
    id: spec.id,
    name: spec.name,
    cols: spec.cols,
    rows: spec.rows,
    moveLimit: spec.moveLimit,
    optimal: spec.optimal,
    tiles,
  };
}

const SPECS: LevelSpec[] = [
  {
    id: 1,
    name: 'FIRST SPARK',
    cols: 3,
    rows: 3,
    moveLimit: 6,
    optimal: 3,
    paths: [{ color: 'cyan', cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]] }],
  },
  {
    id: 2,
    name: 'U-TURN',
    cols: 3,
    rows: 3,
    moveLimit: 8,
    optimal: 5,
    paths: [
      { color: 'cyan', cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1], [2, 0]] },
    ],
  },
  {
    id: 3,
    name: 'CORNER RUN',
    cols: 4,
    rows: 4,
    moveLimit: 8,
    optimal: 5,
    paths: [
      { color: 'cyan', cells: [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3]] },
    ],
  },
  {
    id: 4,
    name: 'TWIN LINES',
    cols: 4,
    rows: 4,
    moveLimit: 9,
    optimal: 5,
    paths: [
      { color: 'cyan', cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]] },
      { color: 'violet', cells: [[3, 0], [3, 1], [3, 2], [3, 3]] },
    ],
  },
  {
    id: 5,
    name: 'CROSSFEED',
    cols: 4,
    rows: 4,
    moveLimit: 12,
    optimal: 8,
    paths: [
      { color: 'cyan', cells: [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [0, 3]] },
      { color: 'violet', cells: [[3, 0], [3, 1], [2, 1], [2, 2], [2, 3], [3, 3]] },
    ],
  },
  {
    id: 6,
    name: 'GRID LOCK',
    cols: 5,
    rows: 5,
    moveLimit: 13,
    optimal: 9,
    paths: [
      { color: 'cyan', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 4], [2, 4]] },
      { color: 'violet', cells: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [3, 4]] },
    ],
  },
  {
    id: 7,
    name: 'TRIPLE BAND',
    cols: 5,
    rows: 5,
    moveLimit: 13,
    optimal: 9,
    paths: [
      { color: 'cyan', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
      { color: 'violet', cells: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] },
      { color: 'magenta', cells: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4]] },
    ],
  },
  {
    id: 8,
    name: 'WEAVE',
    cols: 5,
    rows: 5,
    moveLimit: 15,
    optimal: 11,
    paths: [
      { color: 'cyan', cells: [[0, 0], [0, 1], [0, 2], [1, 2], [1, 3], [1, 4]] },
      { color: 'violet', cells: [[2, 0], [2, 1], [3, 1], [3, 2], [3, 3], [3, 4]] },
      { color: 'magenta', cells: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4]] },
    ],
  },
  {
    id: 9,
    name: 'MAINFRAME',
    cols: 6,
    rows: 6,
    moveLimit: 18,
    optimal: 14,
    paths: [
      {
        color: 'cyan',
        cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 5], [2, 5]],
      },
      { color: 'violet', cells: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5]] },
      { color: 'magenta', cells: [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5]] },
    ],
  },
  {
    id: 10,
    name: 'OVERLOAD',
    cols: 6,
    rows: 6,
    moveLimit: 22,
    optimal: 17,
    paths: [
      {
        color: 'cyan',
        cells: [[0, 0], [1, 0], [1, 1], [1, 2], [0, 2], [0, 3], [0, 4], [0, 5]],
      },
      {
        color: 'violet',
        cells: [[2, 0], [2, 1], [2, 2], [2, 3], [3, 3], [3, 4], [3, 5], [2, 5]],
      },
      {
        color: 'magenta',
        cells: [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [4, 5]],
      },
    ],
  },
];

export const LEVELS: Level[] = SPECS.map(buildLevel);
export const TOTAL_LEVELS = LEVELS.length;
export const TOTAL_STARS = TOTAL_LEVELS * 3;

export function getLevel(id: number): Level {
  return LEVELS.find((l) => l.id === id) || LEVELS[0];
}
