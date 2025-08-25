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
      <Text style={styles.subtitle}>Enter your 12-word recovery phrase separated by spaces.</Text>
      <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom: 40}}>
        <TextInput
          style={styles.textarea}
          multiline
          placeholder="word1 word2 word3 ..."
          placeholderTextColor={Colors.dark.muted}
          value={phrase}
          onChangeText={setPhrase}
        />
        <PrimaryButton title="Restore" disabled={phrase.trim().split(/\s+/).filter(Boolean).length < 12} onPress={() => router.replace('/(tabs)')} />
      </ScrollView>
  </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 20 },
  subtitle: { color: Colors.dark.muted, marginTop: 8, marginBottom: 24 },
  textarea: { minHeight: 140, textAlignVertical: 'top', backgroundColor: Colors.dark.surface, borderRadius: 12, padding: 16, color: Colors.dark.text, borderWidth: 1, borderColor: Colors.dark.border, marginBottom: 24 },
});
