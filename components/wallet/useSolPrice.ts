import React from 'react';

// Simple hook to fetch SOL/USD price from CoinGecko and poll at an interval.
export default function useSolPrice(pollIntervalMs: number = 10000) {
  const [price, setPrice] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<any | null>(null);

  const fetchPrice = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const json = await res.json();
      const p = json?.solana?.usd;
      if (typeof p === 'number') {
        setPrice(p);
        setError(null);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;
    if (!mounted) return;
    fetchPrice();
    const id = setInterval(fetchPrice, pollIntervalMs);
    return () => { mounted = false; clearInterval(id); };
  }, [fetchPrice, pollIntervalMs]);

  const reload = React.useCallback(() => { fetchPrice(); }, [fetchPrice]);

  return { price, loading, error, reload } as const;
}
