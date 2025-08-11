import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { IconSymbol } from './IconSymbol';
import { Button } from './Button';
import { useColorScheme } from '@/hooks/useColorScheme';

interface AssistantBubbleProps {
  id: string;
  timestamp: string;
  headline: string;
  subtitle?: string;
  actions: string[];
  rationale: string;
  onActionPress: (action: string) => void;
}

export function AssistantBubble({
  timestamp,
  headline,
  subtitle,
  actions,
  rationale,
  onActionPress,
}: AssistantBubbleProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
  const [showRationale, setShowRationale] = useState(false);
  
  const rationaleHeight = useSharedValue(0);
  
  const rationaleStyle = useAnimatedStyle(() => ({
    height: rationaleHeight.value,
    opacity: showRationale ? 1 : 0,
  }));

  const toggleRationale = () => {
    setShowRationale(!showRationale);
    rationaleHeight.value = withSpring(showRationale ? 0 : 60, {
      damping: 15,
      stiffness: 150,
    });
  };

  return (
    <Animated.View 
      entering={FadeInUp.duration(55).springify().damping(15).stiffness(150)}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      {/* Timestamp */}
      <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
        {timestamp}
      </Text>
      
      {/* Headline */}
      <Text style={[styles.headline, { color: colors.text }]}>
        {headline}
      </Text>
      
      {/* Subtitle */}
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      
      {/* Actions */}
      <View style={styles.buttonGroup}>
        {actions.slice(0, 3).map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onPress={() => onActionPress(action)}
            style={[
              styles.actionButton,
              { 
                backgroundColor: colors.accentLight,
                borderColor: colors.accent + '20',
              }
            ] as any}
            textStyle={{ color: colors.accent }}
          >
            {action}
          </Button>
        ))}
      </View>
      
      {/* Rationale Toggle */}
      <TouchableOpacity 
        style={styles.rationaleToggle}
        onPress={toggleRationale}
        activeOpacity={0.7}
      >
        <Text style={[styles.rationaleToggleText, { color: colors.textTertiary }]}>
          Why am I seeing this?
        </Text>
        <IconSymbol 
          name="chevron.right" 
          size={12} 
          color={colors.textTertiary}
          style={{
            transform: [{ rotate: showRationale ? '90deg' : '0deg' }]
          }}
        />
      </TouchableOpacity>
      
      {/* Collapsible Rationale */}
      <Animated.View style={[styles.rationale, rationaleStyle]}>
        <Text style={[styles.rationaleText, { color: colors.textTertiary }]}>
          {rationale}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'SF Pro Display',
    fontWeight: '400',
    marginBottom: 4,
  },
  headline: {
    fontSize: 18,
    fontFamily: 'SF Pro Display',
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'SF Pro Display',
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    borderWidth: 1,
  },
  rationaleToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rationaleToggleText: {
    fontSize: 12,
    fontFamily: 'SF Pro Display',
    fontWeight: '400',
  },
  rationale: {
    overflow: 'hidden',
    paddingTop: 8,
  },
  rationaleText: {
    fontSize: 12,
    fontFamily: 'SF Pro Display',
    fontWeight: '400',
    lineHeight: 16,
  },
});

// Neutral color system - Perplexity grade
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
    background: '#000000',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    border: '#374151',
    accent: '#2062FF',
    accentLight: 'rgba(32, 98, 255, 0.1)',
    accentMedium: 'rgba(32, 98, 255, 0.2)',
  },
};