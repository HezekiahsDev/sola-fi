import React, { useEffect, useRef } from 'react';
import { Modal, Animated, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import PrimaryButton from '@/components/ui/PrimaryButton';

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ConfirmModal({ visible, title = 'Are you sure?', message, confirmLabel = 'Yes', cancelLabel = 'Cancel', loading, onConfirm, onCancel }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const pulseLoopRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      // entrance
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 8, useNativeDriver: true }),
      ]).start();

      // start subtle pulse on title
      pulse.setValue(1);
      pulseLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.04, duration: 650, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
        ])
      );
      pulseLoopRef.current.start();
    } else {
      // exit
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.96, duration: 120, useNativeDriver: true }),
      ]).start();
      if (pulseLoopRef.current) {
        pulseLoopRef.current.stop();
        pulse.setValue(1);
      }
    }

    return () => {
      if (pulseLoopRef.current) pulseLoopRef.current.stop();
    };
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <Text style={styles.title}>{title}</Text>
          </Animated.View>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={onCancel} accessibilityRole="button">
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>
            <PrimaryButton title={confirmLabel} loading={!!loading} onPress={onConfirm} variant="pink" style={{ minWidth: 120 }} />
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: 'rgba(18,18,18,0.98)',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'left',
  },
  message: {
    color: '#A0A0B2',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancel: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginRight: 12,
  },
  cancelText: { color: '#fff', fontWeight: '600' },
});
