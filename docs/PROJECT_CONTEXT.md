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
└─ database/
   ├─ adapters/
   ├─ dto/
   ├─ helpers/
   ├─ migrations/
   ├─ models/
   ├─ queries/
   ├─ repositories/
   └─ index.ts
```

---

## Implemented Components

* **Database Initialization & Adapter**: Connects to `expo-sqlite`. Located in `adapters/sqlite.ts`.
* **Migration Runner**: Tracks and applies pending schemas. Located in `migrations/runner.ts`.
* **Domain Models & DTOs**: TypeScript definitions. Located in `models/` and `dto/`.
* **Repository Layer**: CRUD for each entity. Located in `repositories/`.
* **Query Layer**: Complex cross-entity reads. Located in `queries/MedicationQueries.ts`.
* **Transaction Helper**: Wraps `withTransactionAsync`. Located in `helpers/transaction.ts`.

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

---

## Files Modified
(None yet)

---

## Technical Conventions
* **TypeScript Standards**: Strict typing, Interfaces for models, DTOs for mutations.
* **SQL Standards**: `pbt_` prefix, soft-deletes via timestamps, `snake_case` in DB but `camelCase` in TS models.
* **Architecture**: Repository pattern, separation of concerns.

---

## Validation

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

---

## Pending Work
* Implement State Management (Zustand)
* Implement Reminder Scheduling Logic (Expo Notifications)
* Implement Notification Service
* Implement Screens and UI Components

---

## Known Limitations
* No cloud synchronization (Local SQLite only)
* No user accounts
* Migrations are currently defined via TS strings due to RN Metro bundler limitations with raw .sql files.
* Automated tests (Jest) are not yet integrated into the repository.

---

## Changelog

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
