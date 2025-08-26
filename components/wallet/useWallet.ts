import React from 'react';
import { supabase } from '@/lib/supabase';
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';
import { useToast } from '@/components/ui/Toast';

export default function useWallet(userId?: string | null) {
  const [wallet, setWallet] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [balance, setBalance] = React.useState<number | null>(null);
  const toast = useToast();

  const load = React.useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase.from('wallets').select('user_id, email, public_key, private_key').eq('user_id', userId).single();
    if (error) {
      console.warn('Failed to load wallet', error);
      setWallet(null);
    } else {
      setWallet(data ?? null);
    }
    setLoading(false);
  }, [userId]);

  React.useEffect(() => { load(); }, [load]);

  // balance polling
  React.useEffect(() => {
    if (!wallet?.public_key) { setBalance(null); return; }
    let mounted = true;
    const conn = new Connection(clusterApiUrl('devnet'));
    const fetchBalance = async () => {
      try {
        const bal = await conn.getBalance(new PublicKey(wallet.public_key), 'confirmed');
        if (!mounted) return;
        setBalance(bal / LAMPORTS_PER_SOL);
      } catch (e) {
        if (!mounted) return;
        console.warn('Failed to fetch balance', e);
        setBalance(null);
      }
    };
    fetchBalance();
    const id = setInterval(fetchBalance, 15000);
    return () => { mounted = false; clearInterval(id); };
  }, [wallet?.public_key]);

  const copyPublicKey = async () => {
    if (!wallet?.public_key) return;
    try {
      const clipboard = await import('expo-clipboard');
      // expo-clipboard exports named functions; access setStringAsync directly
      if (typeof clipboard.setStringAsync === 'function') {
        await clipboard.setStringAsync(wallet.public_key);
      } else if (clipboard.default && typeof clipboard.default.setStringAsync === 'function') {
        await clipboard.default.setStringAsync(wallet.public_key);
      } else {
        throw new Error('Clipboard API not available');
      }
      toast.push('Public key copied to clipboard', { type: 'success' });
    } catch (e) {
      toast.push('Copy failed', { type: 'error' });
    }
  };


  // Generic send function: send arbitrary SOL to a recipient pubkey string
  const sendSol = async (recipientStr: string, amountSol: number) => {
    if (!wallet?.private_key) {
      toast.push('No private key available to sign the transaction.', { type: 'error' });
      return;
    }
    try {
      const secret = Uint8Array.from(wallet.private_key);
      const kp = Keypair.fromSecretKey(secret);
      const conn = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const recipient = new PublicKey(recipientStr);
      const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);
      const txIx = SystemProgram.transfer({ fromPubkey: kp.publicKey, toPubkey: recipient, lamports });
      const tx = new (await import('@solana/web3.js')).Transaction().add(txIx as any);
      const sig = await conn.sendTransaction(tx, [kp]);
      
      toast.push(`Transaction sent: ${sig.slice(0, 10)}...`, { type: 'info' });
      
      const confirmation = await conn.confirmTransaction(sig, 'confirmed');
      if (confirmation.value.err) {
        throw new Error(`Transaction confirmation failed: ${confirmation.value.err}`);
      }

      toast.push(`Transaction confirmed!`, { type: 'success' });
      return { signature: sig, confirmation };
    } catch (e: any) {
      toast.push(`Send failed: ${e?.message ?? String(e)}`, { type: 'error' });
      throw e;
    }
  };

  return { wallet, loading, balance, reload: load, copyPublicKey, sendSol };
}
