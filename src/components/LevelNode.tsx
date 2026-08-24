import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View, StyleSheet } from 'react-native';
import { Lock, Star } from 'lucide-react-native';
import { THEME } from '../constants/theme';

export type NodeStatus = 'locked' | 'available' | 'completed';

interface Props {
  levelId: number;
  status: NodeStatus;
  stars: number;
  index: number;
  size: number;
  onPress: (id: number) => void;
}

function LevelNode({ levelId, status, stars, index, size, onPress }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: index * 60,
        tension: 120,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  const locked = status === 'locked';
  const completed = status === 'completed';
  const cyan = THEME.colors.signal.cyan;
  const violet = THEME.colors.signal.violet;
  const border = locked ? THEME.colors.ui.hairline : completed ? violet : cyan;
  const bg = completed ? 'rgba(139,0,255,0.18)' : locked ? '#1A0038' : 'rgba(0,212,255,0.08)';

  const pressIn = () => {
    if (locked) return;
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, tension: 200, friction: 12 }).start();
  };
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 12 }).start();

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }} pointerEvents="box-none">
      <Pressable
        disabled={locked}
        onPress={() => onPress(levelId)}
        onPressIn={pressIn}
        onPressOut={pressOut}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{ width: size, height: size }}
      >
        <Animated.View
          style={[
            styles.node,
            {
              width: size,
              height: size,
              borderColor: border,
              backgroundColor: bg,
              transform: [{ scale }],
              shadowColor: locked ? '#000' : completed ? violet : cyan,
            },
          ]}
        >
          {locked ? (
            <Lock size={22} color={THEME.colors.text.muted} strokeWidth={2.5} />
          ) : (
            <>
              <Text style={[styles.num, { color: completed ? '#F0ECFF' : cyan }]}>{levelId}</Text>
              {completed ? (
                <View style={styles.stars}>
                  {[0, 1, 2].map((i) => (
                    <Star
                      key={i}
                      size={10}
                      color={THEME.colors.star}
                      fill={i < stars ? THEME.colors.star : 'transparent'}
                      strokeWidth={2}
                    />
                  ))}
                </View>
              ) : null}
            </>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default React.memo(LevelNode);

const styles = StyleSheet.create({
  node: {
    borderRadius: THEME.radius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  num: { fontSize: 24, fontWeight: '800', letterSpacing: 1 },
  stars: { flexDirection: 'row', gap: 2, marginTop: 4 },
});
