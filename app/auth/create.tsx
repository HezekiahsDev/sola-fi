import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import InputField from '@/components/ui/InputField';

export default function CreateWalletScreen() {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const router = useRouter();
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AnimatedGradient style={styles.container}>
        <Text style={styles.title}>Create Wallet</Text>
        <Text style={styles.subtitle}>Choose a label & secure passphrase.</Text>
        <View style={styles.card}>
          <InputField
            label="Wallet Name"
            placeholder="My Primary"
            value={name}
            onChangeText={setName}
          />
          <InputField
            label="Passphrase"
            placeholder="••••••••"
            value={pass}
            onChangeText={setPass}
            secureTextEntry
            secureToggle
            hint="Minimum 6 characters"
          />
          <PrimaryButton title="Generate Seed" onPress={() => router.push('/auth/seed')} disabled={!name || pass.length < 6} />
        </View>
  </AnimatedGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 24 },
  title: { fontSize: 30, fontWeight: '700', marginTop: 46 },
  subtitle: { color: Colors.dark.muted, marginTop: 8, marginBottom: 24 },
  card: {
    backgroundColor: 'rgba(30,25,45,0.55)',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 24,
    backdropFilter: 'blur(18px)' as any,
  },
});
