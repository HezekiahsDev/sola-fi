import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ViewProps } from '@/components/Themed';

// Abstract gradient background with subtle radial-like layering via multiple stops.
export default function GradientBackground({ children, style }: React.PropsWithChildren<ViewProps>) {
  return (
    <LinearGradient
      colors={[ '#00111A', '#001F33', '#000000' ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.base, style]}
    >
      <LinearGradient
        colors={[ 'rgba(47,149,220,0.35)', 'rgba(14,165,233,0.05)', 'transparent' ]}
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
