import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface StatusIndicatorProps {
  isConnected: boolean;
  connectedText?: string;
  disconnectedText?: string;
  size?: 'small' | 'medium' | 'large';
  textColor?: string;
}

export function StatusIndicator({ 
  isConnected, 
  connectedText = 'Connected',
  disconnectedText = 'Offline',
  size = 'medium',
  textColor
}: StatusIndicatorProps) {
  const colorScheme = useColorScheme();
  
  const sizeStyles = {
    small: { dot: 6, text: 12 },
    medium: { dot: 8, text: 14 },
    large: { dot: 10, text: 16 }
  };

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.dot, 
          { 
            width: sizeStyles[size].dot,
            height: sizeStyles[size].dot,
            borderRadius: sizeStyles[size].dot / 2,
            backgroundColor: isConnected 
              ? Colors[colorScheme ?? 'light'].success 
              : Colors[colorScheme ?? 'light'].error 
          }
        ]} 
      />
      <Text 
        style={[
          styles.text, 
          { 
            fontSize: sizeStyles[size].text,
            color: textColor || 'rgba(255, 255, 255, 0.9)'
          }
        ]}
      >
        {isConnected ? connectedText : disconnectedText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    marginRight: 8,
  },
  text: {
    fontWeight: '600',
  },
});