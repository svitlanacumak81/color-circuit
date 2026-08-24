import { Tile, ColorId, OPPOSITE, DIRS, deltaFor } from './tiles';

export interface EvalResult {
  cellColor: (ColorId | null)[]; // powered color per cell (null = unpowered)
  conflict: boolean[]; // reached by two different-color signals
  poweredTarget: boolean[]; // target lit by matching-color source
  won: boolean;
}

/**
 * Evaluate connectivity. For every SOURCE, BFS across connected wire cells,
 * painting them with the source color; a TARGET is powered when reached by a
 * source of its own color.
 */
export function evaluate(grid: Tile[], cols: number, rows: number): EvalResult {
  const n = cols * rows;
  const cellColor: (ColorId | null)[] = new Array(n).fill(null);
  const conflict: boolean[] = new Array(n).fill(false);
  const poweredTarget: boolean[] = new Array(n).fill(false);

  const inb = (r: number, c: number) => r >= 0 && c >= 0 && r < rows && c < cols;

  // Returns neighbor index if `a` and its neighbor in `dir` are mutually connected, else -1.
  const connected = (a: number, dir: number): number => {
    if ((grid[a].mask & dir) === 0) return -1;
    const ar = Math.floor(a / cols);
    const ac = a % cols;
    const [dr, dc] = deltaFor(dir);
    const nr = ar + dr;
    const nc = ac + dc;
    if (!inb(nr, nc)) return -1;
    const b = nr * cols + nc;
    if (grid[b].type === 'EMPTY') return -1;
    if ((grid[b].mask & OPPOSITE[dir]) === 0) return -1;
    return b;
  };

  for (let s = 0; s < n; s++) {
    if (grid[s].type !== 'SOURCE') continue;
    const color = grid[s].color as ColorId;
    const visited = new Set<number>([s]);
    const queue: number[] = [s];
    cellColor[s] = color;

    while (queue.length) {
      const cur = queue.shift() as number;
      for (const d of DIRS) {
        const b = connected(cur, d);
        if (b < 0 || visited.has(b)) continue;
        const bt = grid[b].type;
        if (bt === 'SOURCE') continue; // never flow into another emitter
        visited.add(b);
        if (cellColor[b] && cellColor[b] !== color) {
          conflict[b] = true;
          continue;
        }
        cellColor[b] = color;
        if (bt === 'TARGET') {
          if (grid[b].color === color) poweredTarget[b] = true;
          continue; // target is terminal
        }
        queue.push(b);
      }
    }
  }

  let won = true;
  let hasTarget = false;
  for (let i = 0; i < n; i++) {
    if (grid[i].type === 'TARGET') {
      hasTarget = true;
      if (!poweredTarget[i]) won = false;
    }
    if (conflict[i]) won = false;
  }

  return { cellColor, conflict, poweredTarget, won: won && hasTarget };
}

export function countTargets(grid: Tile[]): number {
  let c = 0;
  for (const t of grid) if (t.type === 'TARGET') c++;
  return c;
}

export function countPoweredTargets(res: EvalResult): number {
  let c = 0;
  for (const p of res.poweredTarget) if (p) c++;
  return c;
}

export function starsFor(used: number, optimal: number): number {
  if (used <= optimal) return 3;
  if (used <= optimal + Math.ceil(optimal * 0.5)) return 2;
  return 1;
}
