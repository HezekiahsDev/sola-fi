import React from 'react';
import { supabase } from '@/lib/supabase';
// NOTE: do not import '@solana/web3.js' at top-level — it requires
// crypto.getRandomValues during module evaluation in some environments.
// We dynamically import web3 inside functions after the crypto polyfill
// (react-native-get-random-values) is loaded at app entry.
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
      const row = data && data.length > 0 ? data[0] : null;
      if (row && row.private_key && typeof row.private_key === 'string') {
        try {
          row.private_key = JSON.parse(row.private_key);
        } catch {
          // leave as-is; downstream will validate
        }
      }
      setWallet(row);
    }
    setLoading(false);
  }, [userId]);

  React.useEffect(() => { load(); }, [load]);

  // balance polling
  React.useEffect(() => {
    if (!wallet?.public_key) { setBalance(null); return; }
    let mounted = true;
    let id: any;
    const fetchBalance = async () => {
      try {
        const web3 = await import('@solana/web3.js');
        const Connection = web3.Connection ?? web3.default?.Connection;
        const clusterApiUrl = web3.clusterApiUrl ?? web3.default?.clusterApiUrl;
        const PublicKey = web3.PublicKey ?? web3.default?.PublicKey;
        const LAMPORTS_PER_SOL = web3.LAMPORTS_PER_SOL ?? web3.default?.LAMPORTS_PER_SOL ?? 1000000000;
        if (!Connection || !clusterApiUrl || !PublicKey) throw new Error('Missing web3 utilities');
        const conn = new Connection(clusterApiUrl('devnet'));
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
    id = setInterval(fetchBalance, 15000);
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


  // Generic send function: send SOL to a recipient pubkey string
  const sendSol = async (recipient: string, amount: number) => {
    if (!wallet?.public_key || !wallet?.private_key) {
      throw new Error('No wallet available');
    }
    try {
      // private_key is stored as JSONB (array of numbers); convert to Uint8Array
  const secretArr: number[] = Array.isArray(wallet.private_key)
        ? wallet.private_key
        : (wallet.private_key?.data || wallet.private_key?.secretKey || []);
  const secretKey = new Uint8Array(secretArr);
  if (!secretKey?.length) throw new Error('Missing private key');

  // Dynamically import Keypair and sendAndConfirmTransaction so the
  // crypto polyfill (getRandomValues) is loaded first in native environments.
  const web3 = await import('@solana/web3.js');
  const Keypair = web3.Keypair ?? web3.default?.Keypair;
  const sendAndConfirmTransaction = web3.sendAndConfirmTransaction ?? web3.default?.sendAndConfirmTransaction;
  if (!Keypair || !sendAndConfirmTransaction) throw new Error('Failed to load Solana web3 utilities');
  const fromKeypair = Keypair.fromSecretKey(secretKey);

  const clusterApiUrl = web3.clusterApiUrl ?? web3.default?.clusterApiUrl;
  const PublicKey = web3.PublicKey ?? web3.default?.PublicKey;
  const SystemProgram = web3.SystemProgram ?? web3.default?.SystemProgram;
  if (!clusterApiUrl || !PublicKey || !SystemProgram) throw new Error('Missing web3 utilities');
  const connection = new web3.Connection(clusterApiUrl('devnet'), 'confirmed');
  const toPublicKey = new PublicKey(recipient);

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
  const TransactionCtor = web3.Transaction ?? web3.default?.Transaction;
  if (!TransactionCtor) throw new Error('Missing Transaction constructor');
  const transaction = new TransactionCtor({ blockhash, lastValidBlockHeight, feePayer: fromKeypair.publicKey });
      transaction.add(SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: Math.floor(amount * 1e9),
      }));

  const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair], {
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
      });

      // Brief delay then verify
      await new Promise((r) => setTimeout(r, 1200));
      const txInfo = await connection.getTransaction(signature, { commitment: 'confirmed' });
      if (!txInfo) throw new Error('Transaction not found');
      return signature;
    } catch (error: any) {
      console.error('Send SOL error:', error);
      const msg = error?.message || '';
      if (msg.includes('insufficient funds')) throw new Error('Insufficient funds for transaction');
      if (msg.includes('blockhash not found')) throw new Error('Transaction expired, please try again');
      throw new Error(`Transaction failed: ${msg || 'Unknown error'}`);
    }
  };

  return { wallet, loading, balance, reload: load, copyPublicKey, sendSol };
}
