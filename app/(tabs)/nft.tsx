import React from "react";
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
  View as RNView,
  FlatList,
} from "react-native";
import { Text, View } from "@/components/Themed";
import AnimatedGradient from "@/components/ui/AnimatedGradient";
import GlowOrb from "@/components/ui/GlowOrb";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import {
  Sparkles,
  Flame,
  Clock,
  Star,
  Palette,
  Crown,
  TrendingUp,
  ArrowUpRight,
  Compass,
} from "lucide-react-native";

type CategoryKey = "all" | "trending" | "auctions" | "art" | "collectibles";

type CategoryChip = {
  key: CategoryKey;
  label: string;
  icon: React.ReactElement;
};

type TrendingItem = {
  id: string;
  title: string;
  artist: string;
  floor: number;
  change: number;
  volume: number;
  accent: string;
  tags: CategoryKey[];
};

type CollectionCard = {
  id: string;
  title: string;
  pieces: number;
  spotlight: string;
  gradient: [string, string];
  tags: CategoryKey[];
};

const categories: CategoryChip[] = [
  { key: "all", label: "All", icon: <Compass size={16} color="#fff" /> },
  {
    key: "trending",
    label: "Trending",
    icon: <TrendingUp size={16} color="#fff" />,
  },
  {
    key: "auctions",
    label: "Live Auctions",
    icon: <Clock size={16} color="#fff" />,
  },
  {
    key: "art",
    label: "Digital Art",
    icon: <Palette size={16} color="#fff" />,
  },
  {
    key: "collectibles",
    label: "Collectibles",
    icon: <Star size={16} color="#fff" />,
  },
];

const stats = [
  { label: "Total Volume", value: "2.3M SOL" },
  { label: "Creators", value: "3.4K" },
  { label: "Active Bids", value: "782" },
];

const featuredCollections: CollectionCard[] = [
  {
    id: "astral-dreams",
    title: "Astral Dreams",
    pieces: 24,
    spotlight: "Nebula Chapter",
    gradient: ["rgba(108,99,255,0.55)", "rgba(255,79,154,0.45)"],
    tags: ["trending", "art"],
  },
  {
    id: "prismatics",
    title: "Prismatics",
    pieces: 18,
    spotlight: "Refraction Series",
    gradient: ["rgba(61,220,151,0.55)", "rgba(62,47,127,0.45)"],
    tags: ["art"],
  },
  {
    id: "synthetic-muses",
    title: "Synthetic Muses",
    pieces: 32,
    spotlight: "Genesis Drop",
    gradient: ["rgba(245,183,0,0.55)", "rgba(108,99,255,0.45)"],
    tags: ["collectibles", "auctions"],
  },
];

const trendingNow: TrendingItem[] = [
  {
    id: "celestial-bloom",
    title: "Celestial Bloom #82",
    artist: "@aurorastudio",
    floor: 12.4,
    change: 3.2,
    volume: 1860,
    accent: "rgba(108,99,255,0.55)",
    tags: ["trending", "art"],
  },
  {
    id: "neon-tides",
    title: "Neon Tides #21",
    artist: "@chromaverse",
    floor: 8.75,
    change: -1.6,
    volume: 1420,
    accent: "rgba(255,79,154,0.55)",
    tags: ["collectibles"],
  },
  {
    id: "glitch-oracle",
    title: "Glitch Oracle #09",
    artist: "@datastream",
    floor: 4.62,
    change: 6.1,
    volume: 980,
    accent: "rgba(61,220,151,0.55)",
    tags: ["trending", "auctions"],
  },
];

export default function NFTScreen() {
  const [selected, setSelected] = React.useState<CategoryKey>("all");

  const filteredCollections = React.useMemo(() => {
    if (selected === "all") return featuredCollections;
    return featuredCollections.filter((collection) =>
      collection.tags.includes(selected)
    );
  }, [selected]);

  const filteredTrending = React.useMemo(() => {
    if (selected === "all") return trendingNow;
    return trendingNow.filter((item) => item.tags.includes(selected));
  }, [selected]);

  return (
    <AnimatedGradient style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <RNView style={styles.decor} pointerEvents="none">
        <GlowOrb
          size={260}
          color="rgba(108,99,255,0.28)"
          style={{ top: -140, right: -60 }}
        />
        <GlowOrb
          size={260}
          color="rgba(255,79,154,0.24)"
          style={{ bottom: -160, left: -80 }}
        />
      </RNView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroHeader}>
          <View style={{ backgroundColor: "transparent" }}>
            <Text style={styles.heroEyebrow}>
              Discover Digital Masterpieces
            </Text>
            <Text style={styles.heroTitle}>NFT Marketplace</Text>
            <Text style={styles.heroSubtitle}>
              Bid on curated drops, explore futuristic art, and back the
              creators shaping Web3 culture.
            </Text>
          </View>
          <RNView style={styles.heroBadge}>
            <Crown size={22} color={Colors.dark.accentGold} />
            <View style={{ marginLeft: 10, backgroundColor: "transparent" }}>
              <Text style={styles.badgeTitle}>Featured Drop</Text>
              <Text style={styles.badgeSubtitle}>Aurora Dominion</Text>
            </View>
          </RNView>
        </View>

        <LinearGradient
          colors={["rgba(255,255,255,0.08)", "rgba(62,47,127,0.3)"]}
          style={styles.featuredDrop}
        >
          <View style={styles.featuredLabel}>
            <Sparkles size={16} color="#fff" />
            <Text style={styles.featuredLabelText}>Live Auction</Text>
          </View>
          <Text style={styles.featuredTitle}>
            Aurora Dominion — Genesis Wave
          </Text>
          <Text style={styles.featuredDescription}>
            A 1/1 generative sculpture reacting to Solana validator pulses. Ends
            in 02h 18m.
          </Text>

          <View style={styles.featuredMetaRow}>
            <RNView
              style={[styles.featuredMetaCard, styles.featuredMetaSpacing]}
            >
              <Text style={styles.metaLabel}>Current Bid</Text>
              <Text style={styles.metaValue}>18.6 SOL</Text>
            </RNView>
            <RNView style={styles.featuredMetaCard}>
              <Text style={styles.metaLabel}>Top Collector</Text>
              <Text style={styles.metaValue}>@lumenlabs</Text>
            </RNView>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.heroCta,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.heroCtaText}>Place a bid</Text>
            <RNView style={styles.heroCtaIcon}>
              <ArrowUpRight size={18} color="#121212" />
            </RNView>
          </Pressable>
        </LinearGradient>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
          style={{ marginTop: 22 }}
        >
          {categories.map((cat) => {
            const isActive = selected === cat.key;
            return (
              <Pressable
                key={cat.key}
                onPress={() => setSelected(cat.key)}
                style={({ pressed }) => [
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}
              >
                <RNView
                  style={[
                    styles.categoryIcon,
                    isActive && styles.categoryIconActive,
                  ]}
                >
                  {cat.icon}
                </RNView>
                <Text
                  style={[
                    styles.categoryLabel,
                    isActive && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.statsRow}>
          {stats.map((item, idx) => (
            <RNView
              key={item.label}
              style={[
                styles.statCard,
                idx !== stats.length - 1 && { marginRight: 12 },
              ]}
            >
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </RNView>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Collections</Text>
          <Pressable
            style={({ pressed }) => [
              styles.sectionAction,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.sectionActionText}>View all</Text>
          </Pressable>
        </View>

        <FlatList
          horizontal
          data={filteredCollections}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionList}
          ListEmptyComponent={() => (
            <RNView style={styles.emptyCollectionCard}>
              <Star size={18} color={Colors.dark.accentPink} />
              <Text style={styles.emptyCollectionTitle}>
                No collections yet
              </Text>
              <Text style={styles.emptyCollectionText}>
                Switch categories or check back later for curated drops.
              </Text>
            </RNView>
          )}
          renderItem={({ item }) => (
            <LinearGradient
              colors={item.gradient}
              style={styles.collectionCard}
            >
              <RNView style={styles.collectionBadge}>
                <Flame size={14} color={Colors.dark.accentGold} />
                <Text style={styles.collectionBadgeText}>{item.spotlight}</Text>
              </RNView>
              <Text style={styles.collectionTitle}>{item.title}</Text>
              <Text style={styles.collectionPieces}>{item.pieces} pieces</Text>
            </LinearGradient>
          )}
        />

        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <Pressable
            style={({ pressed }) => [
              styles.sectionAction,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.sectionActionText}>Insights</Text>
          </Pressable>
        </View>

        <View style={{ backgroundColor: "transparent", marginTop: 8 }}>
          {filteredTrending.length === 0 ? (
            <RNView style={styles.emptyStateCard}>
              <Sparkles size={20} color={Colors.dark.accentGold} />
              <Text style={styles.emptyStateTitle}>Curations Loading</Text>
              <Text style={styles.emptyStateText}>
                We're lining up new drops for this category. Check back soon.
              </Text>
            </RNView>
          ) : (
            filteredTrending.map((item, index) => (
              <RNView
                key={item.id}
                style={[
                  styles.trendingCard,
                  index !== filteredTrending.length - 1 && { marginBottom: 12 },
                ]}
              >
                <RNView
                  style={[
                    styles.trendingAvatar,
                    { backgroundColor: item.accent },
                  ]}
                >
                  <Text style={styles.trendingAvatarText}>{index + 1}</Text>
                </RNView>
                <View style={{ flex: 1, backgroundColor: "transparent" }}>
                  <Text style={styles.trendingTitle}>{item.title}</Text>
                  <Text style={styles.trendingArtist}>{item.artist}</Text>
                  <View style={styles.trendingMetaRow}>
                    <Text
                      style={[styles.trendingMeta, styles.trendingMetaSpacing]}
                    >
                      Floor: {item.floor.toFixed(2)} SOL
                    </Text>
                    <Text
                      style={[
                        styles.trendingMeta,
                        item.change >= 0 ? styles.positive : styles.negative,
                        styles.trendingMetaSpacing,
                      ]}
                    >
                      {item.change >= 0 ? "+" : ""}
                      {item.change.toFixed(1)}%
                    </Text>
                    <Text style={styles.trendingMeta}>
                      {Math.round(item.volume)} vol
                    </Text>
                  </View>
                </View>
                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.trendingAction,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={styles.trendingActionText}>Bid</Text>
                </Pressable>
              </RNView>
            ))
          )}
        </View>
      </ScrollView>
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  decor: { ...StyleSheet.absoluteFillObject },
  scrollContent: { paddingBottom: 140, paddingTop: 16 },
  heroHeader: { backgroundColor: "transparent", marginBottom: 22 },
  heroEyebrow: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: Colors.dark.muted,
  },
  heroTitle: { fontSize: 30, fontWeight: "800", marginTop: 4 },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.dark.muted,
    marginTop: 10,
    lineHeight: 20,
    maxWidth: 300,
  },
  heroBadge: {
    marginTop: 18,
    alignSelf: "flex-start",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(18,18,18,0.45)",
  },
  badgeTitle: { fontSize: 12, color: Colors.dark.muted, letterSpacing: 0.4 },
  badgeSubtitle: { fontSize: 15, fontWeight: "700", marginTop: 2 },
  featuredDrop: {
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  featuredLabel: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 18,
  },
  featuredLabelText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  featuredTitle: { fontSize: 22, fontWeight: "800", lineHeight: 28 },
  featuredDescription: {
    fontSize: 13,
    color: Colors.dark.muted,
    marginTop: 8,
    lineHeight: 19,
  },
  featuredMetaRow: { flexDirection: "row", marginTop: 18, marginBottom: 20 },
  featuredMetaCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  featuredMetaSpacing: { marginRight: 12 },
  metaLabel: {
    fontSize: 11,
    letterSpacing: 0.4,
    color: Colors.dark.muted,
    textTransform: "uppercase",
  },
  metaValue: { fontSize: 16, fontWeight: "700", marginTop: 6 },
  heroCta: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: Colors.dark.text,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  heroCtaIcon: { marginLeft: 8, backgroundColor: "transparent" },
  heroCtaText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.dark.background,
  },
  categoryRow: { paddingRight: 12 },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  categoryChipActive: {
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    marginRight: 10,
  },
  categoryIconActive: { backgroundColor: "rgba(0,0,0,0.25)" },
  categoryLabel: { fontSize: 13, fontWeight: "600", color: Colors.dark.muted },
  categoryLabelActive: { color: "#fff" },
  statsRow: {
    flexDirection: "row",
    marginTop: 26,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  statValue: { fontSize: 16, fontWeight: "700" },
  statLabel: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.dark.muted,
    letterSpacing: 0.3,
  },
  sectionHeader: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 20, fontWeight: "700" },
  sectionAction: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  sectionActionText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
    color: Colors.dark.muted,
  },
  collectionList: { paddingVertical: 12, paddingRight: 12 },
  collectionCard: {
    width: 220,
    borderRadius: 18,
    padding: 18,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  collectionBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(18,18,18,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  collectionBadgeText: {
    marginLeft: 6,
    fontSize: 11,
    color: "#fff",
    letterSpacing: 0.4,
  },
  collectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 24 },
  collectionPieces: { marginTop: 6, fontSize: 12, color: Colors.dark.muted },
  emptyCollectionCard: {
    width: 220,
    borderRadius: 18,
    padding: 18,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
  },
  emptyCollectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 12 },
  emptyCollectionText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.dark.muted,
    textAlign: "center",
    lineHeight: 18,
  },
  trendingCard: {
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  trendingAvatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  trendingAvatarText: { fontSize: 18, fontWeight: "800", color: "#fff" },
  trendingTitle: { fontSize: 16, fontWeight: "700" },
  trendingArtist: { fontSize: 12, color: Colors.dark.muted, marginTop: 4 },
  trendingMetaRow: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
  },
  trendingMetaSpacing: { marginRight: 12 },
  trendingMeta: { fontSize: 12, color: Colors.dark.muted },
  positive: { color: Colors.dark.accentAqua },
  negative: { color: Colors.dark.accentPink },
  trendingAction: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  trendingActionText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  emptyStateCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  emptyStateTitle: { fontSize: 17, fontWeight: "700", marginTop: 12 },
  emptyStateText: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.dark.muted,
    textAlign: "center",
    lineHeight: 19,
  },
});
