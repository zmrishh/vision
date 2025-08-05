import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { IconSymbol } from './IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

interface QueryBarProps {
  onSubmit: (text: string) => void;
  onVoicePress: () => void;
  placeholder?: string;
}

export function QueryBar({ 
  onSubmit, 
  onVoicePress, 
  placeholder = "Type a message..." 
}: QueryBarProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
  const [inputText, setInputText] = useState('');
  const insets = useSafeAreaInsets();

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingBottom: 50 + insets.bottom + 16 }]}
    >
      <BlurView
        intensity={80}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={[
          styles.blurContainer,
          { 
            backgroundColor: colorScheme === 'dark' 
              ? 'rgba(26, 26, 26, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            borderColor: colors.border,
          }
        ]}
      >
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSubmit}
            returnKeyType="send"
            multiline
            maxLength={500}
          />
          
          {inputText.trim() ? (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.accent }]}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <IconSymbol name="arrow.up" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { 
                  backgroundColor: colors.accentLight,
                  borderWidth: 1,
                  borderColor: colors.accent + '30',
                }
              ]}
              onPress={handleVoicePress}
              activeOpacity={0.8}
            >
              <IconSymbol name="mic.circle" size={18} color={colors.accent} />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  blurContainer: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'SF Pro Display',
    fontWeight: '400',
    maxHeight: 120,
    paddingVertical: 0,
    lineHeight: 20,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Claude-style color system
const COLORS = {
  light: {
    background: '#FAFAF7',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    accent: '#2062FF',
    accentLight: 'rgba(32, 98, 255, 0.1)',
    accentMedium: 'rgba(32, 98, 255, 0.2)',
  },
  dark: {
    background: '#1A1A1A',
    surface: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    border: '#404040',
    accent: '#8B5CF6',
    accentLight: 'rgba(139, 92, 246, 0.1)',
    accentMedium: 'rgba(139, 92, 246, 0.2)',
  },
};