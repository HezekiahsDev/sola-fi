import React from 'react';
import { View as RNView, Text, Pressable, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Copy } from 'lucide-react-native';

export default function WalletBadge({ publicKey, onCopy }: { publicKey?: string | null; onCopy?: () => void }) {
  if (!publicKey) return null;
  const short = (k: string, s = 6, e = 6) => k.length > s + e + 3 ? `${k.slice(0, s)}...${k.slice(-e)}` : k;
  return (
    <RNView style={styles.row}>
      <Text style={styles.text}>Public: {short(publicKey)}</Text>
      <Pressable onPress={onCopy} style={{ marginLeft: 8 }} accessibilityLabel="Copy public key">
        <Copy size={14} color={Colors.dark.muted} />
      </Pressable>
    </RNView>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', marginTop: 6 }, text: { color: Colors.dark.muted, fontSize: 12, flexShrink: 1 } });
