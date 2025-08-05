import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'action' | 'info';
  icon: string;
  value?: boolean;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState({
    memoryMode: true,
    faceRecognition: true,
    voiceCommands: true,
    autoSync: false,
    notifications: true,
    hapticFeedback: true,
    dataCollection: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const showAlert = (title: string, message: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(title, message);
  };

  const settingSections = [
    {
      title: 'Smart Glasses',
      items: [
        {
          id: 'memory',
          title: 'Memory Mode',
          subtitle: 'Automatically record and analyze visual context',
          type: 'toggle' as const,
          icon: 'brain.head.profile',
          value: settings.memoryMode,
          onPress: () => toggleSetting('memoryMode'),
        },
        {
          id: 'face',
          title: 'Face Recognition',
          subtitle: 'Identify and remember people you meet',
          type: 'toggle' as const,
          icon: 'person.crop.circle',
          value: settings.faceRecognition,
          onPress: () => toggleSetting('faceRecognition'),
        },
        {
          id: 'voice',
          title: 'Voice Commands',
          subtitle: 'Control glasses with voice input',
          type: 'toggle' as const,
          icon: 'mic.circle',
          value: settings.voiceCommands,
          onPress: () => toggleSetting('voiceCommands'),
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          id: 'sync',
          title: 'Auto Sync',
          subtitle: 'Automatically backup memories to cloud',
          type: 'toggle' as const,
          icon: 'icloud',
          value: settings.autoSync,
          onPress: () => toggleSetting('autoSync'),
        },
        {
          id: 'data',
          title: 'Data Collection',
          subtitle: 'Allow anonymous usage analytics',
          type: 'toggle' as const,
          icon: 'chart.bar',
          value: settings.dataCollection,
          onPress: () => toggleSetting('dataCollection'),
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: 'View our privacy policy and data usage',
          type: 'action' as const,
          icon: 'hand.raised',
          onPress: () => showAlert('Privacy Policy', 'Your privacy is important to us. We only collect data necessary to improve your experience.'),
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Receive alerts and reminders',
          type: 'toggle' as const,
          icon: 'bell',
          value: settings.notifications,
          onPress: () => toggleSetting('notifications'),
        },
        {
          id: 'haptic',
          title: 'Haptic Feedback',
          subtitle: 'Feel vibrations for interactions',
          type: 'toggle' as const,
          icon: 'hand.tap',
          value: settings.hapticFeedback,
          onPress: () => toggleSetting('hapticFeedback'),
        },
        {
          id: 'theme',
          title: 'Theme',
          subtitle: `Currently using ${colorScheme === 'dark' ? 'Dark' : 'Light'} mode`,
          type: 'action' as const,
          icon: 'paintbrush',
          onPress: () => showAlert('Theme', 'Theme follows your system settings. Change it in your device settings.'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help with using your smart glasses',
          type: 'action' as const,
          icon: 'questionmark.circle',
          onPress: () => showAlert('Help & Support', 'For support, please visit our website or contact support@smartglasses.com'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          type: 'action' as const,
          icon: 'envelope',
          onPress: () => showAlert('Feedback', 'Thank you for your feedback! Please email us at feedback@smartglasses.com'),
        },
        {
          id: 'about',
          title: 'About',
          subtitle: 'Version 1.0.0',
          type: 'info' as const,
          icon: 'info.circle',
          onPress: () => showAlert('About', 'Smart Glasses App v1.0.0\nBuilt with React Native and Expo'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem, isLast: boolean) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.settingItem, 
          { 
            borderBottomColor: Colors[colorScheme ?? 'light'].border,
            borderBottomWidth: isLast ? 0 : 0.5
          }
        ]}
        onPress={item.onPress}
        disabled={item.type === 'info'}
      >
        <View style={styles.settingContent}>
          <IconSymbol
            name={item.icon as any}
            size={18}
            color={Colors[colorScheme ?? 'light'].textSecondary}
          />
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={[styles.settingSubtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                {item.subtitle}
              </Text>
            )}
          </View>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onPress}
              trackColor={{
                false: Colors[colorScheme ?? 'light'].border,
                true: Colors[colorScheme ?? 'light'].accent,
              }}
              thumbColor={Colors[colorScheme ?? 'light'].background}
            />
          )}
          {item.type === 'action' && (
            <IconSymbol
              name="chevron.right"
              size={14}
              color={Colors[colorScheme ?? 'light'].textTertiary}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          Customize your smart glasses experience
        </Text>
      </View>

      {/* Settings List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionContent, { borderColor: Colors[colorScheme ?? 'light'].border }]}>
              {section.items.map((item, itemIndex) => 
                renderSettingItem(item, itemIndex === section.items.length - 1)
              )}
            </View>
          </View>
        ))}

        {/* Device Info */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Device Information
          </Text>
          <View style={[styles.deviceInfo, { 
            backgroundColor: Colors[colorScheme ?? 'light'].surface,
            borderColor: Colors[colorScheme ?? 'light'].border 
          }]}>
            <View style={styles.deviceRow}>
              <Text style={[styles.deviceLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Glasses Model:
              </Text>
              <Text style={[styles.deviceValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                SmartGlass Pro
              </Text>
            </View>
            <View style={styles.deviceRow}>
              <Text style={[styles.deviceLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Firmware:
              </Text>
              <Text style={[styles.deviceValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                2.1.4
              </Text>
            </View>
            <View style={styles.deviceRow}>
              <Text style={[styles.deviceLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Battery:
              </Text>
              <Text style={[styles.deviceValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                87%
              </Text>
            </View>
            <View style={styles.deviceRow}>
              <Text style={[styles.deviceLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Storage Used:
              </Text>
              <Text style={[styles.deviceValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                2.3 GB / 32 GB
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
  },
  settingItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '400',
  },
  deviceInfo: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  deviceLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  deviceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});