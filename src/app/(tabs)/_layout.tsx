import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { LightColors, DarkColors } from '@/constants';

/**
 * TabsLayout
 *
 * Bottom Tab Navigator for PillBit.
 *
 * Tabs:
 *  - Home         → (tabs)/index.tsx         → /
 *  - Medications  → (tabs)/medications.tsx    → /medications
 *  - History      → (tabs)/history.tsx        → /history
 *  - Settings     → (tabs)/settings.tsx       → /settings
 *
 * Design decisions:
 * - Uses expo-symbols for native SF Symbols (iOS) and Material Icons (Android).
 * - Active tint: primary (#24C9EA).
 * - Inactive tint: textSecondary.
 * - Tab bar background: surface color per theme.
 * - No business logic here.
 */

interface TabIconProps {
  name: string;
  focused: boolean;
  colorScheme: 'light' | 'dark';
}

function TabIcon({ name, focused, colorScheme }: TabIconProps) {
  const colors = colorScheme === 'dark' ? DarkColors : LightColors;
  const color = focused ? colors.primary : colors.textSecondary;

  return (
    <SymbolView
      name={name as Parameters<typeof SymbolView>[0]['name']}
      size={24}
      tintColor={color}
      type={focused ? 'hierarchical' : 'monochrome'}
    />
  );
}

export default function TabsLayout() {
  const rawScheme = useColorScheme();
  const colorScheme: 'light' | 'dark' = rawScheme === 'dark' ? 'dark' : 'light';
  const colors = colorScheme === 'dark' ? DarkColors : LightColors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="house.fill" focused={focused} colorScheme={colorScheme} />
          ),
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Medications',
          tabBarAccessibilityLabel: 'Medications tab',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="pills.fill" focused={focused} colorScheme={colorScheme} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarAccessibilityLabel: 'History tab',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="clock.fill" focused={focused} colorScheme={colorScheme} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarAccessibilityLabel: 'Settings tab',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="gearshape.fill" focused={focused} colorScheme={colorScheme} />
          ),
        }}
      />
    </Tabs>
  );
}
