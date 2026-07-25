---
name: Enforce Design System
description: Triggers when the user asks to create or modify UI components, screens, cards, layouts, buttons, inputs, or any visual element. Ensures all design work follows the PillBit Design System — tokens, responsiveness, accessibility, and theming.
---

# Design System Skill

---

## 1. Tokens — Never hardcode values

Import tokens from `@/constants`. Never use raw hex colors, arbitrary numbers for spacing, or magic pixel values.

```ts
import { Colors, Typography, Spacing, Radius, getShadowStyle } from '@/constants';
```

| Category | Import | Examples |
|---|---|---|
| Colors | `Colors`, `LightColors`, `DarkColors` | `colors.primary`, `colors.textPrimary` |
| Typography | `Typography` | `Typography.headingXL`, `Typography.bodyMD` |
| Spacing | `Spacing` | `Spacing.md` (16), `Spacing.lg` (24) |
| Border Radius | `Radius` | `Radius.md` (12), `Radius.lg` (16) |
| Shadows | `getShadowStyle(key)` | `getShadowStyle('card')`, `getShadowStyle('sm')` |

**Violation examples — NEVER do these:**
```ts
// ❌ Hardcoded color
style={{ color: '#123043' }}

// ❌ Hardcoded spacing
style={{ padding: 16, marginBottom: 24 }}

// ❌ Hardcoded radius
style={{ borderRadius: 12 }}
```

**Correct:**
```ts
// ✅ Always use tokens
style={{ color: colors.textPrimary, padding: Spacing.md, borderRadius: Radius.md }}
```

---

## 2. Dynamic Theming — Always use `useTheme`

**Every component** that renders colors or typography **must** call `useTheme()`. This hook returns colors and typography that react automatically to:
- Light / Dark mode (system or user override)
- High Contrast mode
- Text size scaling (Normal / Large / Extra Large)

```ts
import { useTheme } from '@/hooks/useTheme';

export function MyComponent() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  // ...
}

const getStyles = (colors: ColorScheme, typography: typeof Typography) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    title: {
      ...typography.headingXL,
      color: colors.textPrimary,
    },
  });
```

**Never** use `LightColors` directly in a component's StyleSheet — it breaks dark mode and high contrast.

---

## 3. Styling — Use `StyleSheet.create` with `getStyles`

- Always use `StyleSheet.create` (not inline styles) for performance.
- Wrap styles in a `getStyles(colors, typography)` function to get reactive theming.
- Call `getStyles` inside the component after `useTheme()`.

```ts
// ✅ Correct pattern
const getStyles = (colors: ColorScheme, typography: ReturnType<typeof getScaledTypography>) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      padding: Spacing.md,
      ...getShadowStyle('card'),
    },
    title: {
      ...typography.headingMD,
      color: colors.textPrimary,
    },
    subtitle: {
      ...typography.bodySM,
      color: colors.textSecondary,
    },
  });
```

Do **not** spread styles on the same object with conflicting keys. Do **not** use NativeWind `className` in shared `src/components/` — only in feature-level components if already established.

---

## 4. Accessibility — Non-negotiable

Every interactive or informational element must meet these requirements:

### Touch targets
- Minimum **48×48 dp** for all pressable elements.
- Use `minHeight: 48` and adequate `paddingHorizontal`.

### Accessibility props (TouchableOpacity / Pressable)
```tsx
<TouchableOpacity
  accessibilityRole="button"          // Always set the role
  accessibilityLabel="Save medication" // Human-readable label (no icons)
  accessibilityHint="Saves the current form data" // Describes what happens
  accessibilityState={{ disabled: isDisabled, busy: isLoading }}
  disabled={isDisabled}
>
```

### Accessibility props (Text / View)
```tsx
<Text
  accessibilityRole="header"   // Use for headings
  accessible={true}
>
  Medication List
</Text>

// For decorative elements that should be hidden from screen readers:
<View accessible={false} importantForAccessibility="no-hide-descendants">
```

### Role reference
| Element | `accessibilityRole` |
|---|---|
| Button / CTA | `"button"` |
| Screen heading | `"header"` |
| Image with meaning | `"image"` |
| Decorative image | skip accessible or `accessible={false}` |
| Link | `"link"` |
| Checkbox / Switch | `"checkbox"` / `"switch"` |
| List | `"list"` |
| List item | `"listitem"` (Android) |

### Text contrast
- Always use `colors.textPrimary` on `colors.background` or `colors.surface` — guaranteed WCAG AA.
- Use `colors.textSecondary` only for supporting text, captions.
- Never use `colors.textDisabled` for readable content.

---

## 5. Layout & Responsiveness

The app targets 320px – tablets. Use these patterns:

### Flexible layouts (always)
```tsx
// ✅ Flex-based — adapts to any width
<View style={{ flex: 1, flexDirection: 'row', gap: Spacing.sm }}>

// ❌ Fixed widths — breaks on other screen sizes
<View style={{ width: 375 }}>
```

### Screen padding
Every screen must have horizontal padding to prevent content from touching the edges:
```tsx
<ScrollView contentContainerStyle={{ paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl }}>
```

### Lists
Use `FlatList` or `ScrollView` — never nest scrollable views. Always provide `keyExtractor`.

### Safe areas
Screens must respect safe areas using `useSafeAreaInsets()` or `<SafeAreaView>`:
```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
// Apply: paddingTop: insets.top, paddingBottom: insets.bottom
```

### No fixed heights on text containers
Never set `height` on containers that hold dynamic text. Use `minHeight` instead.

---

## 6. Shared Components — Rules for `src/components/`

Components in `src/components/` must be:

| Rule | Description |
|---|---|
| **Dumb** | No Zustand, no service calls, no API calls |
| **Prop-driven** | All behavior controlled by props |
| **Themed** | Use `useTheme()` — support light, dark, high contrast |
| **Accessible** | All props for accessibility explicitly typed in the interface |
| **Documented** | JSDoc comment explaining usage, variants, accessibility |
| **Testable** | Stateless or with minimal local UI state only |

```tsx
/**
 * StatusBadge
 *
 * Displays a colored pill badge for medication status.
 *
 * Usage:
 * ```tsx
 * <StatusBadge status="expired" label="Vencido" />
 * <StatusBadge status="warning" label="Próximo a vencer" />
 * ```
 *
 * Accessibility:
 *  - accessibilityRole="text"
 *  - Reads label aloud via screen reader
 */
interface StatusBadgeProps {
  status: 'valid' | 'warning' | 'expired' | 'info';
  label: string;
  accessibilityLabel?: string;
}
```

---

## 7. Component File Structure

Follow this template for every new component:

```tsx
// ─── Imports ──────────────────────────────────────────────────────────────────
import { StyleSheet, Text, View } from 'react-native';
import { Spacing, Radius } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MyComponentProps {
  title: string;
  accessibilityLabel?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * JSDoc describing the component, usage, and accessibility.
 */
export function MyComponent({ title, accessibilityLabel }: MyComponentProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);

  return (
    <View style={styles.container} accessible accessibilityLabel={accessibilityLabel ?? title}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const getStyles = (colors: any, typography: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      padding: Spacing.md,
    },
    title: {
      ...typography.headingMD,
      color: colors.textPrimary,
    },
  });
```

---

## 8. Status Colors — Medication States

Use these semantic color mappings for medication status indicators:

| Estado | Token | Value (Light) |
|---|---|---|
| Vigente | `colors.success` | `#34C759` |
| Próximo a vencer | `colors.warning` | `#FFB020` |
| Vencido | `colors.error` | `#F04438` |
| Info IA | `colors.secondary` | `#C6CDF8` |

Always pair status colors with a text label — never use color alone to convey state (accessibility requirement).

---

## 9. Animation Guidelines

- Duration: `150ms` (micro), `200ms` (state transitions), `300ms` (screen entrances).
- Use `Animated.timing` or `react-native-reanimated` with easing curves (`Easing.out(Easing.ease)`).
- No animations for purely decorative purposes if `reduceMotion` is enabled.
- Keep animations subtle — PillBit targets older adults.

---

## 10. Quick Checklist Before Submitting

- [ ] All colors use `colors.*` from `useTheme()` — no hardcoded hex
- [ ] All spacing uses `Spacing.*` tokens — no magic numbers
- [ ] All border radius uses `Radius.*` tokens
- [ ] All typography uses `typography.*` from `useTheme()` — no hardcoded `fontSize`
- [ ] All pressable elements have `accessibilityRole`, `accessibilityLabel`, min 48dp touch target
- [ ] All text elements on key views have accessible roles if needed
- [ ] Layout uses `flex` — no fixed `width` or `height` on containers
- [ ] Screen has `paddingHorizontal: Spacing.md` minimum
- [ ] Safe area insets applied on screen-level containers
- [ ] Dark mode works (test by switching theme in Settings)
- [ ] High contrast works (test by enabling High Contrast in Settings)
- [ ] Text scaling works (test with Large / Extra Large text size in Settings)
