import React, { useEffect } from 'react';
import { Animated, StyleSheet, Platform, StatusBar as RNStatusBar, AppState } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Animated multi-stop gradient by rotating hue via interpolation.
export default function AnimatedGradient({ children, style, extendUnderStatusBar = true }: React.PropsWithChildren<{ style?: any; extendUnderStatusBar?: boolean }>) {
  const anim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

  const c1 = anim.interpolate({ inputRange: [0,1], outputRange: ['rgba(47,149,220,0.55)', 'rgba(14,165,233,0.55)'] });
  const c2 = anim.interpolate({ inputRange: [0,1], outputRange: ['rgba(14,165,233,0.15)', 'rgba(47,149,220,0.15)'] });

  const paddingTop = extendUnderStatusBar ? (Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 44) : 0;

  return (
    <Animated.View style={[styles.container, { paddingTop }, style]}>      
      <LinearGradient
        colors={['#000000','#00111A','#001F33']}
        start={{x:0,y:0}}
        end={{x:1,y:1}}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: 1 }]}>        
        <LinearGradient
          colors={[ '#00000000', '#00000000' ]}
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
