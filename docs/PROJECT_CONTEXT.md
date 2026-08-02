# PillBit Project Context

## Project Overview

PillBit es una aplicación React Native / Expo para gestionar medicamentos, programar recordatorios, registrar historial de consumo y recibir alertas de vencimiento y stock bajo. Usa una arquitectura local-first con SQLite (`expo-sqlite`). **Sin backend. Sin cuentas de usuario. Sin sincronización en la nube.**

**Stack:** React Native + Expo · TypeScript (strict) · Expo Router · NativeWind v4 + Tailwind v3 · Zustand · SQLite (`expo-sqlite`) · OpenRouter/Anthropic AI

Para referencias completas ver:
- Arquitectura y capas → `docs/ARCHITECTURE.md`
- Convenciones de código → `docs/CONVENTIONS.md`
- Base de datos → `docs/DATABASE_ARCHITECTURE.md`
- Design System (tokens, componentes) → `docs/DESIGN_SYSTEM.md`
- Especificación funcional → `docs/PillBit.md`
- Guía de desarrollo → `docs/DEVELOPMENT_GUIDE.md`

## Flujos Principales

1.  **Registro de Dosis:** El usuario toma u omite (Tomar/Omitir) un medicamento programado. Ya no se soporta posponer.
2.  **Gestión de Vencimiento:** Alertas de vencimiento se muestran a los usuarios. Los medicamentos vencidos se pueden "Desechar", lo cual los oculta del inventario activo y cancela sus alertas.
3.  **Consulta de Historial:** Vista detallada de las dosis tomadas y omitidas, con soporte para filtrar por fecha y estado.

---

## Architecture Decisions

### Clean Architecture Data Layer (2026-06-17)
SQLite access aislado de la lógica de negocio mediante Repository Pattern. Los modelos son independientes de la implementación de la DB.

### Migration System (2026-06-17)
Migraciones incrementales en TypeScript (no `.sql` raw por limitaciones de Metro). Tabla interna `_migrations` para tracking de versión.

### Expo Router (tabs) Route Group (2026-06-23)
Separación limpia del Bottom Tab Navigator con `(tabs)` route group. Permite futuros grupos `(modals)`, `(auth)` sin refactorizar tabs.

### Constants-Only Design System (2026-06-23)
Tokens puros en TypeScript en `src/constants/`. Compatible con `StyleSheet.create` y NativeWind `className`. Sin dependencia de librerías de theming.

### NativeWind v4 + Tailwind CSS v3 (2026-06-23)
Versión compatible con Expo 56 / RN 0.85. Integrado vía `jsxImportSource: 'nativewind'` en Babel y `withNativeWind` en Metro.

### expo-symbols para Tab Icons (2026-06-23)
SF Symbols en iOS, Material Icons en Android. Dependencia ya incluida, sin overhead adicional.

### Local Notification Sync via Payload (2026-06-30)
*   **Gestión del Ciclo de Vida:** CRUD completo, notificaciones de dosis y estado (Activo, Expirado, Desechado).
*   **Gestión de Expiración:** Monitoreo activo de fechas de caducidad con alertas automatizadas e interfaz dedicada para desechar.

### Dynamic Theming & Scaling via useTheme Hook (2026-07-09)
Soporte de Alto Contraste y Escalado de Texto sin reiniciar la app. El hook `useTheme` lee la config de SQLite/Zustand y computa tipografía y paleta en tiempo de ejecución.

### OpenRouter AI Architecture (2026-07-09)
Generación estructurada de información educativa de medicamentos. Lógica en `OpenRouterService`, estado en `useAIStore`, persistencia en `MedicationAiInformationRepository` como cache local.

---

## Navigation Structure

```
/                   → Home tab         (src/app/(tabs)/index.tsx)
/medications        → Medications tab  (src/app/(tabs)/medications/)
/medications/create → Create form
/medications/[id]   → Detail screen
/medications/[id]/edit     → Edit form
/medications/[id]/reminders → Reminder management
/medications/[id]/dose-history → Dose history per medication
/medications/expiring → Expiring soon list
/medications/expired  → Expired list
/history            → History tab      (src/app/(tabs)/history.tsx)
/settings           → Settings tab     (src/app/(tabs)/settings.tsx)
```

---

## Implemented Features

| Módulo | Ubicación | Estado |
|---|---|---|
| Database (SQLite + Repos) | `src/database/` | ✅ |
| Medication CRUD | `src/features/medication/` | ✅ |
| Reminder Management | `src/features/reminder/` | ✅ |
| Consumption History | `src/features/history/` | ✅ |
| Dose Log per Medication | `src/features/history/` | ✅ |
| Expiration Monitoring | `src/features/expiration/` | ✅ |
| Settings & Accessibility | `src/app/(tabs)/settings.tsx` | ✅ |
| AI Medication Info (OpenRouter) | `src/services/OpenRouterService.ts` | ✅ |
| Dynamic Theme (`useTheme`) | `src/hooks/` | ✅ |
| TTS (`expo-speech`) | `src/services/` | ✅ |

### Shared Components
- `Button` — primary / secondary / outline, loading state
- `Card` — static y pressable
- `Input` — label, error, disabled
- `EmptyState` — con CTA opcional
- `DoseTodayPanel` — panel de dosis de hoy por medicamento con Tomar/Omitir
- `MedicationHistoryList` — lista paginada del historial por medicamento con filtros

---

## Pending Work

- Home Feature (Dashboard UI)
- Dark mode en componentes (actualmente solo tokens light en StyleSheet)
- Tests automatizados (Jest no integrado aún)
- Voice Input completo

---

## Known Limitations

- Sin sincronización cloud (SQLite local únicamente)
- Sin cuentas de usuario
- Migraciones en TS strings (limitación de Metro con `.sql` raw)
- Componentes usan `LightColors` directo — dark mode requiere `useColorScheme()` por componente o Context Provider

---

## Changelog

### v1.0.0
- AI: Implement daily rate limits and robust prompt validation.
- AI: Translate AI info, add dosage/administration, and notify in background.
- Dashboard: Enhance home screen with pull-to-refresh and prioritize pending doses.
- Medications: Enhance TTS reading capabilities and remove unused Voice Input.
- History/Reminders: Replace low stock tracking with dose history and postpone feature.
- I18n: Add missing translation for the Back button in Reminders screen.
- Medications: Add header, back button and safe area to expiration screens.
- Config: Move notification settings to expo-notifications plugin schema.
- Chore: Fix TypeScript errors and clean up unused variables/imports.

### v0.7.0
- Dose Log per Medication: `DoseTodayPanel`, `MedicationHistoryList`, `DoseLogService`, `useDoseLogStore`
- Nueva pantalla `/medications/[id]/dose-history`
- Botones Tomar/Omitir con horario del recordatorio en `MedicationDetailScreen`
- Traducciones completas en `es.json` y `en.json` (clave `doseLog.*`)
- Límite de 1 petición por día a la IA en entorno de producción (migración `009_ai_request_limit`)

### v0.2.0
- Application Branding: configured application icons and splash assets in app.json.
- Settings: added theme selection and fixed dark mode contrast.
- I18n: implemented full internationalization for medications, history, reminders, and settings modules.

### v0.6.0
- Application Branding & Asset Structure (`assets/icons/`: icon, adaptive-icon, monochrome-icon, notification-icon, splash-icon, favicon)
- Settings & Configuration Module (`useConfigStore`, migración `002_ai_settings.ts`)
- Theme & Accessibility Architecture (`useTheme` hook: escalado de texto, alto contraste, Theme toggle en Ajustes)
- AI Integration (OpenRouter/Anthropic) con cache local en `pbt_medication_ai_information`
- TTS con `expo-speech`
- Scaffolding Voice Input (`expo-speech-recognition`)

### v0.5.0
- Consumption History Module (`features/history`, `HistoryCard`, `HistoryFilterBar`)
- "Log Dose" (Taken/Skip) en `MedicationDetailScreen`
- Expiration Monitoring Module (`features/expiration`, `ExpirationService`)
- Pantallas `/medications/expiring` y `/medications/expired`
- `NotificationService.syncExpirationAlerts()`

### v0.4.0
- Reminder Module completo
- `expo-notifications` para scheduling diario local
- `NotificationService`, `ReminderManagementScreen`, `ReminderForm`, `ReminderItem`
- `useReminderStore` orquestando SQLite + NotificationService

### v0.3.0
- Medication Module completo (CRUD) con Zustand + react-hook-form + zod
- Tabs de medication refactorizados a nested Expo Router Stack
- `MedicationCard`, `MedicationStatusBadge`

### v0.2.0
- Navegación base (Expo Router, Bottom Tabs, 4 tabs)
- NativeWind v4 + Tailwind v3 instalado y configurado
- Design System tokens creados
- Shared components: Button, Card, Input, EmptyState

### v0.1.1
- Fix bugs de update queries (eliminado COALESCE bug)
- DTOs endurecidos con `type | null`

### v0.1.0
- Fundación de base de datos
- Migraciones iniciales
- Domain models, DTOs, Repositories
