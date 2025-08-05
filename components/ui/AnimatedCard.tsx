import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  hapticFeedback?: boolean;
}

export function AnimatedCard({ 
  children, 
  style, 
  onPress, 
  hapticFeedback = true 
}: AnimatedCardProps) {
  const handlePress = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={[
        {
          transform: [{ scale: 1 }],
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.95}
      disabled={!onPress}
    >
      {children}
    </TouchableOpacity>
  );
}