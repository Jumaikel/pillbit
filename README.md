<div align="center">
  <img src="assets/icons/logo.png" alt="PillBit Logo" width="120" />
  <h1>PillBit</h1>
  <p>A privacy-first, local-only medication management and reminder application built with React Native and Expo.</p>
</div>

---

## Overview

PillBit is a comprehensive mobile application designed to manage medications, schedule reminders, log consumption history, and provide alerts for expiring or low-stock medications. 

It is built with a **local-first architecture**. There is no backend, no user accounts, and no cloud synchronization. All data is securely stored directly on the device using an internal SQLite database, ensuring maximum privacy and uninterrupted offline availability.

## Key Features

- **Medication Management**: Comprehensive tracking of medications, including dosage, stock levels, and custom instructions.
- **Smart Reminders**: Local, reliable scheduled push notifications to ensure timely medication intake.
- **Consumption History**: Detailed tracking and logging of medication doses (taken, skipped, or postponed).
- **Expiration & Stock Monitoring**: Proactive alerts for medications nearing expiration dates or running low on stock.
- **AI-Powered Insights**: Structured educational information about medications generated via OpenRouter/Anthropic AI, cached locally for offline reference.
- **Accessibility Focused**: Dynamic theming, high-contrast modes, dynamic text scaling, and Text-to-Speech (TTS) integration.
- **Full Localization**: Robust internationalization (i18n) support across all modules and interfaces.

## Architecture & Technology Stack

PillBit follows a Clean Architecture approach with a robust local data layer, isolating SQLite access via a Repository Pattern. The UI is built using a custom Constants-Only Design System compatible with NativeWind.

- **Framework**: React Native & Expo
- **Language**: TypeScript (Strict Mode)
- **Routing**: Expo Router (File-based routing with route groups)
- **Styling**: NativeWind v4 & Tailwind CSS v3
- **State Management**: Zustand
- **Database**: `expo-sqlite` with a custom incremental TypeScript migration system
- **Forms & Validation**: `react-hook-form` & Zod

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [pnpm](https://pnpm.io/) package manager
- Expo Go app on your physical device, or an iOS Simulator / Android Emulator setup

### Installation

1. Install project dependencies using pnpm:
   ```bash
   pnpm install
   ```

2. Start the Expo development server:
   ```bash
   pnpm start
   ```

### Running the Application

- **Android**: Press `a` in the Expo terminal or run `pnpm android`.
- **iOS**: Press `i` in the Expo terminal or run `pnpm ios`.
- **Web**: Press `w` in the Expo terminal or run `pnpm web`.

## Documentation Reference

For more detailed information regarding the project structure and development conventions, please refer to the internal documentation:

- **[Project Context](./docs/PROJECT_CONTEXT.md)**: Overall architecture decisions, feature status, and known limitations.
- **[Architecture](./docs/ARCHITECTURE.md)**: Details on separation of concerns, layers, imports, and routing.
- **[Database Architecture](./docs/DATABASE_ARCHITECTURE.md)**: SQLite domain models, schema migrations, and repositories.
- **[Conventions](./docs/CONVENTIONS.md)**: Code style, naming, and TypeScript/React patterns.
- **[Design System](./docs/DESIGN_SYSTEM.md)**: Design tokens, shared UI components, and visual principles.
- **[Development Guide](./docs/DEVELOPMENT_GUIDE.md)**: Guide to adding new features, services, or modules.
- **[Release Process](./docs/RELEASE_PROCESS.md)**: Protocol for creating, testing, and publishing new versions.
