import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'solid' | 'outline';
};

export default function PrimaryButton({ title, onPress, loading, disabled, style, textStyle, variant='solid' }: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
  variant === 'outline' ? styles.outline : styles.solid,
        pressed && { opacity: 0.85 },
        isDisabled && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
  <ActivityIndicator color={variant==='outline' ? Colors.dark.text : '#000'} />
      ) : (
  <Text style={[styles.text, variant==='outline' && { color: Colors.dark.text }, variant==='solid' && { color: '#000' }, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  solid: { backgroundColor: Colors.dark.tint },
  outline: { borderWidth: 1, borderColor: Colors.dark.border, backgroundColor: 'transparent' },
  text: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
