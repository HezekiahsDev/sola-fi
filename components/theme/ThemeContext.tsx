import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { ColorSchemeName, useColorScheme as useRNColorScheme } from 'react-native';

interface ThemeContextValue {
  scheme: ColorSchemeName;
  effectiveScheme: 'light' | 'dark';
  setScheme: (scheme: ColorSchemeName) => void;
  toggle: () => void;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProviderLocal: React.FC<React.PropsWithChildren> = ({ children }) => {
  const system = useRNColorScheme();
  const [scheme, setScheme] = useState<ColorSchemeName>('dark'); // default dark for wallet feel

  const effectiveScheme: 'light' | 'dark' = (scheme === 'light' || scheme === 'dark') ? scheme : (system === 'light' ? 'light' : 'dark');

  const toggle = useCallback(() => {
    setScheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({ scheme, effectiveScheme, setScheme, toggle, isSystem: scheme === null }), [scheme, effectiveScheme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useThemeController() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('ThemeContext missing');
  return ctx;
}
