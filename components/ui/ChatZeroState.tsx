import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SuggestionCard } from './SuggestionCard';
import { SimpleQueryBar } from './SimpleQueryBar';

interface ChatZeroStateProps {
  onSuggestionPress?: (suggestion: string) => void;
  onQuerySubmit?: (text: string) => void;
  onVoicePress?: () => void;
  onAddPress?: () => void;
  onImagePress?: () => void;
}

export function ChatZeroState({
  onSuggestionPress,
  onQuerySubmit,
  onVoicePress,
  onAddPress,
  onImagePress
}: ChatZeroStateProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
  // Removed unused state

  const suggestionsOpacity = useSharedValue(1);
  const suggestionsTranslateY = useSharedValue(0);

  const handleSuggestionPress = (suggestion: string, slug: string) => {
    onSuggestionPress?.(suggestion);
    // Analytics
    console.log(`Analytics: suggestion_tap_${slug}`);
  };

  const handleQuerySubmit = (text: string) => {
    onQuerySubmit?.(text);
  };

  const handleVoicePress = () => {
    onVoicePress?.();
  };

  const handleAddPress = () => {
    onAddPress?.();
  };

  const handleImagePress = () => {
    onImagePress?.();
  };

  const handleInputFocusChange = (focused: boolean) => {
    if (focused) {
      // Hide suggestions with animation when keyboard appears
      suggestionsOpacity.value = withTiming(0, { duration: 200 });
      suggestionsTranslateY.value = withTiming(-20, { duration: 200 });
    } else {
      // Show suggestions with animation when keyboard disappears
      suggestionsOpacity.value = withTiming(1, { duration: 300 });
      suggestionsTranslateY.value = withTiming(0, { duration: 300 });
    }
  };

  const suggestionsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: suggestionsOpacity.value,
    transform: [{ translateY: suggestionsTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Logo and Profile */}
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

        {/* Greeting */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(100).springify().damping(15).stiffness(100)}
          style={styles.greetingContainer}
        >
          <Text style={[styles.greeting, { color: colors.text }]}>
            Good morning,{'\n'}Arthur
          </Text>
        </Animated.View>

        {/* Kenesis Vision Suggestions */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(300).springify().damping(15).stiffness(100)}
          style={[styles.suggestionsContainer, suggestionsAnimatedStyle]}
        >
          {kenesisVisionSuggestions.map((suggestion, index) => (
            <SuggestionCard
              key={suggestion.id}
              title={suggestion.title}
              category={suggestion.category}
              onPress={() => handleSuggestionPress(suggestion.title, suggestion.slug)}
              index={index}
            />
          ))}
        </Animated.View>
      </ScrollView>

      {/* Simple Query Bar - positioned above navbar */}
      <SimpleQueryBar
        onSubmit={handleQuerySubmit}
        onVoicePress={handleVoicePress}
        onAddPress={handleAddPress}
        onImagePress={handleImagePress}
        onFocusChange={handleInputFocusChange}
      />
    </View>
  );
}



const kenesisVisionSuggestions = [
  {
    id: '1',
    title: 'Calibrate Lens Alignment for First-Time Use',
    category: 'Setup',
    slug: 'calibrate_lens_alignment',
  },
  {
    id: '2',
    title: 'Cut Battery Drain While Recording Continuous Video',
    category: 'Power Optimisation',
    slug: 'cut_battery_drain_video',
  },
  {
    id: '3',
    title: 'Resolve Face-ID Mismatch in Low Light',
    category: 'Vision AI',
    slug: 'resolve_faceid_low_light',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120, // Account for unified query bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
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
  greetingContainer: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 36,
    fontFamily: 'SF Pro Display',
    fontWeight: '400',
    lineHeight: 44,
  },
  suggestionsContainer: {
    marginBottom: 32,
  },
});

// Claude-style color system
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