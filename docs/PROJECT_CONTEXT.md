# PillBit Project Context

## Project Overview
PillBit is a React Native / Expo application for managing medications, scheduling reminders, tracking consumption history, and receiving expiration and low stock alerts. It uses a local-first SQLite database architecture.

---

## Architecture Decisions

### Decision: Clean Architecture Data Layer
**Date:** 2026-06-17
**Reason:** SQLite access must be isolated from business logic. Models must be independent of database implementation.
**Alternatives:**
* Direct database access
* Service-only architecture
**Status:** Accepted

### Decision: Repository Pattern
**Date:** 2026-06-17
**Reason:** Centralize and encapsulate CRUD operations for each domain entity.
**Alternatives:**
* Active Record
**Status:** Accepted

### Decision: Migration System
**Date:** 2026-06-17
**Reason:** Need to support structured, incremental schema updates over time without losing user data.
**Status:** Accepted

### Decision: Expo Router (tabs) Route Group for Navigation
**Date:** 2026-06-23
**Reason:** Using Expo Router's file-based routing with a `(tabs)` route group cleanly separates the Bottom Tab Navigator from the root layout. This follows Expo Router conventions and allows future route groups (e.g., `(modals)`, `(auth)`) without refactoring the tab structure.
**Alternatives:**
* Single-level Stack with manual tab navigation
* React Navigation standalone (without Expo Router)
**Status:** Accepted

### Decision: Constants-Only Design System (No Theming Library)
**Date:** 2026-06-23
**Reason:** Consistent with `ARCHITECTURE.md` — shared code lives in `src/constants/`. A pure TypeScript token system avoids additional dependencies and stays compatible with both `StyleSheet.create` (used in components) and NativeWind `className` props. No theme context required at this stage.
**Alternatives:**
* Shopify Restyle
* React Navigation ThemeContext
**Status:** Accepted

### Decision: NativeWind v4 + Tailwind CSS v3
**Date:** 2026-06-23
**Reason:** NativeWind v4 is the version compatible with Expo 56 / React Native 0.85. It integrates via `jsxImportSource: 'nativewind'` in Babel and `withNativeWind` in Metro — no separate Babel plugin needed.
**Status:** Accepted

### Decision: expo-symbols for Tab Icons
**Date:** 2026-06-23
**Reason:** `expo-symbols` is already installed and provides native SF Symbols on iOS and Material Icons on Android — zero additional dependencies and consistent with the existing project dependencies.
**Status:** Accepted

### Decision: Local Notification Synchronization via Payload
**Date:** 2026-06-30
**Reason:** Instead of altering the SQLite schema to save Expo Notification identifiers, we inject `reminderId` into the notification `data` payload. We then query the OS's scheduled notifications to sync, update, or cancel specific reminders.
**Alternatives:**
* Add `expo_notification_id` to `pbt_medication_reminder`
**Status:** Accepted

---

## Database
**Tables:**
* `pbt_medication` (Main registry, soft deletes)
* `pbt_medication_reminder` (Configured schedules)
* `pbt_medication_ai_information` (Generated AI educational info)
* `pbt_expiration_alert` (Expiration warnings)
* `pbt_consumption_record` (Action tracking)
* `pbt_notification_log` (History of sent alerts)
* `pbt_application_setting` (Singleton config)

**Relationships:**
* Medication 1:N Reminders, Expiration Alerts, Consumption Records
* Medication 1:1 AI Info
* Triggers exist for soft delete cascading.

**Naming conventions:** `pbt_` table prefix, entity specific column prefixes (e.g., `mdc_id`).
**Migration strategy:** Incremental TS/SQL migrations tracked via `_migrations` table.
**Version history:** v2.0 (Initial schema implementation).

---

## Folder Structure

```text
src/
├── app/
│   ├── _layout.tsx          # Root layout (CSS, SafeAreaProvider, ThemeProvider)
│   ├── index.tsx            # Redirect to /(tabs)
│   └── (tabs)/
│       ├── _layout.tsx      # Bottom Tab Navigator
│       ├── index.tsx        # Home screen (/)
│       ├── medications.tsx  # Medications screen (/medications)
│       ├── history.tsx      # History screen (/history)
│       └── settings.tsx     # Settings screen (/settings)
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── EmptyState.tsx
│   └── index.ts             # Barrel export
├── constants/
│   ├── colors.ts            # Color tokens (light + dark)
│   ├── typography.ts        # Type scale tokens
│   ├── spacing.ts           # Spacing tokens (8px base)
│   ├── radius.ts            # Border radius tokens
│   ├── shadows.ts           # Shadow/elevation tokens
│   ├── theme.ts             # Unified theme object
│   └── index.ts             # Barrel export
├── database/
│   ├── adapters/
│   ├── dto/
│   ├── helpers/
│   ├── migrations/
│   ├── models/
│   ├── queries/
│   ├── repositories/
│   └── index.ts
├── features/                # Domain-specific modules (e.g. medication, reminder)
├── hooks/                   # Shared custom hooks
├── lib/                     # Third-party setups (e.g. zustand)
├── services/                # External/Device services (e.g. NotificationService)
├── types/                   # Shared types
├── utils/                   # Shared utilities
└── global.css               # NativeWind/Tailwind entry point
```

---

## Navigation Structure

```text
/                   → Home tab (src/app/(tabs)/index.tsx)
/medications        → Medications tab (src/app/(tabs)/medications.tsx)
/history            → History tab (src/app/(tabs)/history.tsx)
/settings           → Settings tab (src/app/(tabs)/settings.tsx)
```

**Tab Bar:**
- Active tint: `#24C9EA` (primary)
- Inactive tint: `#5D7482` (textSecondary light) / `#C2D3DD` (dark)
- Icons: expo-symbols SF Symbols (house.fill, pills.fill, clock.fill, gearshape.fill)

---

## Design System

Tokens are defined in `src/constants/` and importable via `@/constants`.

**Colors:** Light + Dark theme, semantic naming (textPrimary, background, primary, etc.)
**Typography:** 8-level scale (display → caption) with explicit fontWeight + lineHeight
**Spacing:** 8px base unit (xxs=4, xs=8, sm=12, md=16, lg=24, xl=32, xxl=48, xxxl=64)
**Radius:** xs=4, sm=8, md=12, lg=16, xl=24, full=9999
**Shadows:** Minimal elevation (none, sm, card, lg) with cross-platform `getShadowStyle()`

See `docs/DESIGN_SYSTEM.md` for full token reference and usage examples.

---

## Implemented Components

* **Database Initialization & Adapter**: Connects to `expo-sqlite`. Located in `adapters/sqlite.ts`.
* **Migration Runner**: Tracks and applies pending schemas. Located in `migrations/runner.ts`.
* **Domain Models & DTOs**: TypeScript definitions. Located in `models/` and `dto/`.
* **Repository Layer**: CRUD for each entity. Located in `repositories/`.
* **Query Layer**: Complex cross-entity reads. Located in `queries/MedicationQueries.ts`.
* **Transaction Helper**: Wraps `withTransactionAsync`. Located in `helpers/transaction.ts`.
* **Button**: Reusable button with primary/secondary/outline variants, loading state. Located in `components/Button.tsx`.
* **Card**: Surface container supporting static and pressable modes. Located in `components/Card.tsx`.
* **Input**: Text input with label, error message, and disabled state. Located in `components/Input.tsx`.
* **EmptyState**: Zero-data placeholder with optional action. Located in `components/EmptyState.tsx`.

---

## Files Created

### 2026-06-17
Created:
* `src/database/adapters/sqlite.ts`
* `src/database/migrations/001_initial_schema.ts`
* `src/database/migrations/runner.ts`
* `src/database/models/index.ts`
* `src/database/dto/index.ts`
* `src/database/helpers/errors.ts`
* `src/database/helpers/transaction.ts`
* `src/database/repositories/MedicationRepository.ts`
* `src/database/repositories/MedicationReminderRepository.ts`
* `src/database/repositories/MedicationAiInformationRepository.ts`
* `src/database/repositories/ExpirationAlertRepository.ts`
* `src/database/repositories/ConsumptionRecordRepository.ts`
* `src/database/repositories/NotificationLogRepository.ts`
* `src/database/repositories/ApplicationSettingRepository.ts`
* `src/database/queries/MedicationQueries.ts`
* `src/database/index.ts`
* `docs/PROJECT_CONTEXT.md`
* `docs/DATABASE_ARCHITECTURE.md`

### 2026-06-23
Created:
* `babel.config.js`
* `metro.config.js`
* `tailwind.config.js`
* `nativewind-env.d.ts`
* `src/app/(tabs)/_layout.tsx`
* `src/app/(tabs)/index.tsx`
* `src/app/(tabs)/medications.tsx`
* `src/app/(tabs)/history.tsx`
* `src/app/(tabs)/settings.tsx`
* `src/constants/colors.ts`
* `src/constants/typography.ts`
* `src/constants/spacing.ts`
* `src/constants/radius.ts`
* `src/constants/shadows.ts`
* `src/constants/theme.ts`
* `src/constants/index.ts`
* `src/components/Button.tsx`
* `src/components/Card.tsx`
* `src/components/Input.tsx`
* `src/components/EmptyState.tsx`
* `src/components/index.ts`
* `docs/DESIGN_SYSTEM.md`

### 2026-06-26
Created:
* `src/features/medication/components/MedicationCard.tsx`
* `src/features/medication/components/MedicationStatusBadge.tsx`
* `src/features/medication/hooks/useMedicationForm.ts`
* `src/features/medication/screens/MedicationListScreen.tsx`
* `src/features/medication/screens/MedicationDetailScreen.tsx`
* `src/features/medication/screens/CreateMedicationScreen.tsx`
* `src/features/medication/screens/EditMedicationScreen.tsx`
* `src/features/medication/store/useMedicationStore.ts`
* `src/features/medication/types/index.ts`
* `src/features/medication/utils/medicationUtils.ts`
* `src/features/medication/index.ts`
* `src/app/(tabs)/medications/_layout.tsx`
* `src/app/(tabs)/medications/index.tsx`
* `src/app/(tabs)/medications/create.tsx`
* `src/app/(tabs)/medications/[id].tsx`
* `src/app/(tabs)/medications/[id]/edit.tsx`

### 2026-06-30
Created:
* `src/features/reminder/types/index.ts`
* `src/features/reminder/store/useReminderStore.ts`
* `src/features/reminder/screens/ReminderManagementScreen.tsx`
* `src/features/reminder/components/ReminderForm.tsx`
* `src/features/reminder/components/ReminderItem.tsx`
* `src/services/NotificationService.ts`
* `src/app/(tabs)/medications/[id]/reminders.tsx`

### 2026-06-30 (Week 4)
Created:
* `src/database/queries/ConsumptionQueries.ts`
* `src/features/history/types/index.ts`
* `src/features/history/services/HistoryService.ts`
* `src/features/history/store/useHistoryStore.ts`
* `src/features/history/components/HistoryCard.tsx`
* `src/features/history/components/HistoryFilterBar.tsx`
* `src/features/history/components/HistoryEmptyState.tsx`
* `src/features/history/components/index.ts`
* `src/features/history/index.ts`
* `src/features/expiration/types/index.ts`
* `src/features/expiration/services/ExpirationService.ts`
* `src/features/expiration/store/useExpirationStore.ts`
* `src/features/expiration/components/ExpirationCard.tsx`
* `src/features/expiration/index.ts`
* `src/app/(tabs)/medications/expiring.tsx`
* `src/app/(tabs)/medications/expired.tsx`

---

## Files Modified

### 2026-06-23
Modified:
* `src/app/_layout.tsx` — Replaced with root layout (global.css import, SafeAreaProvider, GestureHandlerRootView, ThemeProvider from expo-router)
* `src/app/index.tsx` — Replaced with redirect to `/(tabs)`
* `src/global.css` — Added `@tailwind` directives for NativeWind
* `tsconfig.json` — Added `nativewind-env.d.ts` to includes
* `package.json` — Added `nativewind@4.2.5` and `tailwindcss@3.4.19`

### 2026-06-26
Modified:
* `src/app/_layout.tsx` — Wired up `initDatabase()` call to initialize SQLite on mount.
* `src/app/(tabs)/_layout.tsx` — Replaced `medications.tsx` reference to correctly work with the nested Stack group under `(tabs)/medications`.
* `tsconfig.json` — Added `"types": ["jest"]` for proper test compilation.
Deleted:
* `src/app/(tabs)/medications.tsx` — Replaced by the nested directory structure.

### 2026-06-30
Modified:
* `src/app/_layout.tsx` — Added `NotificationService.syncReminders()` and `NotificationService.syncExpirationAlerts()` on app startup.
* `src/database/queries/MedicationQueries.ts` — Added `getRemindersByMedicationId`.
* `src/app/(tabs)/medications/_layout.tsx` — Added route for `[id]/reminders`.
* `src/features/medication/screens/MedicationDetailScreen.tsx` — Added "Manage Reminders" and "Log Dose" actions.
* `src/features/medication/screens/MedicationListScreen.tsx` — Added "Expiring Soon" and "Expired" links.
* `src/features/medication/store/useMedicationStore.ts` — Call `ExpirationService` and `NotificationService` after creation/updates.
* `src/services/NotificationService.ts` — Added `syncExpirationAlerts()`.
* `src/app/(tabs)/history.tsx` — Implemented consumption history view.
* `package.json` — Added `expo-notifications`.

---

## Technical Conventions
* **TypeScript Standards**: Strict typing, Interfaces for models, DTOs for mutations.
* **SQL Standards**: `pbt_` prefix, soft-deletes via timestamps, `snake_case` in DB but `camelCase` in TS models.
* **Architecture**: Repository pattern, separation of concerns.
* **Components**: Dumb components only in `src/components/`. No Zustand, no service calls.
* **Styling**: `StyleSheet.create` for components (zero NativeWind className until needed per feature). Tokens from `@/constants` only.
* **Navigation**: Expo Router file-based routing. Route groups for tab/modal/auth separation.

---

## Validation

### 2026-06-17
**Date**: 2026-06-17
**Status**: ✅ Approved

**Executed Validations**:
- Architecture Audit (Clean Architecture & Repository Pattern)
- Database Schema and Migration Safety
- Type strictness and nullability checks
- Code Quality and Mutation Logic Review

**Findings & Fixes**:
- **Critical Finding**: Repositories were using `COALESCE(?, field)` for updates. This prevented clearing nullable fields because passing `null` would default to the existing value.
- **Fix**: Refactored all repository `update` methods to fetch the current record, merge it with the DTO changes in TypeScript, and perform a strict `UPDATE` without `COALESCE`.
- **Finding**: DTO optional fields lacked explicit `null` typing.
- **Fix**: Updated `dto/index.ts` to type optional fields as `type | null`.
- **Finding**: `mapRow` was utilizing `any`.
- **Fix**: Stricter typing using `Record<string, any>` across all repositories.

### 2026-06-23
**Date**: 2026-06-23
**Status**: ✅ Approved

**Executed Validations**:
- `pnpm tsc --noEmit` — Zero errors (strict mode)
- `pnpm expo lint` — No lint errors

**Findings & Fixes**:
- **Finding**: `DarkTheme`/`ThemeProvider` imported from `@react-navigation/native` which is not a direct dependency.
- **Fix**: Changed import to `expo-router` which re-exports them.
- **Finding**: `useColorScheme()` returns `ColorSchemeName` which includes `'unspecified'` — not assignable to `'light' | 'dark'`.
- **Fix**: Added explicit type narrowing: `const colorScheme: 'light' | 'dark' = rawScheme === 'dark' ? 'dark' : 'light'`.
- **Finding**: CSS side-effect import raised TS2882 error.
- **Fix**: Added `declare module '*.css'` to `nativewind-env.d.ts`.

### 2026-06-26
**Date**: 2026-06-26
**Status**: ✅ Approved

**Executed Validations**:
- `pnpm tsc --noEmit` — Zero errors (strict mode)
- `pnpm expo lint` — No lint errors

**Findings & Fixes**:
- **Finding**: `@hookform/resolvers` and latest `zod` versions had type incompatibilities.
- **Fix**: Downgraded `zod` to `3.23.8`.
- **Finding**: Jest types were not loaded globally, causing test file type errors.
- **Fix**: Added `"types": ["jest"]` to `tsconfig.json`.
- **Finding**: Linter warned about calling setState synchronously within useEffect in Detail and Edit screens.
- **Fix**: Derived state synchronously during render instead of in useEffect.

---

## Pending Work
* Implement Home Feature (Dashboard UI)
* Implement History Feature (Consumption log UI)
* Implement Settings Feature (App settings UI)
* Implement dark mode support in components (currently light-only tokens in StyleSheet)

---

## Known Limitations
* No cloud synchronization (Local SQLite only)
* No user accounts
* Migrations are currently defined via TS strings due to RN Metro bundler limitations with raw .sql files.
* Automated tests (Jest) are not yet integrated into the repository.
* Components currently use `LightColors` only — dark mode requires hooking into `useColorScheme()` per component or a React Context provider.

---

## Changelog

### v0.5.0 (Week 4 Scope)
* Implemented Consumption History Module (`features/history`).
* Created `ConsumptionRecordRepository` wrapper and `ConsumptionQueries`.
* Added `HistoryCard`, `HistoryFilterBar`, and wired them into `/history` tab.
* Added "Log Dose" (Take, Skip, Postpone) quick actions to `MedicationDetailScreen`.
* Implemented Expiration Monitoring Module (`features/expiration`).
* Created `ExpirationService` to generate alerts and `useExpirationStore`.
* Added `/medications/expiring` and `/medications/expired` screens with `ExpirationCard`.
* Updated `NotificationService` to handle `syncExpirationAlerts()`.

### v0.4.0
* Implemented complete Reminder Module.
* Integrated `expo-notifications` for local daily scheduling.
* Added `NotificationService` to handle graceful permission requests and synchronization logic.
* Added `ReminderManagementScreen`, `ReminderForm`, and `ReminderItem` UI components.
* Created `useReminderStore` to orchestrate SQLite and Notification Service.
* Wired up App Startup recovery for missing notifications.

### v0.3.0
* Implemented complete Medication Module (CRUD).
* Integrated `zustand` for state management, strictly talking to the `MedicationRepository`.
* Integrated `react-hook-form` and `zod` for form validation.
* Refactored Medication Tab to use a nested Expo Router Stack for detailed navigation (`create`, `[id]`, `[id]/edit`).
* Created `MedicationCard` and `MedicationStatusBadge` UI components.
* Wired up SQLite initialization (`initDatabase()`) on root app mount.

### v0.2.0
* Navigation foundation implemented (Expo Router, Bottom Tabs, 4 tabs).
* NativeWind v4 + Tailwind CSS v3 installed and configured.
* Design system tokens created (colors, typography, spacing, radius, shadows).
* Shared components created: Button, Card, Input, EmptyState.
* `docs/DESIGN_SYSTEM.md` created.
* TypeScript strict mode validated (zero errors).

### v0.1.1
* Fixed update query bugs across all repositories (Removed COALESCE bug).
* Hardened TypeScript interfaces for DTOs and `mapRow` methods.
* Performed complete architecture validation.

### v0.1.0
* Database foundation created
* Initial migrations added
* Domain models and DTOs created
* Repository layer implemented
* Custom query helpers added
