# PillBit Design System

This document is the canonical reference for all visual design decisions in PillBit.
All components, screens, and features must use these tokens exclusively.
Hardcoded values are forbidden.

---

## Token Import Pattern

```ts
import { Colors, Typography, Spacing, Radius, Shadows, theme } from '@/constants';
```

Or via the unified theme object:
```ts
import { theme } from '@/constants';
const color = theme.colors.light.primary;
```

---

## Colors

Colors are organized in two schemes: `LightColors` and `DarkColors`.

### Light Theme

| Token            | Value     | Usage                              |
|------------------|-----------|------------------------------------|
| `primary`        | `#24C9EA` | CTAs, active states, tab highlights |
| `primaryLight`   | `#7FD6EA` | Hover/pressed state of primary     |
| `primaryContainer` | `#D6EDFB` | Chip/badge backgrounds           |
| `secondary`      | `#C6CDF8` | Secondary actions, AI info badges  |
| `accent`         | `#FED7EE` | Decorative accents                 |
| `background`     | `#F8FCFE` | Screen backgrounds                 |
| `surface`        | `#FFFFFF` | Cards, modals, inputs              |
| `surfaceVariant` | `#EEF8FC` | Subtle sections, disabled inputs   |
| `cardBackground` | `#FFFFFF` | Card container background          |
| `textPrimary`    | `#123043` | Primary body text, headings        |
| `textSecondary`  | `#5D7482` | Subtitles, captions, hints         |
| `textDisabled`   | `#A6B4BE` | Disabled element labels            |
| `success`        | `#34C759` | Valid medications, success states  |
| `warning`        | `#FFB020` | Expiring soon, cautions            |
| `error`          | `#F04438` | Expired, validation errors         |
| `info`           | `#24C9EA` | Informational states               |
| `border`         | `#D6EDFB` | Input borders, dividers            |

### Dark Theme

| Token            | Value     |
|------------------|-----------|
| `background`     | `#0B1720` |
| `surface`        | `#122330` |
| `surfaceVariant` | `#193241` |
| `cardBackground` | `#17303F` |
| `textPrimary`    | `#F5FAFC` |
| `textSecondary`  | `#C2D3DD` |
| `textDisabled`   | `#6E8592` |
| `primaryContainer` | `#1B6F83` |

### Usage Example

```tsx
import { StyleSheet } from 'react-native';
import { LightColors } from '@/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: LightColors.background,
  },
  title: {
    color: LightColors.textPrimary,
  },
});
```

---

## Typography

All type styles are defined as `TextStyle`-compatible objects.

| Token       | Size | Weight | Line Height | Usage              |
|-------------|------|--------|-------------|--------------------|
| `display`   | 32   | 700    | 40          | Hero / splash text |
| `headingXL` | 28   | 700    | 36          | H1, screen titles  |
| `headingLG` | 24   | 600    | 32          | H2, section titles |
| `headingMD` | 20   | 600    | 28          | H3, card titles    |
| `bodyLG`    | 18   | 400    | 28          | Emphasized body    |
| `bodyMD`    | 16   | 400    | 24          | Default body text  |
| `bodySM`    | 14   | 400    | 20          | Captions, labels   |
| `caption`   | 12   | 400    | 16          | Timestamps, hints  |

### Usage Example

```tsx
import { StyleSheet } from 'react-native';
import { Typography, LightColors } from '@/constants';

const styles = StyleSheet.create({
  title: {
    ...Typography.headingXL,
    color: LightColors.textPrimary,
  },
  body: {
    ...Typography.bodyMD,
    color: LightColors.textSecondary,
  },
});
```

---

## Spacing

Base unit: **8px**. All spacing must use these tokens.

| Token  | Value | Usage                          |
|--------|-------|--------------------------------|
| `xxs`  | 4     | Micro gaps (icon/text spacing) |
| `xs`   | 8     | Small internal gaps            |
| `sm`   | 12    | Component internal padding     |
| `md`   | 16    | Standard component padding     |
| `lg`   | 24    | Section spacing                |
| `xl`   | 32    | Large section spacing          |
| `xxl`  | 48    | Screen-level vertical rhythm   |
| `xxxl` | 64    | Hero sections                  |

### Usage Example

```tsx
import { StyleSheet } from 'react-native';
import { Spacing } from '@/constants';

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,        // 16
    marginBottom: Spacing.lg,   // 24
  },
  row: {
    gap: Spacing.xs,            // 8
  },
});
```

---

## Border Radius

| Token  | Value  | Usage                          |
|--------|--------|--------------------------------|
| `xs`   | 4      | Small elements, badges         |
| `sm`   | 8      | Inputs, tags, chips            |
| `md`   | 12     | Buttons                        |
| `lg`   | 16     | Cards, modals, bottom sheets   |
| `xl`   | 24     | Large surface containers       |
| `full` | 9999   | Pills, avatars, FABs           |

### Usage Example

```tsx
import { StyleSheet } from 'react-native';
import { Radius } from '@/constants';

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.md,   // 12
  },
  card: {
    borderRadius: Radius.lg,   // 16
  },
  avatar: {
    borderRadius: Radius.full, // circle
  },
});
```

---

## Shadows

PillBit uses minimal elevation. Prefer color/contrast over aggressive shadows.

| Token  | Elevation | Usage                       |
|--------|-----------|-----------------------------|
| `none` | 0         | Flat elements               |
| `sm`   | 2         | Subtle card/input separation|
| `card` | 4         | Standard card elevation     |
| `lg`   | 8         | Modals, bottom sheets       |

Use the `getShadowStyle(key)` helper for cross-platform safe styles:

```tsx
import { StyleSheet } from 'react-native';
import { getShadowStyle } from '@/constants';

const styles = StyleSheet.create({
  card: {
    ...getShadowStyle('card'),
  },
});
```

---

## Components

### Button

```tsx
import { Button } from '@/components';

// Primary
<Button label="Save Medication" onPress={handleSave} variant="primary" />

// Secondary
<Button label="View Details" onPress={handleView} variant="secondary" />

// Outline
<Button label="Cancel" onPress={handleCancel} variant="outline" />

// Disabled
<Button label="Save" onPress={handleSave} disabled />

// Loading
<Button label="Saving..." onPress={noop} loading />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Button text |
| `onPress` | `() => void` | required | Press handler |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Visual style |
| `loading` | `boolean` | `false` | Shows spinner, disables interaction |
| `disabled` | `boolean` | `false` | Disables the button |
| `accessibilityHint` | `string` | — | Screen reader hint |

---

### Card

```tsx
import { Card } from '@/components';

// Static card
<Card padded>
  <Text>Medication info</Text>
</Card>

// Pressable card
<Card
  onPress={handlePress}
  accessibilityLabel="View Aspirin details"
  padded
>
  <Text>Aspirin 500mg</Text>
</Card>

// Card without padding
<Card padded={false}>
  <Image source={medicationImage} style={{ borderRadius: 16 }} />
</Card>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Card content |
| `padded` | `boolean` | `true` | Apply default padding |
| `onPress` | `() => void` | — | Makes card pressable |
| `accessibilityLabel` | `string` | — | Required when pressable |

---

### Input

```tsx
import { Input } from '@/components';

// Basic
<Input
  label="Medication Name"
  placeholder="e.g. Aspirin 500mg"
  value={value}
  onChangeText={setValue}
/>

// With error
<Input
  label="Dose"
  placeholder="e.g. 500mg"
  value={dose}
  onChangeText={setDose}
  errorMessage="Dose is required"
/>

// Disabled
<Input label="Created At" value="2026-06-23" disabled />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Field label |
| `placeholder` | `string` | — | Placeholder text |
| `errorMessage` | `string` | — | Error text + triggers error border |
| `disabled` | `boolean` | `false` | Disables input |
| `accessibilityHint` | `string` | — | Screen reader hint |

---

### EmptyState

```tsx
import { EmptyState } from '@/components';

// Basic
<EmptyState
  title="No medications yet"
  description="Add your first medication to get started."
/>

// With action
<EmptyState
  title="No history found"
  description="Your consumption history will appear here once you start tracking."
  action={{ label: 'Add Medication', onPress: handleAdd }}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Main empty state heading |
| `description` | `string` | — | Supporting text |
| `action` | `{ label: string, onPress: () => void }` | — | Optional CTA button |

---

## Design Principles

1. **No hardcoded values** — Always use tokens from `@/constants`.
2. **Accessibility first** — 48dp minimum touch targets, proper roles and labels.
3. **Minimal elevation** — Use color/contrast before shadows.
4. **8px grid** — All spacing derives from the 8px base unit.
5. **Semantic naming** — Use `textPrimary`, not `#123043`.
