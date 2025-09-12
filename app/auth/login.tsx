import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, AccessibilityInfo, View as RNView, Pressable } from 'react-native';
import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackHandler } from 'react-native';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/ui/Toast';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import InputField from '@/components/ui/InputField';

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword] = useState(false); // handled inside InputField
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { signIn, loading: authLoading } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const { user } = useAuth();

  // If already authenticated, redirect away from login and prevent back
  React.useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user, router]);

  React.useEffect(() => {
    const onBack = () => {
      if (user) return true; // block back when authenticated
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [user]);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg(null);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      setErrorMsg(error);
      try { AccessibilityInfo.announceForAccessibility(error); } catch {}
      toast.push(error, { type: 'error' });
      return;
    }
    toast.push('Signed in successfully', { type: 'success' });
    // AuthProvider route guard will redirect to /(tabs)
  }
  const search = useLocalSearchParams();
  // Removed success banner to prevent layout shifts; toast handles feedback.
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
  <AnimatedGradient staticMode style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.title} accessibilityRole="header">Welcome back</Text>
            <Text style={styles.subtitle}>Access your wallet securely.</Text>

            {errorMsg ? (
              <Text style={styles.error} accessibilityLiveRegion="polite">{errorMsg}</Text>
            ) : null}
            <RNView style={styles.card}>
              <InputField
                label="Email"
                placeholder="you@domain.com"
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
                onSubmitEditing={handleLogin}
              />
              <PrimaryButton
                title={loading ? '' : 'Unlock'}
                loading={loading}
                disabled={!email || !password || loading || authLoading}
                onPress={handleLogin}
                style={{ marginTop: 4 }}
              >
              </PrimaryButton>
              <Text style={styles.recoverLink} onPress={() => router.push('/auth/recover')} accessibilityRole="link">Forgot passphrase?</Text>
            </RNView>
            <RNView style={styles.switchRow}>
              <Text style={styles.switchText}>New to Sola?</Text>
              <Text style={styles.switchAction} onPress={() => router.replace('/auth/signup')}> Create an account</Text>
            </RNView>
          </ScrollView>
        </AnimatedGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 24 },
  title: { fontSize: 30, fontWeight: '700', marginTop: 40 },
  subtitle: { color: Colors.dark.muted, marginTop: 8, marginBottom: 16 },
  scrollContent: { paddingBottom: 60 },
  error: { color: '#ef4444', marginBottom: 12 },
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
  recoverLink: { marginTop: 14, textAlign: 'center', color: Colors.dark.tint, fontSize: 13 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  switchText: { color: Colors.dark.muted, fontSize: 12 },
  switchAction: { color: Colors.dark.tint, fontWeight: '600', fontSize: 12 }
});
