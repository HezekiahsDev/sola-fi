import React, { useState } from 'react';
import { StyleSheet, Pressable, StatusBar, View as RNView, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import GlowOrb from '@/components/ui/GlowOrb';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native'; // Icons for sent/received
import TransactionDetailModal from '@/components/ui/TransactionDetailModal';

type Transaction = {
  id: string;
  type: 'sent' | 'received';
  title: string;
  date: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
};

export default function TransactionsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const transactions: Transaction[] = [
    { id: '1', type: 'sent', title: 'Sent to @john.sola', date: '2024-07-22', amount: '$50.00', status: 'Completed' },
    { id: '2', type: 'received', title: 'Received from @jane.sola', date: '2024-07-21', amount: '$120.00', status: 'Completed' },
    { id: '3', type: 'sent', title: 'Data Purchase', date: '2024-07-20', amount: '$10.00', status: 'Completed' },
    { id: '4', type: 'sent', title: 'Airtime Top-up', date: '2024-07-20', amount: '$5.00', status: 'Pending' },
    { id: '5', type: 'received', title: 'From @mom.sola', date: '2024-07-19', amount: '$200.00', status: 'Completed' },
    { id: '6', type: 'sent', title: 'Electricity Bill', date: '2024-07-18', amount: '$75.50', status: 'Failed' },
  ];

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
  };

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
    <AnimatedGradient style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <RNView style={styles.decor} pointerEvents="none">
        <GlowOrb size={260} color="rgba(47,149,220,0.35)" style={{ top: -140, right: -80 }} />
        <GlowOrb size={300} color="rgba(14,165,233,0.22)" style={{ bottom: -160, left: -100 }} />
      </RNView>

      <View style={styles.content}>
        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.helper}>A log of all your recent transactions.</Text>

        <ScrollView contentContainerStyle={styles.verticalList} showsVerticalScrollIndicator={false}>
          {transactions.map((tx) => (
            <BlurView key={tx.id} intensity={10} tint="dark" style={styles.glassWrapper}>
              <Pressable
                style={({ pressed }) => [styles.glassBtn, pressed && styles.glassBtnPressed]}
                onPress={() => handleTransactionPress(tx)}
                accessibilityLabel={`Transaction: ${tx.title}`}
              >
                <View style={[styles.iconWrapper, { backgroundColor: tx.type === 'sent' ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.1)' }]}>
                  {tx.type === 'sent' ? <ArrowUpRight color="#f87171" size={20} /> : <ArrowDownLeft color="#4ade80" size={20} />}
                </View>
                <View style={styles.txDetails}>
                  <Text style={styles.glassTitle}>{tx.title}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <View style={styles.txAmountStatus}>
                  <Text style={styles.txAmount}>{tx.amount}</Text>
                  <Text style={[styles.txStatus, { color: getStatusColor(tx.status) }]}>{tx.status}</Text>
                </View>
              </Pressable>
            </BlurView>
          ))}
        </ScrollView>
      </View>

      <TransactionDetailModal
        visible={modalVisible}
        transaction={selectedTransaction}
        onClose={handleCloseModal}
      />
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  // content now renders directly in the main container for a cleaner look
  content: { backgroundColor: 'transparent', marginTop: 36, paddingHorizontal: 6 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  helper: { fontSize: 13, color: Colors.dark.muted, lineHeight: 18, marginBottom: 14 },
  decor: { ...StyleSheet.absoluteFillObject },

  verticalList: { paddingVertical: 4 },
  glassWrapper: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  glassBtn: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.015)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    flexDirection: 'row',
  },
  glassBtnPressed: { transform: [{ scale: 0.997 }], opacity: 0.98 },
  iconWrapper: { 
    width: 36, 
    height: 36, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  txDetails: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  glassTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
  txDate: {
    fontSize: 12,
    color: Colors.dark.muted,
    marginTop: 2,
  },
  txAmountStatus: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  txStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
