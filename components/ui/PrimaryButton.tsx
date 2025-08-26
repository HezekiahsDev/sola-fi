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
  variant?: 'solid' | 'outline' | 'aqua' | 'pink' | 'gold';
  children?: React.ReactNode;
};

export default function PrimaryButton({ title, onPress, loading, disabled, style, textStyle, variant='solid', children }: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'outline' && styles.outline,
        variant === 'solid' && styles.solid,
        variant === 'aqua' && styles.aqua,
        variant === 'pink' && styles.pink,
        variant === 'gold' && styles.gold,
        pressed && { opacity: 0.85 },
        isDisabled && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant==='outline' ? Colors.dark.text : '#FFFFFF'} />
      ) : (
        children ? (
          children
        ) : (
          <Text style={[
            styles.text,
            variant === 'outline' && { color: Colors.dark.text },
            (variant === 'solid' || variant === 'aqua' || variant === 'pink' || variant === 'gold') && { color: '#FFFFFF' },
            textStyle,
          ]}>{title}</Text>
        )
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  solid: { backgroundColor: Colors.dark.tint },
  outline: { borderWidth: 1, borderColor: Colors.dark.border, backgroundColor: 'transparent' },
  aqua: { backgroundColor: Colors.dark.accentAqua },
  pink: { backgroundColor: Colors.dark.accentPink },
  gold: { backgroundColor: Colors.dark.accentGold },
  text: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
