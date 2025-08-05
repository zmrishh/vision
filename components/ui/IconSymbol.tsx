// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'brain.head.profile': 'psychology',
  'message.circle.fill': 'chat',
  'gearshape.fill': 'settings',
  'person.crop.circle.fill': 'account-circle',
  'eye.fill': 'visibility',
  'person.circle.fill': 'person',
  'location.circle.fill': 'location-on',
  'note.text': 'note',
  'calendar.circle.fill': 'event',
  'lightbulb.fill': 'lightbulb',
  'magnifyingglass': 'search',
  'square.grid.2x2': 'grid-view',
  'person.circle': 'person-outline',
  'location.circle': 'location-on',
  'mic.circle': 'mic',
  'viewfinder': 'center-focus-strong',
  'person.crop.circle': 'account-circle',
  'icloud': 'cloud',
  'chart.bar': 'bar-chart',
  'hand.raised': 'pan-tool',
  'bell': 'notifications',
  'hand.tap': 'touch-app',
  'paintbrush': 'palette',
  'questionmark.circle': 'help',
  'envelope': 'email',
  'info.circle': 'info',
  'arrow.up': 'keyboard-arrow-up',
  'bookmark.fill': 'bookmark',
  'location': 'place',
  'person.2.fill': 'people',
  'car.fill': 'directions-car',
  'bell.fill': 'notifications',
  'calendar.circle': 'event',
  'mic.fill': 'mic',
  'quote.bubble.fill': 'format-quote',
  'cup.and.saucer.fill': 'local-cafe',
  'battery.25': 'battery-2-bar',
  'figure.walk': 'directions-walk',
  'bolt.heart.fill': 'favorite',
  'person.crop.circle.badge.questionmark': 'help-outline',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'qrcode.viewfinder': 'qr-code-scanner',
  'memories': 'photo-library',
  'brain.filled.head.profile': 'psychology',
  'slider.horizontal.3': 'tune',
  'plus': 'add',
  'camera': 'photo-camera',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
