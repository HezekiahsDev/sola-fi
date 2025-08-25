import React, { useMemo, useState } from 'react';
import { StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import AnimatedGradient from '@/components/ui/AnimatedGradient';

function generateMockSeed() {
  const words = ['solar','future','asset','secure','border','chain','velocity','quantum','wallet','layer','swift','vector','signal','galaxy','ledger','orbit','matrix','ember','nexus','cobalt','plasma','zenith','delta','ember','hash'];
  return Array.from({ length: 12 }, () => words[Math.floor(Math.random()*words.length)]);
}

export default function SeedScreen() {
  const router = useRouter();
  const [ack, setAck] = useState(false);
  const seedWords = useMemo(() => generateMockSeed(), []);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!ack) return;
    setLoading(true);
    try {
      const { data: { user } } = await (await import('@/lib/supabase')).supabase.auth.getUser();
      if (!user) {
        alert('No authenticated user found.');
        setLoading(false);
        return;
      }
      const seed = seedWords.join(' ');
      await (await import('@/lib/supabase')).supabase.from('wallets').insert([{ user_id: user.id, name: 'Primary Wallet', seed }]);
      router.replace('/(tabs)');
    } catch (err: any) {
      console.warn(err);
      alert('Failed to store wallet (mock).');
    }
    setLoading(false);
  }
  return (
    <AnimatedGradient style={styles.container}>
      <Text style={styles.title}>Recovery Phrase</Text>
      <Text style={styles.subtitle}>Write these 12 words down in order. Never share them with anyone.</Text>
      <ScrollView contentContainerStyle={styles.grid} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {seedWords.map((w, i) => (
          <View key={i} style={styles.wordBox}><Text style={styles.index}>{i+1}.</Text><Text style={styles.word}>{w}</Text></View>
        ))}
      </ScrollView>
      <Pressable onPress={() => setAck(!ack)} style={styles.checkboxRow}>
        <View style={[styles.checkbox, ack && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>I stored my phrase safely.</Text>
      </Pressable>
  <PrimaryButton title="Continue" disabled={!ack} loading={loading} onPress={handleContinue} />
      <PrimaryButton variant="outline" title="Copy Phrase" onPress={() => { Alert.alert('Copied (mock)'); }} style={{marginTop: 12}} />
  </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 20 },
  subtitle: { color: Colors.dark.muted, marginTop: 8, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  wordBox: { flexDirection: 'row', alignItems: 'center', width: '45%', backgroundColor: Colors.dark.surface, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.dark.border },
  index: { color: Colors.dark.muted, marginRight: 6, fontSize: 12 },
  word: { fontSize: 14, fontWeight: '600' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1, borderColor: Colors.dark.border, marginRight: 12 },
  checkboxChecked: { backgroundColor: Colors.dark.tint },
  checkboxLabel: { color: Colors.dark.text },
});
