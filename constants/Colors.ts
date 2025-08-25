// Central color palette for the wallet application.
// The dark palette is primary; light palette approximates accessible complements.

const palette = {
  // warmer off-white for on-dark surfaces
  text: '#F3EFEA',
  // deep, slightly purple-tinted background for low visual fatigue
  background: '#0B0712',
  // primary lilac / violet — energetic but not harsh
  primary: '#8B5CF6',
  tabIconDefault: '#A9A3B8',
  tabIconSelected: '#8B5CF6',
  // surface panels slightly lighter than background with a cool purple tint
  surface: '#100D1A',
  // muted hints in a soft lilac gray
  muted: '#B9AEDC',
  border: '#231E2B',
  success: '#16A34A',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#60A5FA',
};

export type AppColorName = keyof typeof palette | 'tint';

export default {
  light: {
    text: '#000000',
    background: '#FFFFFF',
  tint: palette.primary,
    tabIconDefault: '#CCCCCC',
    tabIconSelected: palette.primary,
    surface: '#F5F5F5',
    muted: '#6B7280',
    border: '#E5E7EB',
    success: palette.success,
    error: palette.error,
    warning: palette.warning,
    info: palette.info,
  },
  dark: {
  text: palette.text,
  background: palette.background,
  tint: palette.primary,
  tabIconDefault: palette.tabIconDefault,
  tabIconSelected: palette.tabIconSelected,
  surface: palette.surface,
  muted: palette.muted,
  border: palette.border,
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
  info: palette.info,
  },
};
