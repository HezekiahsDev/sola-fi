import React from 'react';
import { StyleSheet, FlatList, Pressable, View as RNView, StatusBar } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import GlowOrb from '@/components/ui/GlowOrb';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, DollarSign, Copy, QrCode } from 'lucide-react-native';
import { useAuth } from '@/components/auth/AuthProvider';
import useWallet from '@/components/wallet/useWallet';
import { ActivityIndicator } from 'react-native';
import WalletBadge from '@/components/wallet/WalletBadge';
import ReceiveModal from '@/components/wallet/ReceiveModal';
import useSolPrice from '@/components/wallet/useSolPrice';
// removed unused Modal/TouchableOpacity imports; page uses ReceiveModal component
import { useToast } from '@/components/ui/Toast';
import { useRouter, useFocusEffect } from 'expo-router';

type Asset = { id: string; symbol: string; name: string; amount: number; usd: number };
const DATA: Asset[] = [
  { id: '1', symbol: 'SOL', name: 'Solana', amount: 12.345, usd: 234.56 },
  // zeroed out by default per request
  { id: '2', symbol: 'USDC', name: 'USD Coin', amount: 0, usd: 0 },
  { id: '3', symbol: 'BTC', name: 'Bitcoin', amount: 0, usd: 0 },
];

export default function WalletHomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [qrVisible, setQrVisible] = React.useState(false);
  const toast = useToast();
  // Use the centralized wallet hook for loading, balance, and actions
  const { wallet, loading: loadingWallet, balance: solBalance, copyPublicKey, reload } = useWallet(user?.id);
  const { price: solPriceUsd } = useSolPrice(10000);

  useFocusEffect(
    React.useCallback(() => {
      reload();
    }, [reload])
  );

  // derive assets list using live SOL balance when available
  const assets = React.useMemo(() => {
    const price = typeof solPriceUsd === 'number' ? solPriceUsd : 24.3;
    return DATA.map((d) => {
      if (d.symbol === 'SOL') {
        const amount = typeof solBalance === 'number' ? solBalance : d.amount;
        const usd = typeof solBalance === 'number' ? solBalance * price : (d.usd ?? 0);
        return { ...d, amount, usd };
      }
      return d;
    });
  }, [solBalance, solPriceUsd]);

  return (
    <AnimatedGradient style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Background Glow Orbs */}
      <RNView style={styles.decor} pointerEvents="none">
        <GlowOrb size={260} color="rgba(147, 51, 234, 0.25)" style={{ top: -120, right: -60 }} />
        <GlowOrb size={300} color="rgba(59, 130, 246, 0.2)" style={{ bottom: -140, left: -80 }} />
      </RNView>

      {/* Header */}
      <View style={styles.headerRow }>
        <View style={{ backgroundColor: 'transparent' }}>
          <Text style={styles.walletTitle}>Hi {user?.email?.split('@')[0] || 'there'}</Text>
          <Text style={styles.walletSubtitle}>Here’s your portfolio</Text>
          {/* show loading state for public key copy */}
          {loadingWallet ? (
            <RNView style={{ marginTop: 8, backgroundColor: 'transparent' }}>
              <ActivityIndicator size="small" color="#fff" />
            </RNView>
          ) : (
            <WalletBadge publicKey={wallet?.public_key} onCopy={copyPublicKey} />
          )}
        </View>
        <Pressable
          onPress={() => router.push('/(tabs)/profile')}
          style={({ pressed }) => [styles.avatar, pressed && { opacity: 0.8 }]}
        >
          {user?.email && <Text style={styles.avatarText}>{user.email[0].toUpperCase()}</Text>}
        </Pressable>
      </View>

      {/* Balance Card */}
      <BlurView intensity={70} tint="dark" style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        {/* show spinner while wallet/balance is loading to avoid showing dummy funds */}
        {loadingWallet || solBalance === null ? (
          <RNView style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
            <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 12 }} />
            <Text style={[styles.balanceChange, { color: Colors.dark.muted, marginTop: 8 }]}>Loading balances…</Text>
          </RNView>
        ) : (
          <>
            <Text style={styles.balanceValue}>{`${solBalance.toFixed(4)} SOL`}</Text>
            <Text style={styles.balanceChange}>{`${(solBalance * (solPriceUsd ?? 24.3)).toFixed(2)} USD`}</Text>
          </>
        )}
        <View style={styles.actionRow}>
          <CircleAction label="Send" icon={<ArrowUpRight size={18} />} accent={Colors.dark.accentGold} onPress={() => router.push('/send')} />
          <CircleAction label="Receive" icon={<QrCode size={18} />} accent={Colors.dark.accentAqua} onPress={() => setQrVisible(true)} />
          <CircleAction label="Pay" icon={<DollarSign size={18} />} accent={Colors.dark.accentPink} onPress={() => router.push('/(tabs)/pay')} />
          <CircleAction label="Swap" icon={<RefreshCw size={18} />} accent={Colors.dark.primaryTint} />
        </View>
      </BlurView>

  <ReceiveModal visible={qrVisible} onClose={() => setQrVisible(false)} publicKey={wallet?.public_key} onCopy={copyPublicKey} />

      {/* Assets */}
  <Text style={styles.sectionTitle}>Your Assets</Text>
      <FlatList
        data={assets}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 64 }}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            style={({ pressed }) => [styles.assetRow, pressed && { opacity: 0.6 }]}
          >
            <View style={[styles.assetAvatar, { backgroundColor: getColorForAsset(item.symbol) }]}>
              <Text style={styles.assetAvatarText}>{item.symbol[0]}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
              <Text style={styles.assetName}>{item.symbol}</Text>
              <Text style={styles.assetSub}>{item.name}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', backgroundColor: 'transparent' }}>
              {/* hide amounts while still loading wallet/balance to prevent showing dummy data */}
              {loadingWallet || solBalance === null ? (
                <Text style={[styles.assetAmount, { color: Colors.dark.muted }]}>—</Text>
              ) : (
                <Text style={styles.assetAmount}>{typeof item.amount === 'number' ? item.amount.toFixed(4) : item.amount}</Text>
              )}
              <Text style={styles.assetUSD}>{loadingWallet || solBalance === null ? '—' : `$${Number(item.usd).toFixed(2)}`}</Text>
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </AnimatedGradient>
  );
}

// Helper: convert hex color (e.g. #RRGGBB) to rgba string with given alpha
function hexToRgba(hex: string, alpha = 0.25) {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function CircleAction({ label, icon, accent, onPress }: { label: string; icon: React.ReactElement; accent?: string; onPress?: () => void }) {
  const renderedIcon = accent ? React.cloneElement(icon as any, { color: '#fff' }) : icon;
  // Use subtle accent for border/background
  const borderColor = accent ? hexToRgba(accent, 0.18) : 'rgba(255,255,255,0.12)';
  const bgColor = accent ? hexToRgba(accent, 0.06) : 'rgba(255,255,255,0.04)';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.circleBtn,
        { borderColor, backgroundColor: bgColor },
        pressed && { transform: [{ scale: 0.95 }], shadowOpacity: 0.6 },
      ]}
    >
      {renderedIcon}
      <Text style={styles.circleBtnText}>{label}</Text>
    </Pressable>
  );
}

function getColorForAsset(symbol: string) {
  switch (symbol) {
    case 'BTC': return hexToRgba(Colors.dark.accentGold, 0.22);
    case 'SOL': return hexToRgba(Colors.dark.tint, 0.22);
    case 'USDC': return hexToRgba(Colors.dark.accentAqua, 0.22);
    default: return 'rgba(255,255,255,0.08)';
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'transparent', flex: 1, padding: 20 },
  headerRow: { backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 16 },
  walletTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  walletSubtitle: { fontSize: 13, color: Colors.dark.muted, marginTop: 2 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.dark.surface, borderWidth: 1, borderColor: Colors.dark.border, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#fff' },

  balanceCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginTop: 10,
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#9333EA',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    overflow: 'hidden',
  },
  balanceLabel: { color: Colors.dark.muted, fontSize: 12, letterSpacing: 0.2 },
  balanceValue: { fontSize: 30, fontWeight: '800', marginTop: 4, color: '#fff', letterSpacing: 0.3 },
  balanceChange: { fontSize: 12, fontWeight: '600', color: '#4ade80', marginTop: 4 },

  actionRow: { backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },

  circleBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    padding: 6,
  },
  circleBtnText: { marginTop: 4, fontWeight: '600', fontSize: 11, color: '#fff', letterSpacing: 0.3 },

  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 14, color: '#fff' },

  assetRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.02)' },
  assetAvatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  assetAvatarText: { fontWeight: '700', color: '#fff' },
  assetName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  assetSub: { fontSize: 13, color: Colors.dark.muted, marginTop: 2 },
  assetAmount: { fontSize: 16, fontWeight: '600', color: '#fff' },
  assetUSD: { fontSize: 13, color: Colors.dark.muted, marginTop: 2 },
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  decor: { ...StyleSheet.absoluteFillObject },
});
