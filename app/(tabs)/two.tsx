import React from 'react';
import { StyleSheet, FlatList, Pressable, View as RNView, StatusBar } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import GlowOrb from '@/components/ui/GlowOrb';

type Tx = { id: string; type: 'send' | 'receive' | 'swap'; asset: string; amount: number; timestamp: string; counterparty?: string };
const TXS: Tx[] = [
  { id: 't1', type: 'receive', asset: 'SOL', amount: 3.21, timestamp: '2h ago', counterparty: 'Alice' },
  { id: 't2', type: 'send', asset: 'USDC', amount: 25, timestamp: '5h ago', counterparty: 'Merchant' },
  { id: 't3', type: 'swap', asset: 'SOL→USDC', amount: 1.5, timestamp: '1d ago' },
];

export default function ActivityScreen() {
  return (
    <AnimatedGradient style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <RNView style={styles.decor} pointerEvents="none">
        <GlowOrb size={240} color="rgba(47,149,220,0.30)" style={{ top: -120, left: -60 }} />
        <GlowOrb size={300} color="rgba(14,165,233,0.22)" style={{ bottom: -150, right: -80 }} />
      </RNView>
      <FlatList
        data={TXS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 64 }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => <TxRow tx={item} />}
      />
  </AnimatedGradient>
  );
}

function TxRow({ tx }: { tx: Tx }) {
  const color = tx.type === 'receive' ? Colors.dark.success : tx.type === 'send' ? Colors.dark.error : Colors.dark.info;
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>      
      <View style={[styles.icon, { borderColor: color }]}>        
        <Text style={{ color, fontSize: 12 }}>{tx.type[0].toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.asset}>{tx.asset}</Text>
        <Text style={styles.meta}>{tx.timestamp}{tx.counterparty ? ` · ${tx.counterparty}` : ''}</Text>
      </View>
      <Text style={[styles.amount, { color }]}>{tx.type === 'send' ? '-' : '+'}{tx.amount}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 },
  icon: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  asset: { fontSize: 15, fontWeight: '600' },
  meta: { fontSize: 12, color: Colors.dark.muted, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '700' },
  sep: { height: 1, backgroundColor: Colors.dark.border, marginLeft: 62 },
  decor: { ...StyleSheet.absoluteFillObject },
});
