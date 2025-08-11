import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Keyboard
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

interface SimpleQueryBarProps {
  onSubmit: (text: string) => void;
  onVoicePress: () => void;
  onAddPress: () => void;
  onImagePress: () => void;
  onFocusChange?: (isFocused: boolean) => void;
}

export function SimpleQueryBar({ 
  onSubmit, 
  onVoicePress, 
  onAddPress,
  onImagePress,
  onFocusChange
}: SimpleQueryBarProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocusChange?.(false);
  };

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSubmit(inputText.trim());
    setInputText('');
  };

  const handleVoicePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onVoicePress();
  };

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddPress();
  };

  const handleImagePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onImagePress();
  };

  return (
    <View
      style={[
        styles.container, 
        { 
          bottom: keyboardHeight > 0 
            ? keyboardHeight + 8 // Sit ABOVE keyboard with padding
            : 50 + insets.bottom + 16 // Default position above navbar
        }
      ]}
    >
      <View style={[
        styles.queryBar, 
        { 
          backgroundColor: colors.background
        }
      ]}>
        {/* Text Input Section */}
        <View style={styles.textSection}>
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSubmit}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType="send"
            placeholder="Ask Kenesis…"
            placeholderTextColor={colors.hintText}
            accessibilityLabel="Text field, Ask Kenesis"
            selectionColor={colors.accent}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.actionButton, isFocused && { backgroundColor: colors.accentLight }]}
            onPress={handleVoicePress}
            activeOpacity={0.7}
          >
            <IconSymbol 
              name="mic.circle" 
              size={20} 
              color={isFocused ? colors.accent : colors.iconDefault} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isFocused && { backgroundColor: colors.accentLight }]}
            onPress={handleAddPress}
            activeOpacity={0.7}
          >
            <IconSymbol 
              name="plus" 
              size={20} 
              color={isFocused ? colors.accent : colors.iconDefault} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isFocused && { backgroundColor: colors.accentLight }]}
            onPress={handleImagePress}
            activeOpacity={0.7}
          >
            <IconSymbol 
              name="camera" 
              size={20} 
              color={isFocused ? colors.accent : colors.iconDefault} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16, // 92% width approximation
    zIndex: 1000, // Ensure it's above other elements
  },
  queryBar: {
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 15,
    fontFamily: 'Inter',
    fontWeight: '400',
    paddingVertical: 0,
    margin: 0,
    minHeight: 20,
    flex: 1,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const COLORS = {
  light: {
    background: 'rgba(26, 26, 26, 0.95)', // Slightly more opaque for better text visibility
    text: '#FFFFFF',
    hintText: 'rgba(255, 255, 255, 0.6)', // Slightly more visible
    iconDefault: 'rgba(255, 255, 255, 0.8)',
    accent: '#2062FF',
    accentLight: 'rgba(32, 98, 255, 0.2)',
  },
  dark: {
    background: 'rgba(26, 26, 26, 0.95)', // Slightly more opaque for better text visibility
    text: '#FFFFFF',
    hintText: 'rgba(255, 255, 255, 0.6)', // Slightly more visible
    iconDefault: 'rgba(255, 255, 255, 0.8)',
    accent: '#2062FF',
    accentLight: 'rgba(32, 98, 255, 0.2)',
  },
};