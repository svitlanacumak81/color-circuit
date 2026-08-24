import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tile, cloneTiles, rotateCW } from '../game/tiles';
import { Level } from '../game/levels';
import {
  evaluate,
  countTargets,
  countPoweredTargets,
  starsFor,
} from '../game/circuit';

export type GameStatus = 'idle' | 'playing' | 'win' | 'lose';

export interface CircuitApi {
  tiles: Tile[];
  moves: number;
  status: GameStatus;
  hintIndex: number | null;
  cellColor: ReturnType<typeof evaluate>['cellColor'];
  conflict: boolean[];
  poweredTarget: boolean[];
  targets: number;
  poweredCount: number;
  rotate: (index: number) => void;
  reset: () => void;
  hint: () => void;
}

export function useCircuit(
  level: Level,
  onWin: (stars: number, used: number) => void,
  onLose: (done: number, total: number) => void,
): CircuitApi {
  const [tiles, setTiles] = useState<Tile[]>(() => cloneTiles(level.tiles));
  const [moves, setMoves] = useState(level.moveLimit);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [hintIndex, setHintIndex] = useState<number | null>(null);

  // Keep latest callbacks in refs so the win/lose effect never depends on their identity.
  const onWinRef = useRef(onWin);
  const onLoseRef = useRef(onLose);
  onWinRef.current = onWin;
  onLoseRef.current = onLose;

  const evalResult = useMemo(
    () => evaluate(tiles, level.cols, level.rows),
    [tiles, level.cols, level.rows],
  );

  const rotate = useCallback(
    (index: number) => {
      if (status === 'win' || status === 'lose') return;
      setTiles((prev) => {
        const t = prev[index];
        if (!t || t.fixed) return prev;
        const next = prev.slice();
        next[index] = { ...t, mask: rotateCW(t.mask), rotation: (t.rotation + 1) % 4 };
        return next;
      });
      setMoves((m) => Math.max(0, m - 1));
      setStatus((s) => (s === 'idle' ? 'playing' : s));
      setHintIndex(null);
    },
    [status],
  );

  const finishedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    finishedRef.current = false;
    setTiles(cloneTiles(level.tiles));
    setMoves(level.moveLimit);
    setStatus('idle');
    setHintIndex(null);
  }, [level]);

  // Clear any pending transition timer on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const hint = useCallback(() => {
    const idx = tiles.findIndex((t) => !t.fixed && t.mask !== t.solvedMask);
    setHintIndex(idx >= 0 ? idx : null);
  }, [tiles]);

  // Win / lose detection after each move settles. Fires exactly once per round
  // (finishedRef) so the follow-up re-render can't clear the pending timer.
  useEffect(() => {
    if (status !== 'playing' || finishedRef.current) return;
    if (evalResult.won) {
      finishedRef.current = true;
      setStatus('win');
      const used = level.moveLimit - moves;
      const stars = starsFor(used, level.optimal);
      timerRef.current = setTimeout(() => onWinRef.current(stars, used), 600);
    } else if (moves <= 0) {
      finishedRef.current = true;
      setStatus('lose');
      const done = countPoweredTargets(evalResult);
      const total = countTargets(tiles);
      timerRef.current = setTimeout(() => onLoseRef.current(done, total), 500);
    }
  }, [evalResult, moves, status, level, tiles]);

  return {
    tiles,
    moves,
    status,
    hintIndex,
    cellColor: evalResult.cellColor,
    conflict: evalResult.conflict,
    poweredTarget: evalResult.poweredTarget,
    targets: countTargets(tiles),
    poweredCount: countPoweredTargets(evalResult),
    rotate,
    reset,
    hint,
  };
}
