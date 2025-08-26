import React, { useEffect } from 'react';
import { Animated, StyleSheet, Platform, StatusBar as RNStatusBar, AppState } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Animated multi-stop gradient by rotating hue via interpolation.
export default function AnimatedGradient({ children, style, extendUnderStatusBar = true, staticMode }: React.PropsWithChildren<{ style?: any; extendUnderStatusBar?: boolean; staticMode?: boolean }>) {
  const anim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (staticMode) return; // skip animation for performance / focus stability
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 12000, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 12000, useNativeDriver: false }),
      ])
    );
    // start animation loop
    loop.start();

    // pause/resume when app goes to background/foreground
    const handleAppState = (nextState: string) => {
      if (nextState === 'active') {
        try { loop.start(); } catch {}
      } else {
        try { loop.stop(); } catch {}
      }
    };

    const sub = AppState.addEventListener ? AppState.addEventListener('change', handleAppState) : (AppState as any).addEventListener('change', handleAppState);

    return () => {
      // cleanup listener and stop loop
      try { loop.stop(); } catch {}
      if (sub && typeof sub.remove === 'function') sub.remove();
      else if ((AppState as any).removeEventListener) (AppState as any).removeEventListener('change', handleAppState);
    };
  }, [anim]);

  // Animated brand glow shifting between primary purple + neon pink accent
  const c1 = staticMode ? 'rgba(108,99,255,0.40)' : anim.interpolate({ inputRange: [0,1], outputRange: ['rgba(108,99,255,0.50)', 'rgba(255,79,154,0.50)'] });
  const c2 = staticMode ? 'rgba(61,220,151,0.14)' : anim.interpolate({ inputRange: [0,1], outputRange: ['rgba(255,79,154,0.18)', 'rgba(61,220,151,0.18)'] });

  const paddingTop = extendUnderStatusBar ? (Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 44) : 0;

  return (
    <Animated.View style={[styles.container, { paddingTop }, style]}>      
      <LinearGradient
        colors={['#3E2F7F','#241B4A','#121212']}
        start={{x:0,y:0}}
        end={{x:1,y:1}}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: 1 }]}>        
        <LinearGradient
          colors={[ 'rgba(108,99,255,0.15)', 'rgba(62,47,127,0.05)' ]}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[styles.blurBlob, { backgroundColor: c1 }]} />
        <Animated.View style={[styles.blurBlobSmall, { backgroundColor: c2 }]} />
      </Animated.View>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blurBlob: { position: 'absolute', top: -120, left: -80, width: 320, height: 320, borderRadius: 320, filter: 'blur(140px)' as any },
  blurBlobSmall: { position: 'absolute', bottom: -140, right: -100, width: 300, height: 300, borderRadius: 300, filter: 'blur(150px)' as any },
});
