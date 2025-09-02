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
    const { data, error } = await supabase.from('wallets').select('user_id, email, public_key, private_key').eq('user_id', userId);
    if (error) {
      console.warn('Failed to load wallet', error);
      setWallet(null);
    } else {
      // data is an array, take the first wallet if it exists
      setWallet(data && data.length > 0 ? data[0] : null);
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
    if (!wallet?.public_key) {
      toast.push('No public key available to copy', { type: 'error' });
      return;
    }
    try {
      // Use the modern expo-clipboard API
      const { setStringAsync } = await import('expo-clipboard');
      await setStringAsync(wallet.public_key);
      toast.push('Public key copied to clipboard', { type: 'success' });
    } catch (error) {
      console.warn('Copy failed:', error);
      toast.push('Failed to copy to clipboard', { type: 'error' });
    }
  };


  // Generic send function: send arbitrary SOL to a recipient pubkey string
    const sendSol = async (recipient: string, amount: number) => {
    if (!wallet || !wallet.secretKey) {
      throw new Error('No wallet available');
    }
    
    try {
      const { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } = await import('@solana/web3.js');
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
      const fromKeypair = wallet;
      const toPublicKey = new PublicKey(recipient);
      
      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      
      const transaction = new Transaction({
        blockhash,
        lastValidBlockHeight,
        feePayer: fromKeypair.publicKey,
      });
      
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPublicKey,
          lamports: Math.floor(amount * 1e9), // Convert SOL to lamports
        })
      );
      
      const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair], {
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
      });
      
      // Wait a bit for confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify the transaction was successful
      const txInfo = await connection.getTransaction(signature, { commitment: 'confirmed' });
      if (!txInfo) {
        throw new Error('Transaction not found');
      }
      
      return signature;
    } catch (error: any) {
      console.error('Send SOL error:', error);
      if (error.message?.includes('insufficient funds')) {
        throw new Error('Insufficient funds for transaction');
      } else if (error.message?.includes('blockhash not found')) {
        throw new Error('Transaction expired, please try again');
      } else {
        throw new Error(`Transaction failed: ${error.message || 'Unknown error'}`);
      }
    }
  };

  return { wallet, loading, balance, reload: load, copyPublicKey, sendSol };
}
