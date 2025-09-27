import { Stack, useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  StatusBar,
  View as RNView,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";
import { View, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import React from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AnimatedGradient from "@/components/ui/AnimatedGradient";
import GlowOrb from "@/components/ui/GlowOrb";

export default function LandingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const logoSize = Math.min(180, Math.max(100, Math.floor(width * 0.36)));
  const logoAnim = React.useRef(new Animated.Value(0)).current; // 0..1
  const contentAnim = React.useRef(new Animated.Value(0)).current; // 0..1
  const buttonsAnim = React.useRef(new Animated.Value(0)).current; // 0..1

  React.useEffect(() => {
    // sequence: logo pops, then content fades in, then buttons slide up
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(buttonsAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoAnim, contentAnim, buttonsAnim]);
  return (
    <AnimatedGradient style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <RNView style={styles.decorLayer} pointerEvents="none">
        <GlowOrb
          size={280}
          color="rgba(47,149,220,0.40)"
          style={{ top: -140, left: -80 }}
        />
        <GlowOrb
          size={320}
          color="rgba(14,165,233,0.28)"
          style={{ bottom: -160, right: -100 }}
        />
      </RNView>

      <Animated.View
        style={[
          styles.heroWrap,
          {
            opacity: contentAnim,
            transform: [
              {
                translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [14, 0],
                }),
              },
            ],
          } as any,
        ]}
      >
        <View darkColor="transparent" style={{ alignItems: "center" }}>
          <Animated.Image
            source={require("../assets/images/logo-white.png")}
            style={[
              styles.logo,
              {
                width: logoSize,
                height: logoSize,
                transform: [
                  {
                    scale: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
              } as any,
            ]}
          />
          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: contentAnim,
                transform: [
                  {
                    translateY: contentAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [8, 0],
                    }),
                  },
                ],
              } as any,
            ]}
          >
            Your decentralized wallet for a borderless future.
          </Animated.Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.actions,
          {
            opacity: buttonsAnim,
            transform: [
              {
                translateY: buttonsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                }),
              },
            ],
          } as any,
        ]}
      >
        <View darkColor="transparent">
          <PrimaryButton
            title="Get started"
            onPress={() => router.push("/auth/signup")}
          />
          <PrimaryButton
            style={styles.secondaryBtn}
            textStyle={{ color: Colors.dark.text }}
            variant="outline"
            title="Jump back in"
            onPress={() => router.push("/auth/login")}
          />
        </View>
      </Animated.View>
      <View style={styles.footerBlur}>
        <Text style={styles.disclaimer}>Secure. Private. Open.</Text>
      </View>
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, justifyContent: "space-between" },
  heroWrap: { marginTop: 90, alignItems: "center" },
  logo: { width: 140, height: 140, marginBottom: 8, resizeMode: "contain" },
  brand: {
    fontSize: 40,
    fontWeight: "700",
    color: Colors.dark.text,
    letterSpacing: 1,
  },
  tagline: {
    textAlign: "center",
    color: Colors.dark.muted,
    fontSize: 16,
    marginTop: 6,
    lineHeight: 22,
  },
  actions: { gap: 16, marginBottom: 48 },
  secondaryBtn: { marginTop: 8 },
  disclaimer: { textAlign: "center", color: Colors.dark.muted, fontSize: 12 },
  footerBlur: {
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 8,
    overflow: "hidden",
    backgroundColor: "rgba(17,17,17,0.4)",
  },
  decorLayer: { ...StyleSheet.absoluteFillObject },
});
