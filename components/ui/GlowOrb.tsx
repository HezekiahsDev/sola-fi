import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface Props { size?: number; color?: string; style?: ViewStyle; duration?: number; }

export default function GlowOrb({ size=160, color='rgba(47,149,220,0.35)', style, duration=6000 }: Props) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.05, duration, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.9, duration, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.9, duration: duration * 0.6, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: duration * 0.4, useNativeDriver: true }),
        ])
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale, opacity, duration]);

  return (
    <Animated.View style={[styles.base, { width: size, height: size, borderRadius: size, backgroundColor: color, transform: [{ scale }], opacity }, style]} />
  );
}

const styles = StyleSheet.create({
  base: { position: 'absolute', filter: 'blur(120px)' as any },
});
