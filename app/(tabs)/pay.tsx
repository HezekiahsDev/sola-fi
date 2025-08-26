import React from 'react';
import { StyleSheet, Pressable, StatusBar, View as RNView, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import GlowOrb from '@/components/ui/GlowOrb';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { Phone, Wifi, Zap, Tv, DollarSign, CreditCard } from 'lucide-react-native';

type PayOption = {
  key: string;
  title: string;
  icon: React.ReactElement;
  onPress?: () => void;
};

export default function PayScreen() {
  const options: PayOption[] = [
    { key: 'airtime', title: 'Airtime', icon: <Phone color="#fff" size={20} />, onPress: () => console.log('Airtime') },
    { key: 'data', title: 'Data', icon: <Wifi color="#fff" size={20} />, onPress: () => console.log('Data') },
    { key: 'electricity', title: 'Electricity', icon: <Zap color="#fff" size={20} />, onPress: () => console.log('Electricity') },
    { key: 'cable', title: 'Cable TV', icon: <Tv color="#fff" size={20} />, onPress: () => console.log('Cable TV') },
    { key: 'fiat', title: 'Send Fiat', icon: <DollarSign color="#fff" size={20} />, onPress: () => console.log('Send Fiat') },
    { key: 'card', title: 'Card/Wallet', icon: <CreditCard color="#fff" size={20} />, onPress: () => console.log('Send Crypto/Card') },
  ];

  return (
    <AnimatedGradient style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <RNView style={styles.decor} pointerEvents="none">
        <GlowOrb size={260} color="rgba(47,149,220,0.35)" style={{ top: -140, right: -80 }} />
        <GlowOrb size={300} color="rgba(14,165,233,0.22)" style={{ bottom: -160, left: -100 }} />
      </RNView>

      <View style={styles.content}>
        <Text style={styles.title}>Send Payment</Text>
        <Text style={styles.helper}>Quick actions — tap any to start.</Text>

        <ScrollView contentContainerStyle={styles.verticalList} showsVerticalScrollIndicator={false}>
          {options.map((opt) => (
            <BlurView key={opt.key} intensity={60} tint="dark" style={styles.glassWrapper}>
              <Pressable
                style={({ pressed }) => [styles.glassBtn, pressed && styles.glassBtnPressed]}
                onPress={opt.onPress}
                accessibilityLabel={opt.title}
              >
                <View style={styles.iconWrapper}>{opt.icon}</View>
                <Text style={styles.glassTitle}>{opt.title}</Text>
              </Pressable>
            </BlurView>
          ))}
        </ScrollView>
      </View>
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  // content now renders directly in the main container for a cleaner look
  content: { backgroundColor: 'transparent', marginTop: 36, paddingHorizontal: 6 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  helper: { fontSize: 13, color: Colors.dark.muted, lineHeight: 18, marginBottom: 14 },
  decor: { ...StyleSheet.absoluteFillObject },

  verticalList: { paddingVertical: 4 },
  glassWrapper: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  glassBtn: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.015)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    flexDirection: 'row',
  },
  glassBtnPressed: { transform: [{ scale: 0.997 }], opacity: 0.98 },
  iconWrapper: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10, backgroundColor: 'rgba(255,255,255,0.02)' },
  glassTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
