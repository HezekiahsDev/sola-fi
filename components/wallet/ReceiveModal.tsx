import React from 'react';
import { Modal, TouchableOpacity, View as RNView, Text } from 'react-native';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import Colors from '@/constants/Colors';
import QRCode from 'react-native-qrcode-svg';

export default function ReceiveModal({ visible, onClose, publicKey, onCopy }: { visible: boolean; onClose: () => void; publicKey?: string | null; onCopy?: () => void }) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <AnimatedGradient style={styles.overlay}>
        <RNView style={styles.centerContainer}>
          <RNView style={styles.panel}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            {publicKey ? (
              <RNView style={styles.qrContainer}>
                <QRCode value={publicKey} size={180} />
                <Text style={styles.addressText} numberOfLines={2} ellipsizeMode="middle">{publicKey}</Text>
                <TouchableOpacity onPress={onCopy} style={styles.copyButton}>
                  <Text style={styles.copyButtonText}>Copy address</Text>
                </TouchableOpacity>
              </RNView>
            ) : (
              <Text style={{ color: Colors.dark.muted }}>No wallet address available</Text>
            )}
          </RNView>
        </RNView>
      </AnimatedGradient>
    </Modal>
  );
}

const styles = {
  overlay: { flex: 1, padding: 28, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)' } as any,
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' } as any,
  panel: { width: '88%', maxHeight: '60%', backgroundColor: 'rgba(255,255,255,0.04)', padding: 24, borderRadius: 16, alignItems: 'center' } as any,
  closeButton: { position: 'absolute', right: 12, top: 10 } as any,
  closeText: { color: '#fff', fontWeight: 700 } as any,
  qrContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 12 } as any,
  addressText: { color: Colors.dark.muted, marginTop: 14, textAlign: 'center', paddingHorizontal: 12 } as any,
  copyButton: { marginTop: 14, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 } as any,
  copyButtonText: { color: Colors.dark.tint, fontWeight: 700 } as any,
};
