import React, { createContext, useContext, useCallback, useRef, useState, useEffect } from 'react';
import { Animated, StyleSheet, Easing, View, Text, Pressable } from 'react-native';
import Colors from '@/constants/Colors';

interface ToastItem { id: string; message: string; type?: 'success' | 'error' | 'info'; duration?: number }
interface ToastContextValue { push: (msg: string, opts?: Partial<Omit<ToastItem,'id'|'message'>>) => void }

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if(!ctx) throw new Error('ToastProvider missing');
  return ctx;
};

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [queue, setQueue] = useState<ToastItem[]>([]);
  const remove = useCallback((id: string) => setQueue(q => q.filter(t => t.id !== id)), []);
  const push = useCallback((message: string, opts?: Partial<Omit<ToastItem,'id'|'message'>>) => {
    const id = Math.random().toString(36).slice(2);
    const item: ToastItem = { id, message, type: 'info', duration: 3500, ...opts };
    setQueue(q => [...q, item]);
    if(item.duration) setTimeout(() => remove(id), item.duration);
  }, [remove]);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <View pointerEvents="box-none" style={styles.host} accessible={false} importantForAccessibility="no-hide-descendants">
        {queue.map(t => <ToastBubble key={t.id} item={t} onClose={() => remove(t.id)} />)}
      </View>
    </ToastContext.Provider>
  );
};

const ToastBubble: React.FC<{ item: ToastItem; onClose: () => void }> = ({ item, onClose }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true, easing: Easing.out(Easing.cubic) }).start();
  }, [anim]);
  const bg = {
    success: 'rgba(61,220,151,0.18)',
    error: 'rgba(239,68,68,0.25)',
    info: 'rgba(108,99,255,0.25)',
  }[item.type || 'info'];
  const border = {
    success: 'rgba(61,220,151,0.35)',
    error: 'rgba(239,68,68,0.45)',
    info: 'rgba(108,99,255,0.40)',
  }[item.type || 'info'];
  return (
  <Animated.View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.toast,{ backgroundColor: bg, borderColor: border, transform:[{ translateY: anim.interpolate({ inputRange:[0,1], outputRange:[12,0] }) }, { scale: anim.interpolate({ inputRange:[0,1], outputRange:[0.95,1] }) }], opacity: anim }]}>
      <Text style={styles.msg}>{item.message}</Text>
      <Pressable onPress={onClose} hitSlop={8}><Text style={styles.close}>×</Text></Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  host: { position: 'absolute', left: 0, right: 0, top: 50, alignItems: 'center', gap: 8 },
  toast: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1, maxWidth: '88%' },
  msg: { color: Colors.dark.text, fontSize: 13, flex: 1 },
  close: { color: Colors.dark.muted, fontSize: 20, lineHeight: 16, paddingHorizontal: 6 },
});
