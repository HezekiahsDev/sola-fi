import React, { useState, useMemo, useRef, useEffect } from 'react';
import { StyleSheet, Image, View as RNView, Alert, ActivityIndicator, View as NativeView } from 'react-native';
import { View, Text } from '@/components/Themed';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import InputField from '@/components/ui/InputField';
import { useToast } from '@/components/ui/Toast';

export default function SignupScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const debouncedPass = useDebouncedValue(password, 180);
  const passwordStrength = useMemo(() => {
    if (!debouncedPass) return 0;
    let score = 0;
    if (debouncedPass.length >= 8) score++;
    if (/[A-Z]/.test(debouncedPass)) score++;
    if (/[0-9]/.test(debouncedPass)) score++;
    if (/[^A-Za-z0-9]/.test(debouncedPass)) score++;
    return score; // 0-4
  }, [debouncedPass]);

  const strengthLabel = ['Too weak','Weak','Okay','Strong','Excellent'][passwordStrength];
  const strengthColor = ['#FF4F9A','#FF934F','#F5B700','#3DDC97','#6C63FF'][passwordStrength];

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

  try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert('Signup failed', error.message);
      } else {
    toast.push('Account created! Verify email then sign in.', { type: 'success' });
    router.replace('/auth/login?justSignedUp=1');
      }
    } catch (err: any) {
      Alert.alert('Unexpected error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <AnimatedGradient staticMode style={styles.container}>
      {/* Header */}
      <RNView style={styles.topContent} accessibilityRole="header">
        <Image source={require('../../assets/images/logo-white.png')} style={styles.logo} />
        <Text style={styles.title}>Create your wallet</Text>
        <Text style={styles.subtitle}>Start sending & receiving crypto in seconds.</Text>
      </RNView>
      <RNView style={styles.formCard}>
        <InputField
          label="Email"
          placeholder="please enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoComplete="email"
        />
        <InputField
          label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            secureToggle
            hint={password ? strengthLabel : 'At least 8 characters'}
        />
        <NativeView style={styles.strengthBarWrapper}>
          <NativeView style={[styles.strengthBarBg]} />
          <NativeView style={[styles.strengthBarFill,{ width: password ? `${(passwordStrength/4)*100}%` : '0%', backgroundColor: strengthColor, opacity: password ? 1 : 0 }]} />
        </NativeView>
        <InputField
          label="Confirm Password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            secureToggle
        />
        <PrimaryButton
          title={loading ? '' : 'Create Account'}
          onPress={handleSignup}
          disabled={loading}
          variant="solid"
          style={{ marginTop: 8 }}
        >
          {loading && <ActivityIndicator color="#FFFFFF" />}
        </PrimaryButton>
        <RNView style={styles.switchRow}>
          <Text style={styles.switchText}>Already on Sola?</Text>
          <Text style={styles.switchAction} onPress={() => router.replace('/auth/login')}> Log in</Text>
        </RNView>
      </RNView>
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  topContent: { alignItems: 'center', marginBottom: 18 },
  logo: { width: 92, height: 92, marginBottom: 8, resizeMode: 'contain' },
  title: { fontSize: 28, fontWeight: '700', color: Colors.dark.text, letterSpacing: 0.5 },
  subtitle: { color: Colors.dark.muted, marginTop: 6, textAlign: 'center', paddingHorizontal: 36, fontSize: 13, lineHeight: 18 },
  formCard: {
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
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  switchText: { color: Colors.dark.muted, fontSize: 12 },
  switchAction: { color: Colors.dark.tint, fontWeight: '600', fontSize: 12 }
  ,strengthBarWrapper: { position: 'relative', height: 6, marginTop: -4, marginBottom: 12 },
  strengthBarBg: { position: 'absolute', left:0, right:0, top:0, bottom:0, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4 },
  strengthBarFill: { position: 'absolute', left:0, top:0, bottom:0, borderRadius: 4 }
});

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; setDebounced(value); return; }
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
