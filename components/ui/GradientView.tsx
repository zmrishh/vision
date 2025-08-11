import React from 'react';
import { ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface GradientViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
  gradientType?: 'primary' | 'secondary' | 'accent';
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export function GradientView({
  children,
  style,
  colors,
  gradientType = 'primary',
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}: GradientViewProps) {
  const colorScheme = useColorScheme();
  
  const gradientColors = colors || Colors[colorScheme ?? 'light'].gradient[gradientType];

  return (
    <LinearGradient
      colors={gradientColors as [string, string, ...string[]]}
      start={start}
      end={end}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}