import { Tabs } from 'expo-router';
import { useColorScheme, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors, Shadows, getShadowStyle, Radius, Spacing } from '@/constants';

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
 * - Uses Ionicons for robust cross-platform icons.
 * - Active tint: primary (#24C9EA).
 * - Inactive tint: textDisabled.
 * - Tab bar background: surface color per theme with shadow.
 * - Pill-shaped active state background for a premium feel.
 */

interface TabIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  focused: boolean;
  colorScheme: 'light' | 'dark';
}

function TabIcon({ name, focused, colorScheme }: TabIconProps) {
  const colors = colorScheme === 'dark' ? DarkColors : LightColors;
  const iconColor = focused ? '#FFFFFF' : colors.textDisabled;

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: Radius.full,
        backgroundColor: focused ? colors.primary : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons
        name={name}
        size={22}
        color={iconColor}
      />
    </View>
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
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} colorScheme={colorScheme} />
          ),
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Meds',
          tabBarAccessibilityLabel: 'Medications tab',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'medkit' : 'medkit-outline'} focused={focused} colorScheme={colorScheme} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarAccessibilityLabel: 'History tab',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'time' : 'time-outline'} focused={focused} colorScheme={colorScheme} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarAccessibilityLabel: 'Settings tab',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'settings' : 'settings-outline'} focused={focused} colorScheme={colorScheme} />
          ),
        }}
      />
    </Tabs>
  );
}
