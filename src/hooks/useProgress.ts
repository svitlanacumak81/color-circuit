import { useCallback, useState } from 'react';

export interface Progress {
  unlockedUpTo: number;
  stars: Record<number, number>;
  totalStars: number;
  completeLevel: (id: number, earned: number) => void;
  reset: () => void;
}

export function useProgress(totalLevels: number): Progress {
  const [unlockedUpTo, setUnlocked] = useState(1);
  const [stars, setStars] = useState<Record<number, number>>({});

  const completeLevel = useCallback(
    (id: number, earned: number) => {
      setStars((prev) => {
        if ((prev[id] || 0) >= earned) return prev;
        return { ...prev, [id]: earned };
      });
      setUnlocked((prev) => Math.max(prev, Math.min(totalLevels, id + 1)));
    },
    [totalLevels],
  );

  const reset = useCallback(() => {
    setStars({});
    setUnlocked(1);
  }, []);

  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);

  return { unlockedUpTo, stars, totalStars, completeLevel, reset };
}
