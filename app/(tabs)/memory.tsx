import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';

interface MemoryItem {
  id: string;
  type: 'person' | 'place' | 'photo' | 'note';
  title: string;
  description: string;
  timestamp: Date;
  location?: string;
  isImportant?: boolean;
}

export default function MemoryScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [memories] = useState<MemoryItem[]>([
    {
      id: '1',
      type: 'person',
      title: 'Sarah Chen',
      description: 'Met at coffee shop, discussed project collaboration',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: 'Starbucks Downtown',
      isImportant: true,
    },
    {
      id: '2',
      type: 'photo',
      title: 'Project Whiteboard',
      description: 'Captured whiteboard notes from brainstorming session',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      location: 'Office Conference Room',
    },
    {
      id: '3',
      type: 'place',
      title: 'Tech Innovation Hub',
      description: 'Visited for startup meetup, networking event',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      location: '123 Innovation Drive',
    },
    {
      id: '4',
      type: 'note',
      title: 'Parking Location',
      description: 'Car parked at Level 3B, Section near elevator',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      location: 'Shopping Mall',
    },
  ]);

  // Memory stats for the workout-style cards
  const memoryStats = {
    total: memories.length,
    today: memories.filter(m => {
      const today = new Date();
      const memoryDate = new Date(m.timestamp);
      return memoryDate.toDateString() === today.toDateString();
    }).length,
    people: memories.filter(m => m.type === 'person').length,
    places: memories.filter(m => m.type === 'place').length,
    photos: memories.filter(m => m.type === 'photo').length,
    important: memories.filter(m => m.isImportant).length,
  };

  const filterTypes = [
    { key: 'all', label: 'All' },
    { key: 'photo', label: 'Photos' },
    { key: 'person', label: 'People' },
    { key: 'place', label: 'Places' },
  ];

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || memory.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'person': return 'person.circle.fill';
      case 'place': return 'location.circle.fill';
      case 'photo': return 'camera';
      case 'note': return 'note.text';
      default: return 'circle.fill';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'person': return Colors[colorScheme ?? 'light'].accent;
      case 'place': return '#22C55E';
      case 'photo': return '#3B82F6';
      case 'note': return '#F59E0B';
      default: return Colors[colorScheme ?? 'light'].textSecondary;
    }
  };

  const handleMemoryPress = (memory: MemoryItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(memory.title, memory.description);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Action Buttons */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Memories
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <IconSymbol name="line.3.horizontal.decrease" size={18} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <IconSymbol name="plus" size={18} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Workout-Style Stats Cards */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Recent Memory - Full Width Card */}
        {memories.length > 0 && (
          <TouchableOpacity 
            style={[styles.recentCard, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}
            onPress={() => handleMemoryPress(memories[0])}
          >
            <View style={styles.recentCardContent}>
              <View style={styles.recentLeft}>
                <Text style={[styles.recentLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                  {memories[0].type.charAt(0).toUpperCase() + memories[0].type.slice(1)}
                </Text>
                <Text style={[styles.recentSubLabel, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
                  Logged {formatTimestamp(memories[0].timestamp)}
                </Text>
              </View>
              <View style={styles.recentRight}>
                <Text style={[styles.recentValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {memories[0].title.length > 15 ? memories[0].title.substring(0, 15) + '...' : memories[0].title}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Stats Grid - Two Column Layout */}
        <View style={styles.statsGrid}>
          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              {memoryStats.people}
            </Text>
            <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              People
            </Text>
            <Text style={[styles.statSubLabel, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
              Logged today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              {memoryStats.places}
              <Text style={[styles.statUnit, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                {' '}places
              </Text>
            </Text>
            <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              Locations
            </Text>
            <Text style={[styles.statSubLabel, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
              Logged 1 min ago
            </Text>
          </TouchableOpacity>
        </View>

        {/* Photos Card - Full Width */}
        <TouchableOpacity 
          style={[styles.photoCard, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <View style={styles.photoCardContent}>
            <View style={styles.photoLeft}>
              <Text style={[styles.photoLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Photos
              </Text>
              <Text style={[styles.photoSubLabel, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
                Logged just now
              </Text>
            </View>
            <View style={styles.photoRight}>
              <Text style={[styles.photoValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                {memoryStats.photos}
              </Text>
              <Text style={[styles.photoUnit, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                items
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Important Memories Card */}
        <TouchableOpacity 
          style={[styles.importantCard, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <View style={styles.importantCardContent}>
            <View style={styles.importantLeft}>
              <Text style={[styles.importantLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Important
              </Text>
              <Text style={[styles.importantSubLabel, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
                Starred memories
              </Text>
            </View>
            <View style={styles.importantRight}>
              <Text style={[styles.importantValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                {memoryStats.important}
              </Text>
              <Text style={[styles.importantUnit, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                starred
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Recent Memories List */}
        <View style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            Recent
          </Text>
          {memories.slice(0, 3).map((memory, index) => (
            <TouchableOpacity
              key={memory.id}
              style={[styles.recentItem, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}
              onPress={() => handleMemoryPress(memory)}
            >
              <View style={[styles.recentIcon, { backgroundColor: getTypeColor(memory.type) + '20' }]}>
                <IconSymbol
                  name={getTypeIcon(memory.type) as any}
                  size={16}
                  color={getTypeColor(memory.type)}
                />
              </View>
              <View style={styles.recentItemContent}>
                <Text style={[styles.recentItemTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {memory.title}
                </Text>
                <Text style={[styles.recentItemTime, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
                  {formatTimestamp(memory.timestamp)}
                </Text>
              </View>

            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Add top padding for status bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  
  // Recent Memory Card (like Weight card)
  recentCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  recentCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentLeft: {
    flex: 1,
  },
  recentLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  recentSubLabel: {
    fontSize: 13,
    fontWeight: '400',
  },
  recentRight: {
    alignItems: 'flex-end',
  },
  recentValue: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  
  // Stats Grid (like Number/Measurement cards)
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
  },
  statValue: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 8,
  },
  statUnit: {
    fontSize: 16,
    fontWeight: '400',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statSubLabel: {
    fontSize: 13,
    fontWeight: '400',
  },
  
  // Photos Card (like Percentage card)
  photoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  photoCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoLeft: {
    flex: 1,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  photoSubLabel: {
    fontSize: 13,
    fontWeight: '400',
  },
  photoRight: {
    alignItems: 'flex-end',
  },
  photoValue: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  photoUnit: {
    fontSize: 13,
    fontWeight: '400',
  },
  
  // Important Card (like Cardio card)
  importantCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  importantCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  importantLeft: {
    flex: 1,
  },
  importantLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  importantSubLabel: {
    fontSize: 13,
    fontWeight: '400',
  },
  importantRight: {
    alignItems: 'flex-end',
  },
  importantValue: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  importantUnit: {
    fontSize: 13,
    fontWeight: '400',
  },
  
  // Card Action Button
  cardAction: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  
  // Recent Section
  recentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  recentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  recentItemTime: {
    fontSize: 12,
    fontWeight: '400',
  },
});