/**
 * Neutral color system - Perplexity grade conversational canvas
 */

export const Colors = {
  light: {
    // Neutral off-white backdrop
    background: '#FAFAF7',
    backgroundSecondary: '#F5F5F2',
    surface: '#FFFFFF',
    surfaceSecondary: '#F9F9F9',
    
    // Text hierarchy
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    
    // Brand accent (only for focus states and interactive affordances)
    tint: '#2062FF',
    accent: '#2062FF',
    accentSecondary: '#1A52CC',
    accentLight: 'rgba(32, 98, 255, 0.1)',
    accentMedium: 'rgba(32, 98, 255, 0.2)',
    accentStrong: 'rgba(32, 98, 255, 0.3)',
    
    // Borders and dividers
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    
    // Tab navigation
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#2062FF',
  },
  dark: {
    // Claude-style dark theme
    background: '#1A1A1A',
    backgroundSecondary: '#0F0F0F',
    surface: '#2A2A2A',
    surfaceSecondary: '#333333',
    
    // Text hierarchy
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    
    // Brand accent (purple like Claude)
    tint: '#8B5CF6',
    accent: '#8B5CF6',
    accentSecondary: '#7C3AED',
    accentLight: 'rgba(139, 92, 246, 0.1)',
    accentMedium: 'rgba(139, 92, 246, 0.2)',
    accentStrong: 'rgba(139, 92, 246, 0.3)',
    
    // Borders and dividers
    border: '#404040',
    borderLight: '#333333',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    
    // Tab navigation
    tabIconDefault: '#808080',
    tabIconSelected: '#8B5CF6',
  },
};
