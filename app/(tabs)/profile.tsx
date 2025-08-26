import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/components/auth/AuthProvider';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import GlowOrb from '@/components/ui/GlowOrb';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { User, Shield, Bell, HelpCircle, ChevronRight } from 'lucide-react-native';
import ConfirmModal from '@/components/ui/ConfirmModal';

const MenuItem = ({ label, icon, onPress }: { label: string, icon: React.ReactNode, onPress?: () => void }) => (
  <Pressable style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.7 }]} onPress={onPress}>
    <View style={styles.menuItemContent}>
      {icon}
      <Text style={styles.menuItemText}>{label}</Text>
    </View>
    <ChevronRight color="#A0A0B2" size={20} />
  </Pressable>
);

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      router.replace('/auth/login');
    } finally {
      setLoading(false);
      setConfirmVisible(false);
    }
  };

  const openLogoutConfirm = () => setConfirmVisible(true);
  const closeLogoutConfirm = () => setConfirmVisible(false);

  return (
    <AnimatedGradient style={styles.container}>
      <GlowOrb size={300} color="rgba(59, 130, 246, 0.2)" style={{ top: -100, left: -100 }} />
      <GlowOrb size={260} color="rgba(147, 51, 234, 0.25)" style={{ bottom: -120, right: -60 }} />
      
      <View style={styles.header}>
        <View style={styles.avatar}>
          {user?.email && <Text style={styles.avatarText}>{user.email[0].toUpperCase()}</Text>}
        </View>
        {user?.email && <Text style={styles.email}>{user.email}</Text>}
      </View>

      <View style={styles.menuContainer}>
        <MenuItem label="Edit Profile" icon={<User color="#A0A0B2" size={20} />} />
        <MenuItem label="Security" icon={<Shield color="#A0A0B2" size={20} />} />
        <MenuItem label="Notifications" icon={<Bell color="#A0A0B2" size={20} />} />
        <MenuItem label="Help & Support" icon={<HelpCircle color="#A0A0B2" size={20} />} />
      </View>

      <PrimaryButton title="Logout" onPress={openLogoutConfirm} variant="outline" style={{ marginTop: 32, width: '100%' }} />

      <ConfirmModal
        visible={confirmVisible}
        title="Are you sure?"
        message="You will be logged out and need to sign in again to access your account."
        loading={loading}
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onConfirm={handleLogout}
        onCancel={closeLogoutConfirm}
      />
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  email: {
    fontSize: 18,
    color: '#A0A0B2',
  },
  menuContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 16,
  },
});
