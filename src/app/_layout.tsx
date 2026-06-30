import '../global.css';

import { Stack, DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { initDatabase } from '@/database';

import { NotificationService } from '@/services/NotificationService';

/**
 * RootLayout
 *
 * Application root layout. Responsibilities:
 * - Import global CSS (NativeWind/Tailwind)
 * - Initialize the SQLite database (run pending migrations) on mount
 * - Provide SafeAreaProvider for insets
 * - Provide GestureHandlerRootView for gesture support
 * - Provide React Navigation ThemeProvider (light/dark)
 * - Declare the Expo Router Stack with a single "(tabs)" group
 *
 * No business logic here beyond database initialization.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const initApp = async () => {
      try {
        await initDatabase();
        await NotificationService.syncReminders();
        await NotificationService.syncExpirationAlerts();
      } catch (e) {
        console.error('[RootLayout] Application initialization failed:', e);
      }
    };
    initApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
