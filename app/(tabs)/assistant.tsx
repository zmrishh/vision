import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, StatusBar, Alert } from 'react-native';
import { ChatZeroState } from '@/components/ui/ChatZeroState';
import { UnifiedChatInterface } from '@/components/ui/UnifiedChatInterface';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

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
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  }, [messages.length]);

  const handleVoicePress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Request audio recording permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to use voice input.');
        return;
      }

      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      Alert.alert(
        'Voice Input',
        'Voice recording functionality would be implemented here. This would:\n\n• Start audio recording\n• Convert speech to text\n• Submit the transcribed text',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Simulate Voice Input', 
            onPress: () => {
              const simulatedVoiceInput = "How do I calibrate my Kenesis Vision glasses?";
              handleQuerySubmit(simulatedVoiceInput);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Voice input error:', error);
      Alert.alert('Error', 'Failed to initialize voice input.');
    }
  }, [handleQuerySubmit]);

  const handleAddPress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Alert.alert(
      'Add Content',
      'What would you like to add?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Document', 
          onPress: async () => {
            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
              });
              
              if (!result.canceled && result.assets[0]) {
                const file = result.assets[0];
                const message = `I've attached a document: ${file.name}`;
                handleQuerySubmit(message);
              }
            } catch (error) {
              console.error('Document picker error:', error);
              Alert.alert('Error', 'Failed to pick document.');
            }
          }
        },
        { 
          text: 'Text Note', 
          onPress: () => {
            Alert.prompt(
              'Add Text Note',
              'Enter your note:',
              (text) => {
                if (text && text.trim()) {
                  handleQuerySubmit(`Note: ${text.trim()}`);
                }
              }
            );
          }
        }
      ]
    );
  }, [handleQuerySubmit]);

  const handleImagePress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Alert.alert(
      'Add Image',
      'Choose image source:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Camera', 
          onPress: async () => {
            try {
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant camera permission to take photos.');
                return;
              }

              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                const message = `I've taken a photo for analysis. What would you like to know about this image?`;
                handleQuerySubmit(message);
              }
            } catch (error) {
              console.error('Camera error:', error);
              Alert.alert('Error', 'Failed to access camera.');
            }
          }
        },
        { 
          text: 'Photo Library', 
          onPress: async () => {
            try {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant photo library permission to select images.');
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                const message = `I've selected an image for analysis. What would you like to know about this image?`;
                handleQuerySubmit(message);
              }
            } catch (error) {
              console.error('Image picker error:', error);
              Alert.alert('Error', 'Failed to access photo library.');
            }
          }
        }
      ]
    );
  }, [handleQuerySubmit]);

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
  }, []);

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
      
      {/* Chat Messages or Zero State */}
      {messagesWithTyping.length === 0 ? (
        <ChatZeroState 
          onSuggestionPress={handleSuggestionPress}
          onQuerySubmit={handleQuerySubmit}
          onVoicePress={handleVoicePress}
          onAddPress={handleAddPress}
          onImagePress={handleImagePress}
        />
      ) : (
        <UnifiedChatInterface
          messages={messagesWithTyping}
          onQuerySubmit={handleQuerySubmit}
          onVoicePress={handleVoicePress}
          onAddPress={handleAddPress}
          onImagePress={handleImagePress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Account for status bar
  },
});