import React from 'react';
import { Modal, StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import PrimaryButton from '@/components/ui/PrimaryButton';
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
  // Always render the Modal when visible is true so the backdrop and animations
  // are visible even if transaction data is not yet available.

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
      {/* Use the same overlay pattern as ConfirmModal to ensure consistent touch handling */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.card}>
          <Text style={styles.title}>Transaction Details</Text>

          {transaction ? (
            <>
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
            </>
          ) : (
            <Text style={[styles.message, { textAlign: 'center', marginVertical: 16 }]}>Loading transaction details…</Text>
          )}

          <PrimaryButton title="Close" onPress={onClose} style={{ marginTop: 20 }} />
        </View>
      </Pressable>
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
  message: {
    color: Colors.dark.muted,
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
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
