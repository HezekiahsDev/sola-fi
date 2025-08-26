import React from 'react';
import { StyleSheet, StatusBar, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import GlowOrb from '@/components/ui/GlowOrb';
import Colors from '@/constants/Colors';
import { Clock } from 'lucide-react-native';

export default function TransactionsScreen() {
  return (
    <AnimatedGradient style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <RNView style={styles.decor} pointerEvents="none">
        <GlowOrb size={260} color="rgba(47,149,220,0.35)" style={{ top: -140, right: -80 }} />
        <GlowOrb size={300} color="rgba(14,165,233,0.22)" style={{ bottom: -160, left: -100 }} />
      </RNView>

      <View style={styles.content}>
        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.helper}>A log of all your recent transactions.</Text>

        <View style={styles.comingSoonContainer}>
          <Clock size={48} color={Colors.dark.muted} />
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            We're working on bringing you a detailed transaction history. Please check back later!
          </Text>
        </View>
      </View>
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  content: {
    backgroundColor: 'transparent',
    marginTop: 36,
    paddingHorizontal: 6,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  helper: {
    fontSize: 13,
    color: Colors.dark.muted,
    lineHeight: 18,
    marginBottom: 14,
    textAlign: 'center',
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
  },
  decor: { ...StyleSheet.absoluteFillObject },
  comingSoonContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  comingSoonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  comingSoonText: {
    fontSize: 16,
    color: Colors.dark.muted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
});
