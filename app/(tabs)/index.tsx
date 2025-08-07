import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Interactive3DGlass from '@/components/ui/Interactive3DGlass';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface GlassesStats {
  recordingTime: string;
  batteryLevel: number;
  storageUsed: number;
  facesRecognized: number;
  isConnected: boolean;
  lastSync: string;
}

interface QuickWidget {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

interface RecentCapture {
  id: string;
  type: 'photo' | 'video' | 'voice' | 'person';
  title: string;
  time: string;
  location?: string;
  isNew?: boolean;
}

interface SmartSuggestion {
  id: string;
  title: string;
  subtitle: string;
  action: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [glassesStats] = useState<GlassesStats>({
    recordingTime: '2h 34m',
    batteryLevel: 87,
    storageUsed: 68,
    facesRecognized: 12,
    isConnected: true,
    lastSync: '2m ago',
  });

  const [isRecording, setIsRecording] = useState(false);
  const [currentDate] = useState('Today');
  const [showLivePreview, setShowLivePreview] = useState(false);

  const quickWidgets: QuickWidget[] = [
    {
      id: '1',
      title: 'Battery',
      value: `${glassesStats.batteryLevel}%`,
      subtitle: glassesStats.batteryLevel > 20 ? '4h 23m remaining' : 'Charge soon',
      icon: glassesStats.batteryLevel > 50 ? 'battery.100' : glassesStats.batteryLevel > 20 ? 'battery.50' : 'battery.25',
      color: glassesStats.batteryLevel > 50 ? '#22C55E' : glassesStats.batteryLevel > 20 ? '#F59E0B' : '#EF4444',
      trend: 'down',
    },
    {
      id: '2',
      title: 'Storage',
      value: `${glassesStats.storageUsed}%`,
      subtitle: glassesStats.storageUsed < 80 ? '10.2GB available' : 'Almost full',
      icon: 'internaldrive',
      color: glassesStats.storageUsed < 80 ? '#3B82F6' : '#F59E0B',
      trend: 'up',
    },
    {
      id: '3',
      title: 'Faces',
      value: `${glassesStats.facesRecognized}`,
      subtitle: 'recognized today',
      icon: 'person.2.fill',
      color: '#8B5CF6',
      trend: 'up',
    },
    {
      id: '4',
      title: 'Recording',
      value: glassesStats.recordingTime,
      subtitle: 'total today',
      icon: 'record.circle',
      color: '#EF4444',
      trend: 'stable',
    },
  ];

  const recentCaptures: RecentCapture[] = [
    {
      id: '1',
      type: 'person',
      title: 'Sarah Chen recognized',
      time: '2m ago',
      location: 'Coffee Shop',
      isNew: true,
    },
    {
      id: '2',
      type: 'photo',
      title: 'Photo captured',
      time: '5m ago',
      location: 'Downtown',
      isNew: true,
    },
    {
      id: '3',
      type: 'voice',
      title: 'Voice memo saved',
      time: '12m ago',
    },
    {
      id: '4',
      type: 'video',
      title: 'Video recorded',
      time: '18m ago',
      location: 'Meeting Room',
    },
  ];

  const smartSuggestions: SmartSuggestion[] = [
    {
      id: '1',
      title: 'Low Battery',
      subtitle: 'Find charging station nearby',
      action: 'Find Charger',
      icon: 'battery.25',
      priority: glassesStats.batteryLevel < 20 ? 'high' : 'low',
    },
    {
      id: '2',
      title: 'New Face Detected',
      subtitle: 'Would you like to save this person?',
      action: 'Save Contact',
      icon: 'person.crop.circle.badge.plus',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Meeting in 15 min',
      subtitle: 'Prepare face recognition for attendees',
      action: 'Prepare',
      icon: 'calendar',
      priority: 'high',
    },
  ].filter(suggestion =>
    suggestion.priority === 'high' ||
    (suggestion.priority === 'medium' && Math.random() > 0.5)
  );

  const handleRecordingToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRecording(!isRecording);
    Alert.alert('Recording', isRecording ? 'Recording stopped' : 'Recording started');
  };

  const handleQuickCapture = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Capture', 'Photo taken');
  };

  const handleVoiceMemo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Voice Memo', 'Recording voice memo...');
  };

  const handleLiveView = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLivePreview(!showLivePreview);
  };

  const handleFindGlasses = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('Find Glasses', 'Making glasses beep and flash...');
  };

  const handleWidgetPress = (widget: QuickWidget) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (widget.id === '1' && glassesStats.batteryLevel < 20) {
      Alert.alert('Low Battery', 'Would you like to find a charging station?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Find Charger', onPress: () => Alert.alert('Finding nearest charging station...') }
      ]);
    } else {
      Alert.alert(widget.title, `${widget.title}: ${widget.value}`);
    }
  };

  const handleCapturePress = (capture: RecentCapture) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Recent Capture', `Opening ${capture.title}`);
  };

  const handleSuggestionPress = (suggestion: SmartSuggestion) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(suggestion.title, suggestion.subtitle, [
      { text: 'Dismiss', style: 'cancel' },
      { text: suggestion.action, onPress: () => Alert.alert(`${suggestion.action} activated`) }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.appName, { color: Colors[colorScheme ?? 'light'].text }]}>
            Vision
          </Text>
          <TouchableOpacity style={styles.dateSelector}>
            <Text style={[styles.dateText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              {currentDate}
            </Text>
            <IconSymbol name="chevron.right" size={14} color={Colors[colorScheme ?? 'light'].textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          {/* Connection Status */}
          <View style={[styles.connectionIndicator, {
            backgroundColor: glassesStats.isConnected ? Colors[colorScheme ?? 'light'].success + '20' : Colors[colorScheme ?? 'light'].error + '20'
          }]}>
            <View style={[styles.connectionDot, {
              backgroundColor: glassesStats.isConnected ? Colors[colorScheme ?? 'light'].success : Colors[colorScheme ?? 'light'].error
            }]} />
          </View>

          <TouchableOpacity style={styles.profileButton}>
            <View style={[styles.profileImage, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}>
              <IconSymbol name="person.crop.circle.fill" size={24} color={Colors[colorScheme ?? 'light'].textSecondary} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Smart Suggestions */}
        {smartSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {smartSuggestions.slice(0, 1).map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                style={[styles.suggestionCard, {
                  backgroundColor: suggestion.priority === 'high' ? Colors[colorScheme ?? 'light'].accent + '15' : Colors[colorScheme ?? 'light'].surface,
                  borderColor: suggestion.priority === 'high' ? Colors[colorScheme ?? 'light'].accent + '30' : Colors[colorScheme ?? 'light'].border,
                }]}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <View style={styles.suggestionLeft}>
                  <View style={[styles.suggestionIcon, {
                    backgroundColor: suggestion.priority === 'high' ? Colors[colorScheme ?? 'light'].accent + '20' : Colors[colorScheme ?? 'light'].surface
                  }]}>
                    <IconSymbol name={suggestion.icon as any} size={16} color={
                      suggestion.priority === 'high' ? Colors[colorScheme ?? 'light'].accent : Colors[colorScheme ?? 'light'].textSecondary
                    } />
                  </View>
                  <View style={styles.suggestionContent}>
                    <Text style={[styles.suggestionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                      {suggestion.title}
                    </Text>
                    <Text style={[styles.suggestionSubtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                      {suggestion.subtitle}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.suggestionAction, { color: Colors[colorScheme ?? 'light'].accent }]}>
                  {suggestion.action}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Interactive 3D Glass Model */}
        <View style={styles.centralOrbContainer}>
          <Interactive3DGlass
            size={200}
          />

          <Text style={[styles.recordingTime, { color: Colors[colorScheme ?? 'light'].text }]}>
            {glassesStats.recordingTime}
          </Text>
          <Text style={[styles.recordingLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            RECORDING TIME TODAY
          </Text>
        </View>

        {/* Enhanced Stats Grid */}
        <View style={styles.statsContainer}>
          {/* Top Row - Primary Stats */}
          <View style={styles.primaryStatsRow}>
            {quickWidgets.slice(0, 2).map((widget) => (
              <TouchableOpacity
                key={widget.id}
                style={[
                  styles.primaryStatCard,
                  {
                    backgroundColor: Colors[colorScheme ?? 'light'].surface,
                    borderColor: widget.title === 'Battery' && glassesStats.batteryLevel < 20
                      ? Colors[colorScheme ?? 'light'].error + '40'
                      : 'transparent',
                    borderWidth: widget.title === 'Battery' && glassesStats.batteryLevel < 20 ? 1 : 0,
                  }
                ]}
                onPress={() => handleWidgetPress(widget)}
              >
                <View style={styles.primaryStatHeader}>
                  <View style={styles.primaryStatLeft}>
                    <Text style={[styles.primaryStatTitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                      {widget.title.toUpperCase()}
                    </Text>
                    {widget.trend && (
                      <View style={[styles.primaryTrendIndicator, {
                        backgroundColor:
                          widget.trend === 'up' ? Colors[colorScheme ?? 'light'].success + '20' :
                            widget.trend === 'down' ? Colors[colorScheme ?? 'light'].error + '20' :
                              Colors[colorScheme ?? 'light'].textTertiary + '20'
                      }]}>
                        <IconSymbol
                          name={
                            widget.trend === 'up' ? 'arrow.up' :
                              widget.trend === 'down' ? 'arrow.down' :
                                'minus'
                          }
                          size={10}
                          color={
                            widget.trend === 'up' ? Colors[colorScheme ?? 'light'].success :
                              widget.trend === 'down' ? Colors[colorScheme ?? 'light'].error :
                                Colors[colorScheme ?? 'light'].textTertiary
                          }
                        />
                      </View>
                    )}
                  </View>
                  <View style={[styles.primaryStatIcon, { backgroundColor: widget.color + '15' }]}>
                    <IconSymbol name={widget.icon as any} size={20} color={widget.color} />
                  </View>
                </View>

                <View style={styles.primaryStatContent}>
                  <Text style={[styles.primaryStatValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {widget.value}
                  </Text>
                  <Text style={[styles.primaryStatSubtitle, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
                    {widget.subtitle}
                  </Text>
                </View>

                {/* Progress Bar for Battery and Storage */}
                {(widget.title === 'Battery' || widget.title === 'Storage') && (
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressTrack, { backgroundColor: Colors[colorScheme ?? 'light'].border }]}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${widget.title === 'Battery' ? glassesStats.batteryLevel : glassesStats.storageUsed}%`,
                            backgroundColor: widget.color,
                          }
                        ]}
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Row - Secondary Stats */}
          <View style={styles.secondaryStatsRow}>
            {quickWidgets.slice(2, 4).map((widget) => (
              <TouchableOpacity
                key={widget.id}
                style={[
                  styles.secondaryStatCard,
                  { backgroundColor: Colors[colorScheme ?? 'light'].surface }
                ]}
                onPress={() => handleWidgetPress(widget)}
              >
                <View style={styles.secondaryStatHeader}>
                  <View style={[styles.secondaryStatIcon, { backgroundColor: widget.color + '15' }]}>
                    <IconSymbol name={widget.icon as any} size={16} color={widget.color} />
                  </View>
                  {widget.trend && (
                    <View style={[styles.secondaryTrendIndicator, {
                      backgroundColor:
                        widget.trend === 'up' ? Colors[colorScheme ?? 'light'].success + '20' :
                          widget.trend === 'down' ? Colors[colorScheme ?? 'light'].error + '20' :
                            Colors[colorScheme ?? 'light'].textTertiary + '20'
                    }]}>
                      <IconSymbol
                        name={
                          widget.trend === 'up' ? 'arrow.up' :
                            widget.trend === 'down' ? 'arrow.down' :
                              'minus'
                        }
                        size={8}
                        color={
                          widget.trend === 'up' ? Colors[colorScheme ?? 'light'].success :
                            widget.trend === 'down' ? Colors[colorScheme ?? 'light'].error :
                              Colors[colorScheme ?? 'light'].textTertiary
                        }
                      />
                    </View>
                  )}
                </View>

                <Text style={[styles.secondaryStatTitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                  {widget.title.toUpperCase()}
                </Text>

                <Text style={[styles.secondaryStatValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {widget.value}
                </Text>

                <Text style={[styles.secondaryStatSubtitle, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
                  {widget.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activity Chart */}
        <View style={[styles.chartContainer, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}>
          <Text style={[styles.chartTitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            ACTIVITY TODAY
          </Text>
          <View style={styles.chartBars}>
            {Array.from({ length: 24 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.chartBar,
                  {
                    height: Math.random() * 40 + 10,
                    backgroundColor: i >= 9 && i <= 17
                      ? Colors[colorScheme ?? 'light'].accent
                      : Colors[colorScheme ?? 'light'].border,
                  }
                ]}
              />
            ))}
          </View>
          <View style={styles.chartLabels}>
            <Text style={[styles.chartLabel, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>7AM</Text>
            <Text style={[styles.chartLabel, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>11AM</Text>
            <Text style={[styles.chartLabel, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>3PM</Text>
            <Text style={[styles.chartLabel, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>7PM</Text>
            <Text style={[styles.chartLabel, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>11PM</Text>
          </View>
        </View>

        {/* Live Preview */}
        {showLivePreview && (
          <View style={[styles.livePreviewContainer, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}>
            <View style={styles.livePreviewHeader}>
              <View style={styles.livePreviewStatus}>
                <View style={[styles.liveDot, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]} />
                <Text style={[styles.livePreviewText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Live View
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowLivePreview(false)}>
                <IconSymbol name="xmark" size={16} color={Colors[colorScheme ?? 'light'].textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.livePreviewContent, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
              <IconSymbol name="eye.fill" size={32} color={Colors[colorScheme ?? 'light'].textTertiary} />
              <Text style={[styles.livePreviewLabel, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
                Camera feed would appear here
              </Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}
            onPress={handleQuickCapture}
          >
            <IconSymbol name="camera" size={20} color={Colors[colorScheme ?? 'light'].text} />
            <Text style={[styles.quickActionLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              Capture
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}
            onPress={handleVoiceMemo}
          >
            <IconSymbol name="mic.circle" size={20} color={Colors[colorScheme ?? 'light'].text} />
            <Text style={[styles.quickActionLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              Voice
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, {
              backgroundColor: showLivePreview ? Colors[colorScheme ?? 'light'].accent + '20' : Colors[colorScheme ?? 'light'].surface
            }]}
            onPress={handleLiveView}
          >
            <IconSymbol name="eye.fill" size={20} color={
              showLivePreview ? Colors[colorScheme ?? 'light'].accent : Colors[colorScheme ?? 'light'].text
            } />
            <Text style={[styles.quickActionLabel, {
              color: showLivePreview ? Colors[colorScheme ?? 'light'].accent : Colors[colorScheme ?? 'light'].textSecondary
            }]}>
              Live View
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: Colors[colorScheme ?? 'light'].surface }]}
            onPress={handleFindGlasses}
          >
            <IconSymbol name="location" size={20} color={Colors[colorScheme ?? 'light'].text} />
            <Text style={[styles.quickActionLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              Find
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Recent Activity
            </Text>
            <View style={styles.syncStatus}>
              <View style={[styles.syncDot, {
                backgroundColor: glassesStats.isConnected ? Colors[colorScheme ?? 'light'].success : Colors[colorScheme ?? 'light'].textTertiary
              }]} />
              <Text style={[styles.timeOffline, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
                Last sync: {glassesStats.lastSync}
              </Text>
            </View>
          </View>

          {recentCaptures.map((capture, index) => (
            <TouchableOpacity
              key={capture.id}
              style={[
                styles.recentItem,
                {
                  borderBottomColor: Colors[colorScheme ?? 'light'].border,
                  borderBottomWidth: index === recentCaptures.length - 1 ? 0 : 0.5
                }
              ]}
              onPress={() => handleCapturePress(capture)}
            >
              <View style={styles.recentLeft}>
                <View style={[styles.recentIcon, {
                  backgroundColor: capture.isNew ? Colors[colorScheme ?? 'light'].accent + '20' : Colors[colorScheme ?? 'light'].surface
                }]}>
                  <IconSymbol
                    name={
                      capture.type === 'photo' ? 'camera' :
                        capture.type === 'video' ? 'video' :
                          capture.type === 'voice' ? 'mic.circle' :
                            'person.circle.fill'
                    }
                    size={16}
                    color={capture.isNew ? Colors[colorScheme ?? 'light'].accent : Colors[colorScheme ?? 'light'].textSecondary}
                  />
                </View>
                <View style={styles.recentContent}>
                  <View style={styles.recentTitleRow}>
                    <Text style={[styles.recentTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                      {capture.title}
                    </Text>
                    {capture.isNew && (
                      <View style={[styles.newBadge, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]}>
                        <Text style={styles.newBadgeText}>NEW</Text>
                      </View>
                    )}
                  </View>
                  {capture.location && (
                    <Text style={[styles.recentLocation, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
                      {capture.location}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={[styles.recentTime, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
                {capture.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  connectionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  suggestionsContainer: {
    marginBottom: 24,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  suggestionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  suggestionSubtitle: {
    fontSize: 13,
    fontWeight: '400',
  },
  suggestionAction: {
    fontSize: 14,
    fontWeight: '600',
  },
  centralOrbContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 20,
  },
  centralOrb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  orbInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingTime: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 4,
  },
  recordingLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  primaryStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryStatCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    minHeight: 140,
  },
  primaryStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  primaryStatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryStatTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  primaryTrendIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryStatContent: {
    marginBottom: 12,
  },
  primaryStatValue: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -1,
  },
  primaryStatSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  secondaryStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryStatCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
  },
  secondaryStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryStatIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryTrendIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryStatTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  secondaryStatValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.8,
  },
  secondaryStatSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  chartContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
    marginBottom: 12,
  },
  chartBar: {
    width: 8,
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  quickActionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  livePreviewContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  livePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  livePreviewStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  livePreviewText: {
    fontSize: 15,
    fontWeight: '600',
  },
  livePreviewContent: {
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  livePreviewLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  recentSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timeOffline: {
    fontSize: 13,
    fontWeight: '500',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  newBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  recentLocation: {
    fontSize: 13,
    fontWeight: '400',
  },
  recentTime: {
    fontSize: 13,
    fontWeight: '500',
  },
});