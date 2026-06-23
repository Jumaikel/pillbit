import { Redirect } from 'expo-router';

/**
 * Root index — redirects immediately to the (tabs) group.
 * The "/" route resolves to the Home tab via (tabs)/index.tsx.
 */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
