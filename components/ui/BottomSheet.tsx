import React from 'react';
import { Modal, Animated, Dimensions, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: number; // optional max height in pixels
};

export default function BottomSheet({ visible, onClose, children, maxHeight }: BottomSheetProps) {
  const screenH = Dimensions.get('window').height;
  const translateY = React.useRef(new Animated.Value(screenH)).current;

  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : screenH,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible, screenH, translateY]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={[styles.container, { maxHeight: maxHeight ?? screenH * 0.6 }]}>{children}</View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  container: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
});
