import React from 'react';
import { StyleSheet, FlatList, Pressable, View as RNView, StatusBar } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import GlowOrb from '@/components/ui/GlowOrb';

type Asset = { id: string; symbol: string; name: string; amount: number; usd: number };
const DATA: Asset[] = [
  { id: '1', symbol: 'SOL', name: 'Solana', amount: 12.345, usd: 234.56 },
  { id: '2', symbol: 'USDC', name: 'USD Coin', amount: 102.12, usd: 102.12 },
  { id: '3', symbol: 'BTC', name: 'Bitcoin', amount: 0.055, usd: 3500.11 },
];

export default function WalletHomeScreen() {
  return (
    <AnimatedGradient style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <RNView style={styles.decor} pointerEvents="none">
        <GlowOrb size={260} color="rgba(47,149,220,0.35)" style={{ top: -140, right: -80 }} />
        <GlowOrb size={300} color="rgba(14,165,233,0.22)" style={{ bottom: -160, left: -100 }} />
      </RNView>
  <BlurView intensity={30} tint="dark" style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceValue}>$ 3,836.79</Text>
        <View style={styles.actionRow}>
          <ActionButton label="Send" />
          <ActionButton label="Receive" />
          <ActionButton label="Swap" />
        </View>
  </BlurView>
      <Text style={styles.sectionTitle}>Assets</Text>
      <FlatList
        data={DATA}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 48 }}
        renderItem={({ item }) => (
          <Pressable style={styles.assetRow}>
            <View style={styles.assetAvatar}><Text style={styles.assetAvatarText}>{item.symbol[0]}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.assetName}>{item.symbol}</Text>
              <Text style={styles.assetSub}>{item.name}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.assetAmount}>{item.amount}</Text>
              <Text style={styles.assetUSD}>${item.usd.toFixed(2)}</Text>
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
  </AnimatedGradient>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <Pressable style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}>
      <Text style={styles.actionBtnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  balanceCard: { backgroundColor: 'rgba(17,17,17,0.55)', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: Colors.dark.border, marginTop: 12, marginBottom: 24, overflow: 'hidden' },
  balanceLabel: { color: Colors.dark.muted, fontSize: 14 },
  balanceValue: { fontSize: 36, fontWeight: '700', marginTop: 8 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  actionBtn: { backgroundColor: Colors.dark.tint, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14 },
  actionBtnText: { fontWeight: '600', fontSize: 14, color: '#000' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  assetRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  assetAvatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.dark.surface, alignItems: 'center', justifyContent: 'center', marginRight: 14, borderWidth: 1, borderColor: Colors.dark.border },
  assetAvatarText: { fontWeight: '700' },
  assetName: { fontSize: 16, fontWeight: '600' },
  assetSub: { fontSize: 12, color: Colors.dark.muted, marginTop: 2 },
  assetAmount: { fontSize: 16, fontWeight: '600' },
  assetUSD: { fontSize: 12, color: Colors.dark.muted, marginTop: 2 },
  separator: { height: 1, backgroundColor: Colors.dark.border },
  decor: { ...StyleSheet.absoluteFillObject },
});
