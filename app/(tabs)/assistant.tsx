import React, { useState, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { ChatBubble } from '@/components/ui/ChatBubble';
import { ChatZeroState } from '@/components/ui/ChatZeroState';
import { QueryBar } from '@/components/ui/QueryBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  isUser: boolean;
  isTyping?: boolean;
}

export default function AssistantScreen() {
  const colorScheme = useColorScheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flashListRef = useRef<any>(null);

  // Start with empty messages to show zero state
  // Remove sample data initialization

  const handleQuerySubmit = useCallback((text: string) => {
    if (!text.trim()) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // If this is the first message, add a welcome message first
    const isFirstMessage = messages.length === 0;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    };
    
    if (isFirstMessage) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        message: 'Hello! I\'m your AI assistant. I\'m here to help you with anything you need.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
      };
      setMessages([welcomeMessage, userMessage]);
    } else {
      setMessages(prev => [...prev, userMessage]);
    }
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that.",
        "I understand what you're looking for. Here's what I think...",
        "Interesting! Based on what you've shared, I'd suggest...",
        "Let me break that down for you step by step.",
        "That's something I can definitely help with. Here's my take...",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, assistantMessage]);
      
      // Scroll to bottom after new message
      setTimeout(() => {
        flashListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
    
    // Scroll to bottom after user message
    setTimeout(() => {
      flashListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleVoicePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Handle voice input
    console.log('Voice input activated');
  }, []);

  const handleSuggestionPress = useCallback((suggestion: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Handle suggestion selection - start a new conversation with the suggestion
    console.log('Suggestion selected:', suggestion);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: suggestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    };
    
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      message: 'Hello! I\'m your AI assistant. I\'m here to help you with anything you need.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: false,
    };
    
    setMessages([welcomeMessage, userMessage]);
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that.",
        "I understand what you're looking for. Here's what I think...",
        "Interesting! Based on what you've shared, I'd suggest...",
        "Let me break that down for you step by step.",
        "That's something I can definitely help with. Here's my take...",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, assistantMessage]);
    }, 1500 + Math.random() * 1000);
  }, [setMessages, setIsTyping]);

  const handleActionPress = useCallback((actionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Handle action button press
    console.log('Action pressed:', actionId);
    
    switch (actionId) {
      case 'recall':
        // Navigate to memory search or trigger recall functionality
        break;
      case 'bookmark':
        // Open bookmark/save functionality
        break;
      case 'summarize':
        // Trigger daily summary
        break;
    }
  }, []);

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => (
    <ChatBubble
      id={item.id}
      message={item.message}
      timestamp={item.timestamp}
      isUser={item.isUser}
      isTyping={item.isTyping}
    />
  ), []);

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  // Create typing indicator message when needed
  const messagesWithTyping = useMemo(() => {
    if (isTyping) {
      const typingMessage: ChatMessage = {
        id: 'typing',
        message: '',
        timestamp: '',
        isUser: false,
        isTyping: true,
      };
      return [...messages, typingMessage];
    }
    return messages;
  }, [messages, isTyping]);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={Colors[colorScheme ?? 'light'].background}
      />
      
      {/* Chat Header - Only show when there are messages */}
      {messagesWithTyping.length > 0 && (
        <View style={[styles.header, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            AI Assistant
          </Text>
          <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            Online
          </Text>
        </View>
      )}
      
      {/* Chat Messages or Zero State */}
      {messagesWithTyping.length === 0 ? (
        <ChatZeroState 
          onSuggestionPress={handleSuggestionPress} 
          onActionPress={handleActionPress}
        />
      ) : (
        <FlashList
          ref={flashListRef}
          data={messagesWithTyping}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      {/* Chat Input */}
      <QueryBar
        onSubmit={handleQuerySubmit}
        onVoicePress={handleVoicePress}
        placeholder="Chat with Kenesis Vision AI Assistant"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Account for status bar
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'SF Pro Display',
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'SF Pro Display',
    fontWeight: '400',
    marginTop: 2,
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 120, // Account for input bar
  },
});