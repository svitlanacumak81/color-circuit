import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RotateCw, Zap, CircleCheck, TriangleAlert } from 'lucide-react-native';
import { THEME } from '../constants/theme';
import DecorField from '../components/DecorField';
import ScreenHeader from '../components/ScreenHeader';

type IconCmp = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

interface Props {
  initialTab: 'guide' | 'settings';
  onBack: () => void;
  onResetProgress: () => void;
}

const STEPS: { Icon: IconCmp; text: string; tint: string }[] = [
  { Icon: RotateCw, text: 'TAP A TILE TO ROTATE IT', tint: '#00D4FF' },
  { Icon: Zap, text: 'CONNECT EACH SOURCE TO ITS MATCHING TARGET', tint: '#8B00FF' },
  { Icon: CircleCheck, text: 'POWER EVERY CIRCUIT TO WIN', tint: '#00D4FF' },
  { Icon: TriangleAlert, text: 'RUN OUT OF MOVES AND THE SIGNAL IS LOST', tint: '#FF2FB0' },
];

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Pressable
        onPress={onToggle}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={[
          styles.track,
          { backgroundColor: on ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.08)' },
        ]}
      >
        <View
          style={[
            styles.knob,
            {
              alignSelf: on ? 'flex-end' : 'flex-start',
              backgroundColor: on ? THEME.colors.signal.cyan : THEME.colors.text.muted,
            },
          ]}
        />
      </Pressable>
    </View>
  );
}

export default function HowToScreen({ initialTab, onBack, onResetProgress }: Props) {
  const [tab, setTab] = useState<'guide' | 'settings'>(initialTab);
  const [sound, setSound] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [confirm, setConfirm] = useState(false);

  const handleReset = () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    onResetProgress();
    setConfirm(false);
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#08000F', '#12002A', '#1A0038']} style={StyleSheet.absoluteFill} />
      <DecorField opacity={0.4} />

      <ScreenHeader
        title="HOW TO PLAY"
        onBack={onBack}
        rightSlot={
          <View style={styles.tabs}>
            {(['guide', 'settings'] as const).map((t) => (
              <Pressable key={t} onPress={() => setTab(t)} hitSlop={6}>
                <Text style={[styles.tab, tab === t && styles.tabActive]}>
                  {t === 'guide' ? 'GUIDE' : 'SETUP'}
                </Text>
              </Pressable>
            ))}
          </View>
        }
      />

      <View style={styles.body}>
        {tab === 'guide' ? (
          <View style={styles.list}>
            {STEPS.map((s, i) => (
              <View key={i} style={styles.stepCard}>
                <View style={[styles.stepIcon, { backgroundColor: s.tint + '1A' }]}>
                  <s.Icon size={24} color={s.tint} strokeWidth={2.5} />
                </View>
                <Text style={styles.stepText}>{s.text}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            <View style={styles.settingsCard}>
              <Toggle on={sound} onToggle={() => setSound((v) => !v)} label="SOUND" />
              <View style={styles.divider} />
              <Toggle on={haptics} onToggle={() => setHaptics((v) => !v)} label="HAPTICS" />
            </View>

            <Pressable
              onPress={handleReset}
              style={[styles.resetBtn, confirm && styles.resetBtnConfirm]}
            >
              <Text style={styles.resetText}>
                {confirm ? 'TAP AGAIN TO CONFIRM' : 'RESET PROGRESS'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.colors.bg.primary },
  tabs: { flexDirection: 'row', gap: 12, paddingRight: 8 },
  tab: { color: THEME.colors.text.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  tabActive: { color: THEME.colors.signal.cyan },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  list: { gap: 14 },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.ui.glassBorder,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    flex: 1,
    color: THEME.colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    lineHeight: 18,
  },
  settingsCard: {
    padding: 8,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.ui.glassBorder,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  settingLabel: { color: THEME.colors.text.primary, fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  divider: { height: 1, backgroundColor: THEME.colors.ui.hairline, marginHorizontal: 12 },
  track: { width: 52, height: 30, borderRadius: 15, padding: 3, justifyContent: 'center' },
  knob: { width: 24, height: 24, borderRadius: 12 },
  resetBtn: {
    height: 52,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,47,176,0.5)',
    backgroundColor: 'rgba(255,47,176,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  resetBtnConfirm: { backgroundColor: 'rgba(255,47,176,0.2)' },
  resetText: {
    color: THEME.colors.signal.magenta,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
