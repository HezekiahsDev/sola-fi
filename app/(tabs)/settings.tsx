import React from 'react';
import { StyleSheet, Switch, View as RNView } from 'react-native';
import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import GlowOrb from '@/components/ui/GlowOrb';

export default function SettingsScreen() {
  const [enabled, setEnabled] = React.useState(true);
  const [notifications, setNotifications] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true); // local toggle placeholder
  return (
    <AnimatedGradient style={styles.container}>
      <RNView style={styles.decor} pointerEvents="none">
        <GlowOrb size={240} color="rgba(47,149,220,0.30)" style={{ top: -120, left: -80 }} />
        <GlowOrb size={300} color="rgba(14,165,233,0.22)" style={{ bottom: -160, right: -120 }} />
      </RNView>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Biometric Unlock</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
      <Text style={styles.version}>App v1.0.0</Text>
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.dark.surface, padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: Colors.dark.border },
  label: { fontSize: 16, fontWeight: '500' },
  version: { marginTop: 40, textAlign: 'center', color: Colors.dark.muted },
  decor: { ...StyleSheet.absoluteFillObject },
});
