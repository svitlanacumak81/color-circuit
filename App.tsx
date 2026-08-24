/**
 * ColorCircuit — signal-routing puzzle.
 * State-machine navigation (no react-navigation): loader -> menu -> levelmap ->
 * game -> result -> menu, plus a howto screen.
 */
import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { THEME } from './src/constants/theme';
import { getLevel, TOTAL_LEVELS } from './src/game/levels';
import { useProgress } from './src/hooks/useProgress';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import LevelMapScreen from './src/screens/LevelMapScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen, { ResultData } from './src/screens/ResultScreen';
import HowToScreen from './src/screens/HowToScreen';

type Screen = 'loader' | 'menu' | 'levelmap' | 'game' | 'result' | 'howto';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [levelId, setLevelId] = useState(1);
  const [gameKey, setGameKey] = useState(0);
  const [howToTab, setHowToTab] = useState<'guide' | 'settings'>('guide');
  const [result, setResult] = useState<ResultData | null>(null);

  const progress = useProgress(TOTAL_LEVELS);
  const bestStars = Object.values(progress.stars).reduce((m, v) => Math.max(m, v), 0);

  const startLevel = useCallback((id: number) => {
    setLevelId(id);
    setGameKey((k) => k + 1);
    setScreen('game');
  }, []);

  const handleWin = useCallback(
    (stars: number, used: number) => {
      const level = getLevel(levelId);
      progress.completeLevel(levelId, stars);
      setResult({
        win: true,
        stars,
        used,
        moveLimit: level.moveLimit,
        done: 0,
        total: 0,
        levelId,
      });
      setScreen('result');
    },
    [levelId, progress],
  );

  const handleLose = useCallback(
    (done: number, total: number) => {
      const level = getLevel(levelId);
      setResult({
        win: false,
        stars: 0,
        used: level.moveLimit,
        moveLimit: level.moveLimit,
        done,
        total,
        levelId,
      });
      setScreen('result');
    },
    [levelId],
  );

  const renderScreen = () => {
    switch (screen) {
      case 'loader':
        return <LoaderScreen onDone={() => setScreen('menu')} />;
      case 'menu':
        return (
          <MenuScreen
            unlockedUpTo={progress.unlockedUpTo}
            totalStars={progress.totalStars}
            bestStars={bestStars}
            onPlay={() => setScreen('levelmap')}
            onHowTo={(tab) => {
              setHowToTab(tab);
              setScreen('howto');
            }}
          />
        );
      case 'levelmap':
        return (
          <LevelMapScreen
            unlockedUpTo={progress.unlockedUpTo}
            stars={progress.stars}
            onBack={() => setScreen('menu')}
            onSelect={startLevel}
          />
        );
      case 'game':
        return (
          <GameScreen
            key={gameKey}
            level={getLevel(levelId)}
            onExit={() => setScreen('levelmap')}
            onWin={handleWin}
            onLose={handleLose}
          />
        );
      case 'result':
        return result ? (
          <ResultScreen
            result={result}
            hasNext={result.win && levelId < TOTAL_LEVELS}
            onNext={() => startLevel(Math.min(TOTAL_LEVELS, levelId + 1))}
            onPlayAgain={() => startLevel(levelId)}
            onMenu={() => setScreen('menu')}
          />
        ) : null;
      case 'howto':
        return (
          <HowToScreen
            initialTab={howToTab}
            onBack={() => setScreen('menu')}
            onResetProgress={() => {
              progress.reset();
              setScreen('menu');
            }}
          />
        );
      default:
        return null;
    }
  };

  return <View style={styles.root}>{renderScreen()}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.colors.bg.primary },
});

export default App;
