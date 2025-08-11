import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { GradientView } from './GradientView';
import * as Haptics from 'expo-haptics';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: string;
  size?: number;
  gradientType?: 'primary' | 'secondary' | 'accent';
}

export function FloatingActionButton({ 
  onPress, 
  icon, 
  size = 56,
  gradientType = 'primary'
}: FloatingActionButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <GradientView
        gradientType={gradientType}
        style={[styles.gradient, { borderRadius: size / 2 }] as any}
      >
        <IconSymbol name={icon as any} size={size * 0.4} color="white" />
      </GradientView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});