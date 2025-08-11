import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ChatBubble } from './ChatBubble';
import { SimpleQueryBar } from './SimpleQueryBar';

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  isUser: boolean;
  isTyping?: boolean;
}

interface UnifiedChatInterfaceProps {
  messages: ChatMessage[];
  onQuerySubmit: (text: string) => void;
  onVoicePress: () => void;
  onAddPress: () => void;
  onImagePress: () => void;
}

export function UnifiedChatInterface({
  messages,
  onQuerySubmit,
  onVoicePress,
  onAddPress,
  onImagePress
}: UnifiedChatInterfaceProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? COLORS.dark : COLORS.light;

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <ChatBubble
      id={item.id}
      message={item.message}
      timestamp={item.timestamp}
      isUser={item.isUser}
      isTyping={item.isTyping}
    />
  );

  const keyExtractor = (item: ChatMessage) => item.id;

  return (
    <View style={styles.container}>
      {/* Header with Logo and Profile - Same as zero state */}
      <Animated.View
        entering={FadeInUp.duration(600).springify().damping(15).stiffness(100)}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🧠</Text>
            <Text style={[styles.logoText, { color: colors.text }]}>Kenesis Vision</Text>
          </View>
        </View>

        <View style={[styles.profileButton, { backgroundColor: colors.surface }]}>
          <Text style={[styles.profileText, { color: colors.text }]}>A</Text>
        </View>
      </Animated.View>

      {/* Chat Messages */}
      <View style={styles.messagesContainer}>
        <FlashList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        />
      </View>

      {/* Simple Query Bar - Same positioning as zero state */}
      <SimpleQueryBar
        onSubmit={onQuerySubmit}
        onVoicePress={onVoicePress}
        onAddPress={onAddPress}
        onImagePress={onImagePress}
        onFocusChange={() => {}} // No suggestions to hide in chat mode
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'SF Pro Display',
    fontWeight: '600',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileText: {
    fontSize: 16,
    fontFamily: 'SF Pro Display',
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingBottom: 120, // Account for query bar
  },
});

// Same color system as zero state
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