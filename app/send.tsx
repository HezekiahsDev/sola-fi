import React from 'react';
import { StyleSheet, View as RNView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Text, View } from '@/components/Themed';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Colors from '@/constants/Colors';
import useWallet from '@/components/wallet/useWallet';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'expo-router';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import GlowOrb from '@/components/ui/GlowOrb';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '@/components/auth/AuthProvider';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function SendModal() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const { wallet, sendSol, balance, reload } = useWallet(user?.id);
  const [recipient, setRecipient] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isConfirmVisible, setConfirmVisible] = React.useState(false);

  const pasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) setRecipient(text.trim());
    } catch (e) {
      toast.push('Paste failed', { type: 'error' });
    }
  };

  const setMax = () => {
    if (typeof balance === 'number') {
      setAmount(String(Number(balance.toFixed(6))));
    } else {
      toast.push('Balance unavailable', { type: 'error' });
    }
  };

  const handleSend = async () => {
    if (!recipient || !amount) {
      toast.push('Enter recipient and amount', { type: 'error' });
      return;
    }
    
    // Validate recipient address
    try {
      new (await import('@solana/web3.js')).PublicKey(recipient);
    } catch (e) {
      toast.push('Invalid recipient address', { type: 'error' });
      return;
    }
    
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      toast.push('Enter a valid amount', { type: 'error' });
      return;
    }
    
    // Check if amount is greater than balance
    if (typeof balance === 'number' && amt > balance) {
      toast.push('Insufficient balance', { type: 'error' });
      return;
    }
    
    // Check minimum amount (considering fees)
    const minAmount = 0.00001; // Minimum SOL amount
    if (amt < minAmount) {
      toast.push(`Minimum amount is ${minAmount} SOL`, { type: 'error' });
      return;
    }
    
    setConfirmVisible(true);
  };

  const executeSend = async () => {
    const amt = Number(amount);
    try {
      setLoading(true);
      const signature = await sendSol(recipient, amt);
      toast.push(`Transaction successful! ${signature.slice(0, 8)}...`, { type: 'success' });
      setConfirmVisible(false);
      setRecipient('');
      setAmount('');
      // Refresh balance
      await reload();
      router.back();
    } catch (e: any) {
      console.error('Send error:', e);
      toast.push(e.message || 'Failed to send transaction', { type: 'error' });
      setConfirmVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const shortRecipient = recipient ? `${recipient.slice(0, 4)}...${recipient.slice(-4)}` : '';
  const estimatedFee = 0.000005;
  const totalAmount = (Number(amount) || 0) + estimatedFee;

  return (
    <SafeAreaView style={{ backgroundColor: 'transparent', flex: 1 }}>
      <AnimatedGradient style={styles.container}>
        <RNView style={styles.decor} pointerEvents="none">
          <GlowOrb size={260} color="rgba(47,149,220,0.35)" style={{ top: -140, right: -80 }} />
          <GlowOrb size={300} color="rgba(14,165,233,0.22)" style={{ bottom: -160, left: -100 }} />
        </RNView>
        <View style={styles.content}>
          <BlurView intensity={10} tint="dark" style={styles.card}>
            <Text style={styles.title}>Send SOL</Text>
            
            <Text style={styles.label}>Recipient</Text>
            <RNView style={styles.row}>
              <TextInput
                value={recipient}
                onChangeText={setRecipient}
                placeholder="Recipient public key"
                style={styles.input}
                placeholderTextColor={Colors.dark.muted}
              />
              <Pressable onPress={pasteFromClipboard} style={styles.trailingBtn} accessibilityLabel="Paste public key">
                <Text style={styles.trailingText}>Paste</Text>
              </Pressable>
            </RNView>

            <Text style={styles.label}>Amount (SOL)</Text>
            <RNView style={styles.row}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.01"
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={Colors.dark.muted}
              />
              <Pressable onPress={setMax} style={styles.trailingBtn} accessibilityLabel="Set max amount">
                <Text style={[styles.trailingText, { color: Colors.dark.accentGold }]}>Max</Text>
              </Pressable>
            </RNView>
            <Text style={styles.balanceText}>Balance: {typeof balance === 'number' ? balance.toFixed(6) + ' SOL' : '- SOL'}</Text>

            <PrimaryButton title={loading ? 'Sending…' : 'Send'} onPress={handleSend} disabled={loading} style={{ marginTop: 18 }} variant="gold" />
          </BlurView>
        </View>
        <ConfirmModal
          visible={isConfirmVisible}
          title="Confirm Transaction"
          message={`You are about to send ${amount} SOL to ${shortRecipient}.\n\nEst. Fee: ${estimatedFee.toFixed(6)} SOL\nTotal: ${totalAmount.toFixed(6)} SOL`}
          confirmLabel="Confirm"
          onConfirm={executeSend}
          onCancel={() => setConfirmVisible(false)}
          loading={loading}
        />
      </AnimatedGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'transparent', flex: 1, padding: 20 },
  decor: { ...StyleSheet.absoluteFillObject },
  content: { backgroundColor: 'transparent', marginTop: 36, paddingHorizontal: 6 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 8 },
  label: { color: Colors.dark.muted, marginTop: 12, marginBottom: 8, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    color: '#fff',
  },
  trailingBtn: { marginLeft: 10 },
  trailingText: { color: Colors.dark.accentAqua, fontWeight: '700' },
  card: {
    borderRadius: 16,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  balanceText: { 
    color: Colors.dark.muted,
    fontSize: 14,
    marginTop: 10,
    textAlign: 'right'
  },
});
