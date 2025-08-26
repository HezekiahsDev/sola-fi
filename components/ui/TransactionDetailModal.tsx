import React from 'react';
import { Modal, StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';

type Transaction = {
  id: string;
  type: 'sent' | 'received';
  title: string;
  date: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
};

type Props = {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
};

export default function TransactionDetailModal({ visible, transaction, onClose }: Props) {
  if (!transaction) {
    return null;
  }

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'Completed':
        return '#4ade80'; // green-400
      case 'Pending':
        return '#facc15'; // yellow-400
      case 'Failed':
        return '#f87171'; // red-400
      default:
        return Colors.dark.muted;
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <BlurView intensity={20} tint="dark" style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.title}>Transaction Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Reference ID</Text>
            <Text style={styles.value}>{transaction.id}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Type</Text>
            <Text style={[styles.value, { textTransform: 'capitalize' }]}>{transaction.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{transaction.title}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{transaction.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>{transaction.amount}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.value, { color: getStatusColor(transaction.status) }]}>{transaction.status}</Text>
          </View>

          <PrimaryButton title="Close" onPress={onClose} style={{ marginTop: 20 }} />
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: 'rgba(18,18,18,0.9)',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'transparent',
  },
  label: {
    color: Colors.dark.muted,
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
