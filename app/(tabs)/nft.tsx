import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";

type RawNft = {
  name: string;
  image: string;
  mintAddress: string;
  signature: string;
  price?: number;
};

type NftCard = RawNft & { price: number };

const defaultPrices = [18.6, 9.4, 7.25, 6.8, 5.5];
const fallbackNfts = require("../../nfts.json") as RawNft[];

const withPrices = (items: RawNft[]): NftCard[] =>
  items.map((item, index) => ({
    ...item,
    price: item.price ?? defaultPrices[index % defaultPrices.length],
  }));

type NftRow = RawNft & {
  id?: string;
  status?: string;
};

const truncateAddress = (address: string) =>
  `${address.slice(0, 4)}…${address.slice(-4)}`;

export default function NFTScreen() {
  const [nfts, setNfts] = useState<NftCard[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNfts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("nfts").select("*");

    if (error) {
      console.error("Error fetching NFTs:", error);
    } else {
      setNfts(
        data.map((item: RawNft, index: number) => ({
          ...item,
          price: item.price ?? defaultPrices[index % defaultPrices.length],
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNfts();
  }, [fetchNfts]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={styles.header}>
        <Text style={styles.title}>Collections</Text>
        <Text style={styles.subtitle}>Browse the latest SolaFi drops</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.dark.accentAqua}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={nfts}
          keyExtractor={(item) => item.mintAddress}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.cardMetaRow}>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardPrice}>
                      {item.price.toFixed(2)} SOL
                    </Text>
                    <Text style={styles.cardMint}>
                      {truncateAddress(item.mintAddress)}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {}}
                    style={({ pressed }) => [
                      styles.buyButton,
                      pressed && styles.buyButtonPressed,
                    ]}
                  >
                    <Text style={styles.buyButtonText}>Buy</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No NFTs yet</Text>
              <Text style={styles.emptySubtitle}>
                Once you mint assets, they will appear here.
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    paddingTop: 72,
    paddingBottom: 12,
    paddingHorizontal: 24,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.dark.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.dark.muted,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  columnWrapper: {
    gap: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.dark.border,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: Colors.dark.surface,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: "transparent",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.dark.accentAqua,
  },
  cardMint: {
    fontSize: 12,
    color: Colors.dark.muted,
  },
  cardMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardMeta: {
    flex: 1,
    gap: 4,
  },
  buyButton: {
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.dark.primaryDeep,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.dark.primaryTint,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButtonPressed: {
    backgroundColor: Colors.dark.primaryTint,
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  emptyState: {
    paddingVertical: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.dark.muted,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
