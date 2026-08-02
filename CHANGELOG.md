# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-08-02
### Added
- **AI**: Implement daily rate limits and robust prompt validation.
- **AI**: Translate AI info, add dosage/administration, and notify in background.
- **Dashboard**: Enhance home screen with pull-to-refresh and prioritize pending doses.
- **Medications**: Enhance TTS reading capabilities and remove unused Voice Input.
- **History/Reminders**: Replace low stock tracking with dose history and postpone feature.

### Fixed
- **I18n**: Add missing translation for the Back button in Reminders screen.
- **Medications**: Add header, back button and safe area to expiration screens.
- **Config**: Move notification settings to expo-notifications plugin schema.

### Chore
- Fix TypeScript errors and clean up unused variables/imports.
- Add new release-management skill and changelog updates.

## [0.2.0] - 2026-07-25
### Added
- Application Branding: configured application icons and splash assets in app.json.
- Settings: added theme selection and fixed dark mode contrast.
- I18n: implemented full internationalization for medications, history, reminders, and settings modules.
### Chore
- Configured EAS build.

## [0.1.0] - 2026-07-25
### Added
- Multi-language support (English/Spanish).
- Inventory management module and UI integration.
- Consumption history and expiration monitoring modules.
- Complete reminder module with local notifications.
- Support for attaching medication photos.
- Medication module and adaptive date selector.
- Navigation structure, system design basis, and test environment.
- Clean architecture SQLite persistence layer & repository pattern.
### Fixed
- Resolved UI state conflicts, medication creation flow, and AI model logic.
### Chore
- Clean template and establish project architecture foundation.
