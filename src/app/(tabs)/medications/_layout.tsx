/**
 * Medications Stack Layout
 *
 * Nested Stack navigator scoped to the Medications tab.
 * Manages the following routes:
 *   index       → /medications            (MedicationListScreen)
 *   create      → /medications/create     (CreateMedicationScreen)
 *   [id]        → /medications/:id        (MedicationDetailScreen)
 *   [id]/edit   → /medications/:id/edit   (EditMedicationScreen)
 *
 * The Stack header is hidden globally; each screen renders its own
 * navigation controls to maintain design system consistency.
 */

import { Stack } from 'expo-router';

export default function MedicationsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/edit" />
      <Stack.Screen name="[id]/reminders" />
      <Stack.Screen name="low-stock" />
    </Stack>
  );
}
