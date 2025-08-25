import React from 'react';
import { StyleSheet, Image, View as RNView } from 'react-native';
import { View, Text } from '@/components/Themed';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function SignupDisabled() {
	const router = useRouter();

	return (
		<AnimatedGradient style={styles.container}>
			<RNView style={styles.header} accessible accessibilityRole="header">
				<Image source={require('../../assets/images/logo-white.png')} style={styles.logo} accessible accessibilityLabel="App logo" />
				<Text style={styles.title}>Signups disabled</Text>
				<Text style={styles.subtitle}>We're not accepting new accounts right now. Please sign in if you already have an account.</Text>
			</RNView>

			<RNView style={styles.card}>
				<Text style={styles.info}>If you already have an account, use the button below to sign in.</Text>
				<PrimaryButton title="Go to login" onPress={() => router.replace('/auth/login')} />
			</RNView>
		</AnimatedGradient>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 26, justifyContent: 'center' },
	header: { alignItems: 'center', marginBottom: 30 },
	logo: { width: 96, height: 96, marginBottom: 12, resizeMode: 'contain' },
	title: { fontSize: 26, fontWeight: '700', color: Colors.dark.text, letterSpacing: 0.4 },
	subtitle: { color: Colors.dark.muted, marginTop: 8, textAlign: 'center', paddingHorizontal: 28, fontSize: 13, lineHeight: 18 },
	card: { marginHorizontal: 20, backgroundColor: 'rgba(255,255,255,0.04)', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
	info: { color: Colors.dark.muted, marginBottom: 12 }
});
