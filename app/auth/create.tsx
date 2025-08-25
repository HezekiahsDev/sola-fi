import React, { useState } from 'react';
import { StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import AnimatedGradient from '@/components/ui/AnimatedGradient';

export default function CreateWalletScreen() {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const router = useRouter();
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AnimatedGradient style={styles.container}>
        <Text style={styles.title}>Create Wallet</Text>
        <Text style={styles.subtitle}>Choose a label & secure passphrase.</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Wallet Name" placeholderTextColor={Colors.dark.muted} style={styles.input} />
        <TextInput value={pass} onChangeText={setPass} secureTextEntry placeholder="Passphrase" placeholderTextColor={Colors.dark.muted} style={styles.input} />
        <PrimaryButton title="Generate Seed" onPress={() => router.push('/auth/seed')} disabled={!name || pass.length < 6} />
  </AnimatedGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 40 },
  subtitle: { color: Colors.dark.muted, marginTop: 8, marginBottom: 32 },
  input: { backgroundColor: Colors.dark.surface, borderRadius: 12, padding: 16, color: Colors.dark.text, borderWidth: 1, borderColor: Colors.dark.border, marginBottom: 16 },
});
