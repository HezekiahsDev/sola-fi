import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ViewProps } from '@/components/Themed';

// Abstract gradient background with subtle radial-like layering via multiple stops.
export default function GradientBackground({ children, style }: React.PropsWithChildren<ViewProps>) {
  return (
    <LinearGradient
      // Base brand gradient: deep purple to near-black
      colors={[ '#3E2F7F', '#241B4A', '#121212' ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.base, style]}
    >
      <LinearGradient
        // Soft accent glow using primary + aqua subtle mix
        colors={[ 'rgba(108,99,255,0.35)', 'rgba(61,220,151,0.08)', 'transparent' ]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1 },
});
