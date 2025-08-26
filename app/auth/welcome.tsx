import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated, View as RNView, ActivityIndicator } from 'react-native';
import { View, Text } from '@/components/Themed';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function WelcomeSetupScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const messages = [
    'Welcome — setting things up for you',
    "Generating your wallet (devnet)",
    'Finishing touches — almost there',
  ];

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    // animate in
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();

    // cycle messages
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, messages.length - 1));
    }, 900);

    // navigate to main tabs after a short delay
    const navTimeout = setTimeout(() => {
      // small exit animation
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -8, duration: 300, useNativeDriver: true }),
      ]).start(() => router.replace('/(tabs)'));
    }, 2500);

    return () => { clearInterval(interval); clearTimeout(navTimeout); };
  }, [opacity, translateY, router]);

  return (
    <AnimatedGradient style={styles.container}>
      <RNView style={styles.center}>
        <Animated.View style={[styles.card, { opacity, transform: [{ translateY }] }]}>
          <Text style={styles.title}>Welcome to Sola</Text>
          <Text style={styles.message}>{messages[step]}</Text>
          <RNView style={styles.footer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.footerText}>Hang tight — this only takes a second</Text>
          </RNView>
        </Animated.View>
      </RNView>
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: 'rgba(30,25,45,0.6)',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)'
  },
  title: { fontSize: 22, fontWeight: '700', color: Colors.dark.text, marginBottom: 8 },
  message: { color: Colors.dark.muted, marginBottom: 18, textAlign: 'center' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  footerText: { color: Colors.dark.muted, marginLeft: 10, fontSize: 12 }
});
