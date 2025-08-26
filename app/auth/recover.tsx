import React, { useState } from 'react';
import { StyleSheet, TextInput, ScrollView } from 'react-native';
import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import AnimatedGradient from '@/components/ui/AnimatedGradient';

export default function RecoverScreen() {
  const [phrase, setPhrase] = useState('');
  const router = useRouter();
  return (
    <AnimatedGradient style={styles.container}>
      <Text style={styles.title}>Recover Wallet</Text>
      <Text style={styles.subtitle}>Paste or type your 12 / 24 word secret phrase.</Text>
      <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.card}>
          <TextInput
            style={styles.textarea}
            multiline
            placeholder="word1 word2 word3 ..."
            placeholderTextColor={Colors.dark.muted}
            value={phrase}
            onChangeText={setPhrase}
          />
          <PrimaryButton title="Restore" disabled={phrase.trim().split(/\s+/).filter(Boolean).length < 12} onPress={() => router.replace('/(tabs)')} />
        </View>
      </ScrollView>
  </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 30, fontWeight: '700', marginTop: 40 },
  subtitle: { color: Colors.dark.muted, marginTop: 8, marginBottom: 24 },
  card: { backgroundColor: 'rgba(30,25,45,0.55)', borderRadius: 28, padding: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', shadowColor: '#6C63FF', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 6 }, shadowRadius: 24, backdropFilter: 'blur(18px)' as any },
  textarea: { minHeight: 160, textAlignVertical: 'top', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 16, color: Colors.dark.text, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 20, fontSize: 14, lineHeight: 20 },
});
