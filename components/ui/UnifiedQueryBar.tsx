import React, { useState } from 'react';
import { 
  View, 
  Text,
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Animated as RNAnimated,
  I18nManager
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { IconSymbol } from './IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

interface UnifiedQueryBarProps {
  onSubmit: (text: string) => void;
  onVoicePress: () => void;
  onAddPress: () => void;
  onImagePress: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function UnifiedQueryBar({ 
  onSubmit, 
  onVoicePress, 
  onAddPress,
  onImagePress,
  onFocus,
  onBlur
}: UnifiedQueryBarProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const insets = useSafeAreaInsets();
  
  const focusScale = useSharedValue(1);
  const focusOpacity = useSharedValue(0.9);

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSubmit(inputText.trim());
    setInputText('');
    
    // Analytics
    console.log('Analytics: query_bar_submit');
  };

  const handleFocus = () => {
    setIsFocused(true);
    focusScale.value = withTiming(1.02, { duration: 200, easing: Easing.out(Easing.cubic) });
    focusOpacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) });
    onFocus?.();
    
    // Analytics
    console.log('Analytics: query_bar_open');
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusScale.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) });
    focusOpacity.value = withTiming(0.9, { duration: 200, easing: Easing.out(Easing.cubic) });
    onBlur?.();
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focusScale.value }],
    opacity: focusOpacity.value,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingBottom: 50 + insets.bottom + 16 }]}
    >
      <Animated.View style={[styles.queryBar, animatedStyle]}>
        <View style={[
          styles.inputContainer, 
          { 
            backgroundColor: colors.background,
            flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'
          }
        ]}>
          {/* Left side - Text input */}
          <View style={styles.textInputContainer}>
            {!isFocused && !inputText && (
              <Text style={[styles.hintText, { color: colors.hintText }]}>
                Ask Kenesis…
              </Text>
            )}
            <TextInput
              style={[
                styles.textInput, 
                { color: colors.text },
                !isFocused && !inputText && styles.hiddenInput
              ]}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSubmit}
              onFocus={handleFocus}
              onBlur={handleBlur}
              returnKeyType="send"
              multiline={false}
              maxLength={500}
              accessibilityLabel="Text field, Ask Kenesis"
              accessibilityRole="search"
            />
          </View>

          {/* Right side - Action icons */}
          <View style={[
            styles.actionsContainer,
            { flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }
          ]}>
            <TouchableOpacity
              style={[styles.actionButton, isFocused && { backgroundColor: colors.accentLight }]}
              onPress={handleVoicePress}
              activeOpacity={0.7}
              accessibilityLabel="Voice input"
              accessibilityRole="button"
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
              accessibilityLabel="Add content"
              accessibilityRole="button"
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
              accessibilityLabel="Add image"
              accessibilityRole="button"
            >
              <IconSymbol 
                name="camera" 
                size={20} 
                color={isFocused ? colors.accent : colors.iconDefault} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: '4%', // 92% width = 4% padding on each side
    paddingTop: 16,
  },
  queryBar: {
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  textInputContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  hintText: {
    fontSize: 15,
    fontFamily: 'Inter',
    fontWeight: '400',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    textAlignVertical: 'center',
  },
  textInput: {
    fontSize: 15,
    fontFamily: 'Inter',
    fontWeight: '400',
    paddingVertical: 0,
    margin: 0,
    minHeight: 20,
  },
  hiddenInput: {
    opacity: 0,
  },
  actionsContainer: {
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
    background: 'rgba(26, 26, 26, 0.9)', // Kenesis off-black 90% opacity
    text: '#FFFFFF',
    hintText: 'rgba(255, 255, 255, 0.5)', // neutral-50 equivalent
    iconDefault: 'rgba(255, 255, 255, 0.7)',
    accent: '#2062FF',
    accentLight: 'rgba(32, 98, 255, 0.2)',
  },
  dark: {
    background: 'rgba(26, 26, 26, 0.9)', // Kenesis off-black 90% opacity
    text: '#FFFFFF',
    hintText: 'rgba(255, 255, 255, 0.5)', // neutral-50 equivalent
    iconDefault: 'rgba(255, 255, 255, 0.7)',
    accent: '#2062FF',
    accentLight: 'rgba(32, 98, 255, 0.2)',
  },
};