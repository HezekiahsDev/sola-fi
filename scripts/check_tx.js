#!/usr/bin/env node
// Usage: node scripts/check_tx.js <PUBLIC_KEY>
// Prints recent signatures and basic details for a devnet address.
const { Connection, clusterApiUrl, PublicKey } = require('@solana/web3.js');

async function main() {
  const pub = process.argv[2];
  if (!pub) {
    console.error('Usage: node scripts/check_tx.js <PUBLIC_KEY>');
    process.exit(2);
  }
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  try {
    const pk = new PublicKey(pub);
    console.log('Fetching recent signatures for', pk.toBase58());
    const sigs = await connection.getSignaturesForAddress(pk, { limit: 20 });
    if (!sigs || sigs.length === 0) {
      console.log('No recent signatures found.');
      return;
    }
    for (const s of sigs) {
      console.log('---');
      console.log('signature:', s.signature);
      console.log('slot:', s.slot, 'err:', s.err, 'memo:', s.memo || '-');
      if (s.blockTime) console.log('time:', new Date(s.blockTime * 1000).toISOString());
      // fetch transaction details
      const tx = await connection.getTransaction(s.signature, { commitment: 'confirmed' });
      if (!tx) {
        console.log('  [no transaction details available]');
        continue;
      }
      console.log('  fee:', tx.meta?.fee ?? 'n/a');
      console.log('  preBalances:', tx.meta?.preBalances?.slice(0,4));
      console.log('  postBalances:', tx.meta?.postBalances?.slice(0,4));
      // print a short list of account keys involved
      console.log('  accounts:', tx.transaction.message.accountKeys.map(k => k.toBase58()).slice(0,6));
    }
  } catch (e) {
    console.error('Error fetching transactions:', e);
    process.exit(1);
  }
}

main();
