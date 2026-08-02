# PillBit Design System

Fuente única de verdad para todas las decisiones visuales de PillBit.
Todos los componentes, pantallas y features deben usar estos tokens exclusivamente. **Valores hardcodeados están prohibidos.**

---

## Principios de Diseño

| Principio | Regla |
|---|---|
| **Mobile First** | Diseñar para móvil primero. Soporte 320px → tablets. Layouts fluidos, sin tamaños fijos. Consistencia entre Android e iOS. |
| **Simplicidad** | Máximo una acción principal por pantalla. Lenguaje simple. Reducir pasos innecesarios. |
| **Accesibilidad** | Cumplir WCAG AA mínimo. Contraste adecuado. Escalado de texto. Áreas táctiles mínimas 48×48 dp. Compatible con lectores de pantalla. |
| **Consistencia** | Usar siempre el Design System. No crear variantes visuales sin justificación. |
| **Elevación mínima** | Preferir color/contraste antes que sombras agresivas. |
| **Semántica** | Usar nombres semánticos (`textPrimary`, no `#123043`). |

La app debe transmitir: **Confianza · Seguridad · Claridad · Modernidad · Accesibilidad para adultos mayores.**

---

## Import Pattern

```ts
import { Colors, Typography, Spacing, Radius, Shadows, theme } from '@/constants';
// o via objeto unificado:
const color = theme.colors.light.primary;
```

---

## Colors

### Light Theme

| Token | Value | Usage |
|---|---|---|
| `primary` | `#24C9EA` | CTAs, active states, tab highlights |
| `primaryLight` | `#7FD6EA` | Hover/pressed state of primary |
| `primaryContainer` | `#D6EDFB` | Chip/badge backgrounds, borders, dividers |
| `secondary` | `#C6CDF8` | Secondary actions, AI info badges |
| `accent` | `#FED7EE` | Decorative accents |
| `background` | `#F8FCFE` | Screen backgrounds |
| `surface` | `#FFFFFF` | Cards, modals, inputs |
| `surfaceVariant` | `#EEF8FC` | Subtle sections, disabled inputs |
| `cardBackground` | `#FFFFFF` | Card container background |
| `textPrimary` | `#123043` | Primary body text, headings |
| `textSecondary` | `#5D7482` | Subtitles, captions, hints |
| `textDisabled` | `#A6B4BE` | Disabled element labels |
| `success` | `#34C759` | Valid medications, success states |
| `warning` | `#FFB020` | Expiring soon, cautions |
| `error` | `#F04438` | Expired, validation errors |
| `info` | `#24C9EA` | Informational states |

### Dark Theme

| Token | Value |
|---|---|
| `background` | `#0B1720` |
| `surface` | `#122330` |
| `surfaceVariant` | `#193241` |
| `cardBackground` | `#17303F` |
| `textPrimary` | `#F5FAFC` |
| `textSecondary` | `#C2D3DD` |
| `textDisabled` | `#6E8592` |
| `primaryContainer` | `#1B6F83` |

### Estados de Medicamento

| Estado | Color |
|---|---|
| Vigente | `#34C759` (`success`) |
| Próximo a vencer | `#FFB020` (`warning`) |
| Vencido | `#F04438` (`error`) |
| Info IA | `#C6CDF8` (`secondary`) |

---

## Typography

Fuente: **Inter** (iOS: SF Pro, Android: Roboto, fallback: System Sans Serif).

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display` | 32 | 700 | 40 | Hero / splash text |
| `headingXL` | 28 | 700 | 36 | H1, screen titles |
| `headingLG` | 24 | 600 | 32 | H2, section titles |
| `headingMD` | 20 | 600 | 28 | H3, card titles |
| `bodyLG` | 18 | 400 | 28 | Emphasized body |
| `bodyMD` | 16 | 400 | 24 | Default body text |
| `bodySM` | 14 | 400 | 20 | Captions, labels |
| `caption` | 12 | 400 | 16 | Timestamps, hints |

```tsx
import { Typography, LightColors } from '@/constants';

const styles = StyleSheet.create({
  title: { ...Typography.headingXL, color: LightColors.textPrimary },
  body:  { ...Typography.bodyMD,   color: LightColors.textSecondary },
});
```

**Escalado de texto (Accesibilidad):** Normal · Grande · Extra Grande — gestionado por `useTheme` hook.

---

## Spacing

Base unit: **8px**. Nunca usar valores arbitrarios.

| Token | Value | Usage |
|---|---|---|
| `xxs` | 4 | Micro gaps (icon/text spacing) |
| `xs` | 8 | Small internal gaps |
| `sm` | 12 | Component internal padding |
| `md` | 16 | Standard component padding |
| `lg` | 24 | Section spacing |
| `xl` | 32 | Large section spacing |
| `xxl` | 48 | Screen-level vertical rhythm |
| `xxxl` | 64 | Hero sections |

```tsx
import { Spacing } from '@/constants';
// card: { padding: Spacing.md, marginBottom: Spacing.lg }
```

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `xs` | 4 | Small elements, badges |
| `sm` | 8 | Inputs, tags, chips |
| `md` | 12 | Buttons |
| `lg` | 16 | Cards, modals, bottom sheets |
| `xl` | 24 | Large surface containers |
| `full` | 9999 | Pills, avatars, FABs |

```tsx
import { Radius } from '@/constants';
// button: { borderRadius: Radius.md }  card: { borderRadius: Radius.lg }
```

---

## Shadows

Usar `getShadowStyle(key)` para estilos cross-platform.

| Token | Elevation | Usage |
|---|---|---|
| `none` | 0 | Flat elements |
| `sm` | 2 | Subtle card/input separation |
| `card` | 4 | Standard card elevation |
| `lg` | 8 | Modals, bottom sheets |

```tsx
import { getShadowStyle } from '@/constants';
// card: { ...getShadowStyle('card') }
```

---

## Animaciones

| Duración | Uso |
|---|---|
| 150 ms | Micro-interacciones (press, toggle) |
| 200 ms | Transiciones de estado |
| 300 ms | Entradas/salidas de pantalla |

Usar curvas suaves. Evitar animaciones excesivas.

---

## Navigation

**Bottom Tab Bar** — máximo 5 elementos:
- Inicio · Medicamentos · Historial · Alertas · Configuración
- Active tint: `#24C9EA` | Inactive tint: `#5D7482` (light) / `#C2D3DD` (dark)
- Icons: expo-symbols (SF Symbols en iOS, Material Icons en Android)

---

## Components API

### Button

```tsx
import { Button } from '@/components';
<Button label="Save" onPress={handleSave} variant="primary" />
<Button label="Cancel" onPress={handleCancel} variant="outline" />
<Button label="Saving..." onPress={noop} loading />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | required | Button text |
| `onPress` | `() => void` | required | Press handler |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Visual style |
| `loading` | `boolean` | `false` | Shows spinner, disables interaction |
| `disabled` | `boolean` | `false` | Disables the button |
| `accessibilityHint` | `string` | — | Screen reader hint |

Specs: fondo `primary`, texto blanco, altura mínima 48dp, `borderRadius: Radius.md`.

### Card

```tsx
import { Card } from '@/components';
<Card padded onPress={handlePress} accessibilityLabel="Ver Aspirina">
  <Text>Aspirin 500mg</Text>
</Card>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Card content |
| `padded` | `boolean` | `true` | Apply default padding (Spacing.md) |
| `onPress` | `() => void` | — | Makes card pressable |
| `accessibilityLabel` | `string` | — | Required when pressable |

Specs: `borderRadius: Radius.lg`, `padding: Spacing.md`, sombra suave (`getShadowStyle('card')`).

### Input

```tsx
import { Input } from '@/components';
<Input label="Medication Name" placeholder="e.g. Aspirin 500mg" value={value} onChangeText={setValue} />
<Input label="Dose" value={dose} onChangeText={setDose} errorMessage="Dose is required" />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Field label |
| `placeholder` | `string` | — | Placeholder text |
| `errorMessage` | `string` | — | Error text + triggers error border |
| `disabled` | `boolean` | `false` | Disables input |
| `accessibilityHint` | `string` | — | Screen reader hint |

### EmptyState

```tsx
import { EmptyState } from '@/components';
<EmptyState
  title="No medications yet"
  description="Add your first medication to get started."
  action={{ label: 'Add Medication', onPress: handleAdd }}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | required | Main empty state heading |
| `description` | `string` | — | Supporting text |
| `action` | `{ label: string, onPress: () => void }` | — | Optional CTA button |

### DoseTodayPanel

```tsx
import { DoseTodayPanel } from '@/features/history/components/DoseTodayPanel';
<DoseTodayPanel medicationId={42} medicationName="Aspirina" />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `medicationId` | `number` | required | The medication to show today's schedule for |
| `medicationName` | `string` | required | Used for accessibility labels |

Muestra la lista de recordatorios de hoy para un medicamento con botones Tomar/Omitir/Posponer y badges de estado.

### MedicationHistoryList

```tsx
import { MedicationHistoryList } from '@/features/history/components/MedicationHistoryList';
<MedicationHistoryList medicationId={42} />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `medicationId` | `number` | required | Medication whose history to display |

Lista paginada (30 por página) del historial de dosis con filtro bar (Todos / Tomados / Omitidos / Pospuestos).

---

## Responsive Design

| Breakpoint | Rango | Ajuste |
|---|---|---|
| Teléfono pequeño | 320–360 px | Reducir padding horizontal |
| Teléfono estándar | 375–430 px | Diseño base |
| Tablet | >600 px | Master Detail / Paneles adaptativos |

---

## Accesibilidad (Implementación)

- Todos los elementos interactivos deben tener `accessibilityLabel`, `accessibilityHint` y `accessibilityRole`.
- Área táctil mínima: **48×48 dp**.
- Contraste: **WCAG AA mínimo**.
- Escalado de texto: gestionado por `useTheme` (Normal / Grande / Extra Grande).
- Soporte para lectores de pantalla (VoiceOver / TalkBack).

---

## UX Best Practices

- Confirmar acciones destructivas con diálogo explícito.
- Mostrar estados vacíos amigables (`EmptyState`).
- Proveer feedback inmediato (toasts, loaders).
- Usar skeleton loaders para carga de datos.
- Mantener consistencia visual entre pantallas.
- Máximo una acción principal por pantalla.
