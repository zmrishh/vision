import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ChatBubbleProps {
  id: string;
  message: string;
  timestamp: string;
  isUser: boolean;
  isTyping?: boolean;
}

export function ChatBubble({
  message,
  timestamp,
  isUser,
  isTyping = false,
}: ChatBubbleProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
  
  // Typing animation
  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);

  useEffect(() => {
    if (isTyping) {
      dot1Opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1
      );
      
      setTimeout(() => {
        dot2Opacity.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0.3, { duration: 600 })
          ),
          -1
        );
      }, 200);
      
      setTimeout(() => {
        dot3Opacity.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0.3, { duration: 600 })
          ),
          -1
        );
      }, 400);
    }
  }, [isTyping, dot1Opacity, dot2Opacity, dot3Opacity]);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
  }));

  return (
    <Animated.View 
      entering={FadeInUp.duration(300).springify().damping(15).stiffness(150)}
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser 
            ? [styles.userBubble, { backgroundColor: colors.accent }]
            : [styles.assistantBubble, { backgroundColor: colors.surface }]
        ]}
      >
        {isTyping ? (
          <View style={styles.typingContainer}>
            <Animated.View style={[styles.typingDot, { backgroundColor: colors.textSecondary }, dot1Style]} />
            <Animated.View style={[styles.typingDot, { backgroundColor: colors.textSecondary }, dot2Style]} />
            <Animated.View style={[styles.typingDot, { backgroundColor: colors.textSecondary }, dot3Style]} />
          </View>
        ) : (
          <Text
            style={[
              styles.messageText,
              isUser 
                ? { color: '#FFFFFF' }
                : { color: colors.text }
            ]}
          >
            {message}
          </Text>
        )}
      </View>
      
      <Text 
        style={[
          styles.timestamp, 
          { color: colors.textTertiary },
          isUser ? styles.userTimestamp : styles.assistantTimestamp
        ]}
      >
        {timestamp}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'SF Pro Display',
    fontWeight: '400',
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'SF Pro Display',
    fontWeight: '400',
    marginTop: 4,
    marginHorizontal: 4,
  },
  userTimestamp: {
    textAlign: 'right',
  },
  assistantTimestamp: {
    textAlign: 'left',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
});

// Neutral color system
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