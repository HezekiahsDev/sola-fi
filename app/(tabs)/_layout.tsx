import React from "react";
import { Tabs } from "expo-router";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const { width } = Dimensions.get("window");

function GlassTabBar({ state, descriptors, navigation }: any) {
  const activeTint = "#a855f7"; // neon purple accent
  const tabWidth = width / state.routes.length;
  const indicatorWidth = tabWidth - 24;
  const translateX = React.useRef(
    new Animated.Value(state.index * tabWidth)
  ).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: state.index * tabWidth,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth, translateX]);

  return (
    <View style={styles.barContainer}>
      {/* Active indicator pill */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.activeIndicator,
          {
            width: indicatorWidth,
            transform: [{ translateX }],
          },
        ]}
      />

      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;

        const iconMap: Record<string, keyof typeof Feather.glyphMap> = {
          index: "credit-card",
          pay: "dollar-sign",
          transactions: "activity",
          nft: "image",
          profile: "user",
        };
        const iconName = iconMap[route.name] || "circle";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <Feather
              name={iconName}
              size={24}
              color={isFocused ? activeTint : Colors.dark.muted}
              style={{ marginBottom: 2 }}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? activeTint : Colors.dark.muted },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Wallet" }} />
      <Tabs.Screen name="pay" options={{ title: "Pay" }} />
      <Tabs.Screen name="transactions" options={{ title: "Txs" }} />
      <Tabs.Screen name="nft" options={{ title: "NFTs" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(20,20,24,0.85)",
    overflow: "hidden",
  },
  activeIndicator: {
    position: "absolute",
    top: 6,
    left: 12,
    height: 44,
    borderRadius: 14,
    // backgroundColor: "rgba(168, 85, 247, 0.15)",
    // borderWidth: 1,
    // borderColor: "rgba(168, 85, 247, 0.4)",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
