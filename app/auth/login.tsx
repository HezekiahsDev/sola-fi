import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, KeyboardAvoidingView, Platform, View as RNView, useWindowDimensions, ScrollView, Pressable, TouchableWithoutFeedback, Keyboard, AccessibilityInfo } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import GradientBackground from '@/components/ui/GradientBackground';
import AnimatedGradient from '@/components/ui/AnimatedGradient';

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  
  async function handleLogin() {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await (await import('@/lib/supabase')).supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { 
      setErrorMsg(error.message);
      // Announce error for screen readers
      try { AccessibilityInfo.announceForAccessibility(error.message); } catch {}
      return; 
    }
    router.replace('/(tabs)');
  }
  const router = useRouter();
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <AnimatedGradient style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.title} accessibilityRole="header">Unlock Wallet</Text>
            <Text style={styles.subtitle}>Enter your passphrase to access your assets.</Text>

            {errorMsg ? (
              <Text style={styles.error} accessibilityLiveRegion="polite">{errorMsg}</Text>
            ) : null}

            <Text style={styles.label} accessibilityLabel="Email label">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@site.com"
              placeholderTextColor={Colors.dark.muted}
              style={[styles.input, focus === 'email' && styles.inputFocus]}
              keyboardType="email-address"
              autoCapitalize="none"
              ref={emailRef}
              returnKeyType="next"
              textContentType="emailAddress"
              autoComplete="email"
              onSubmitEditing={() => passwordRef.current?.focus()}
              onFocus={() => setFocus('email')}
              onBlur={() => setFocus(null)}
              accessible
              accessibilityLabel="Email input"
              accessibilityHint="Enter the email address for your account"
            />

            <Text style={styles.label} accessibilityLabel="Password label">Password</Text>
            <RNView style={styles.passwordRow}>
              <TextInput
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={Colors.dark.muted}
                style={[styles.input, styles.passwordInput, focus === 'password' && styles.inputFocus]}
                ref={passwordRef}
                returnKeyType="done"
                textContentType="password"
                autoComplete="password"
                onSubmitEditing={handleLogin}
                onFocus={() => setFocus('password')}
                onBlur={() => setFocus(null)}
                accessible
                accessibilityLabel="Password input"
                accessibilityHint="Enter your password or passphrase"
              />
              <Pressable
                onPress={() => setShowPassword(s => !s)}
                style={styles.showBtn}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                accessibilityHint="Toggles password visibility"
              >
                <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color={Colors.dark.muted} />
              </Pressable>
            </RNView>

            <Pressable onPress={handleLogin} accessibilityRole="button" accessibilityState={{ disabled: !email || !password }} accessibilityLabel="Unlock and sign in">
              <PrimaryButton title="Unlock" loading={loading} disabled={!email || !password} />
            </Pressable>
            <Text style={styles.footerLink} onPress={() => router.push('/auth/recover')} accessibilityRole="link">Forgot passphrase?</Text>
          </ScrollView>
        </AnimatedGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 40 },
  subtitle: { color: Colors.dark.muted, marginTop: 8, marginBottom: 24 },
  scrollContent: { paddingBottom: 40 },
  label: { color: Colors.dark.muted, marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: Colors.dark.surface, borderRadius: 12, padding: 14, color: Colors.dark.text, borderWidth: 1, borderColor: Colors.dark.border, marginBottom: 6 },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1, marginBottom: 16 },
  showBtn: { padding: 10, marginLeft: 8 },
  inputFocus: { borderColor: Colors.dark.tint, shadowColor: Colors.dark.tint, shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  error: { color: '#ef4444', marginTop: 8, marginBottom: 6 },
  footerLink: { marginTop: 8, textAlign: 'center', color: Colors.dark.tint, fontSize: 14 }
});
