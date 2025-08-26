// Brand Color System (Rebrand 2025)
// Source palette provided by design brief:
// Primary Purple: #6C63FF
// Deep Purple: #3E2F7F
// Lavender Tint: #B5A8FF
// Aqua Blue (success/action): #3DDC97
// Neon Pink (secondary CTA / highlight): #FF4F9A
// Gold (premium accent): #F5B700
// Dark Background: #121212
// Text Primary (on dark): #EDEDED / (on light): #1A1A1A
// Text Secondary: #A0A0B2

// Design tokens (base/palette) - keep semantic naming distinct from theme slots.
const palette = {
  primary: '#6C63FF',
  primaryDeep: '#3E2F7F',
  primaryTint: '#B5A8FF',
  accentAqua: '#3DDC97',
  accentPink: '#FF4F9A',
  accentGold: '#F5B700',
  backgroundDark: '#121212',
  backgroundLight: '#FFFFFF',
  // Derived/supporting neutrals & surfaces
  surfaceDark: '#1A1624', // slightly lifted from dark bg with purple influence
  surfaceLight: '#F7F7FA',
  borderDark: '#272238',
  borderLight: '#E3E1EC',
  textOnDark: '#EDEDED',
  textOnLight: '#1A1A1A',
  textSecondaryDark: '#A0A0B2',
  textSecondaryLight: '#575766',
  // Feedback & status (map where possible to brand accents)
  success: '#3DDC97',
  error: '#EF4444',
  warning: '#F5B700',
  info: '#6C63FF', // primary as info highlight
};

export type AppColorName = keyof typeof palette | 'tint';

export default {
  light: {
    text: palette.textOnLight,
    background: palette.backgroundLight,
    tint: palette.primary,
    tabIconDefault: palette.primaryTint,
    tabIconSelected: palette.primary,
    surface: palette.surfaceLight,
    muted: palette.textSecondaryLight,
    border: palette.borderLight,
    success: palette.success,
    error: palette.error,
    warning: palette.warning,
    info: palette.info,
    // Extended brand accents (optional usage in components)
    accentAqua: palette.accentAqua,
    accentPink: palette.accentPink,
    accentGold: palette.accentGold,
    primaryDeep: palette.primaryDeep,
    primaryTint: palette.primaryTint,
  },
  dark: {
    text: palette.textOnDark,
    background: palette.backgroundDark,
    tint: palette.primary,
    tabIconDefault: palette.primaryTint,
    tabIconSelected: palette.primary,
    surface: palette.surfaceDark,
    muted: palette.textSecondaryDark,
    border: palette.borderDark,
    success: palette.success,
    error: palette.error,
    warning: palette.warning,
    info: palette.info,
    accentAqua: palette.accentAqua,
    accentPink: palette.accentPink,
    accentGold: palette.accentGold,
    primaryDeep: palette.primaryDeep,
    primaryTint: palette.primaryTint,
  },
};
