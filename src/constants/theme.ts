/**
 * THEME — CYBERPUNK preset (rule #11b: keep preset `name`, override only accents).
 * Palette values match the ColorCircuit design document.
 */
export const THEME = {
  name: 'cyberpunk',

  colors: {
    bg: {
      primary: '#0A0014',
      darker: '#050008', // loader base — visibly different from menu
      secondary: '#120026',
      raised: '#1A0038',
      alt: '#0D1B2A',
    },
    signal: {
      cyan: '#00D4FF',
      violet: '#8B00FF',
      magenta: '#FF2FB0', // accent override
    },
    accent: {
      primary: '#8B00FF',
      secondary: '#00D4FF',
    },
    star: '#F5D77A',
    wireDim: '#3A3550',
    text: {
      primary: '#F0ECFF',
      secondary: '#8C82B8',
      muted: '#5A5278',
    },
    ui: {
      glass: 'rgba(255,255,255,0.05)',
      glassBorder: 'rgba(0,212,255,0.18)',
      hairline: 'rgba(255,255,255,0.08)',
      headerBg: 'rgba(0,0,0,0.35)',
      headerBorder: 'rgba(0,212,255,0.15)',
    },
  },

  gradients: {
    menu: ['#0A0014', '#12002A', '#1A0038'] as string[],
    loader: ['#050008', '#0A0014', '#12001F'] as string[],
    play: ['#8B00FF', '#00D4FF'] as string[],
    result: ['#050008', '#12001F', '#0A0014'] as string[],
  },

  radius: { sm: 6, md: 12, lg: 16, xl: 20, pill: 100 },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },

  type: {
    hero: { fontSize: 40, fontWeight: '800' as const, letterSpacing: 3 },
    title: { fontSize: 24, fontWeight: '700' as const, letterSpacing: 1 },
    body: { fontSize: 15, fontWeight: '500' as const },
    caption: {
      fontSize: 12,
      fontWeight: '600' as const,
      letterSpacing: 2,
    },
  },
};

export type Theme = typeof THEME;
