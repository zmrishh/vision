import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';

interface SuggestionCardProps {
  title: string;
  category: string;
  onPress: () => void;
  index: number;
}

export function SuggestionCard({ title, category, onPress, index }: SuggestionCardProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(400).delay(index * 100).springify().damping(15).stiffness(150)}
    >
      <TouchableOpacity
        style={[
          styles.container,
          { 
            backgroundColor: colors.cardBackground,
            borderLeftColor: isPressed ? colors.accent : 'transparent',
          }
        ]}
        onPress={handlePress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Suggestion: ${title}, Category: ${category}`}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.category, { color: colors.textSecondary }]}>
          {category}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Inter',
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: '500',
    lineHeight: 18,
  },
});

const COLORS = {
  light: {
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    accent: '#2062FF',
  },
  dark: {
    cardBackground: 'rgba(38, 38, 38, 0.95)',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    accent: '#2062FF',
  },
};