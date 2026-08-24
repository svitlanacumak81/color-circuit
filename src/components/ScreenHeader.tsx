import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { THEME } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

/** Shared header for every non-menu screen (cross-screen consistency). */
export default function ScreenHeader({ title, subtitle, onBack, rightSlot }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.back}
          >
            <ChevronLeft size={24} color={THEME.colors.signal.cyan} strokeWidth={2.5} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={[styles.side, styles.right]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 72,
    paddingTop: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.ui.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.ui.headerBorder,
  },
  side: { width: 64, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  back: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,212,255,0.08)',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    color: THEME.colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  subtitle: {
    color: THEME.colors.text.secondary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 2,
  },
});
