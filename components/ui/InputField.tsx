import React, { forwardRef, useState, useCallback, useRef, useEffect, memo } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, Pressable, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';

export interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  secureToggle?: boolean; // if true show eye toggle
  containerStyle?: ViewStyle;
  error?: string | null;
  hint?: string;
}

const RawInputField = forwardRef<TextInput, InputFieldProps>(function InputField(
  { label, secureTextEntry, secureToggle, containerStyle, error, hint, ...props }, ref
) {
  const [focused, setFocused] = useState(false); // kept but lighter styling
  const [show, setShow] = useState(false);
  const isSecure = !!secureTextEntry && !show;

  const theme = Colors.dark; // current app defaults to dark theme for auth

  const onFocus = useCallback((e: any) => {
    setFocused(true);
    props.onFocus?.(e);
  }, [props]);
  const onBlur = useCallback((e: any) => {
    setFocused(false);
    props.onBlur?.(e);
  }, [props]);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, focused && styles.fieldFocused, !!error && styles.fieldError]}>
        <TextInput
          ref={ref}
          placeholderTextColor={theme.muted}
          {...props}
          secureTextEntry={isSecure}
          style={styles.input}
          onFocus={onFocus}
          onBlur={onBlur}
          // Prevent Android autoFill weird focus shifts
          importantForAutofill="no"
          autoCorrect={false}
        />
        {secureToggle && !!secureTextEntry && (
          <Pressable onPress={() => setShow(s => !s)} accessibilityRole="button" accessibilityLabel={show ? 'Hide password' : 'Show password'}>
            <Feather name={show ? 'eye-off' : 'eye'} size={18} color={theme.muted} />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
});

const InputField = memo(RawInputField);

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { color: Colors.dark.muted, fontSize: 12, marginBottom: 6, letterSpacing: 0.5 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    minHeight: 54,
  },
  fieldFocused: { borderColor: Colors.dark.tint },
  fieldError: { borderColor: '#EF4444' },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15, paddingVertical: 12, marginRight: 8 },
  error: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  hint: { color: Colors.dark.muted, fontSize: 12, marginTop: 4 },
});

export default InputField;
