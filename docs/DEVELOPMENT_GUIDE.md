# Development Guide

This guide provides step-by-step instructions for common development tasks and outlines expectations for code contributions.

## How to Add a New Feature

1. Create a new directory in `src/features/` with the name of your feature (e.g., `src/features/medications/`).
2. Inside the feature directory, create necessary subdirectories (`components`, `hooks`, `store`, `types`, `api`).
3. Define the domain types in `types/`.
4. Implement data fetching or local storage access in `api/`.
5. Create a Zustand store in `store/` if the feature requires global state.
6. Build UI components in `components/`.
7. Assemble the feature in `src/app/` by creating a new screen and importing the necessary components from your feature folder.

## How to Add Shared Components

1. If a component is highly reusable (e.g., `Button`, `Card`, `TextInput`), place it in `src/components/`.
2. Ensure the component is "dumb" - it should rely entirely on props and not fetch its own data or connect to Zustand stores.
3. Use NativeWind for styling.

## How to Organize Hooks

* If a hook is used only within a specific feature, place it in `src/features/[feature-name]/hooks/`.
* If a hook is generic and used across multiple features (e.g., `useKeyboard`, `useDebounce`), place it in `src/hooks/`.

## How to Introduce External Services

1. All external integrations (REST APIs, SQLite databases, Push Notifications) belong in `src/services/`.
2. Create a dedicated folder or file for the service (e.g., `src/services/sqlite/`, `src/services/notifications.ts`).
3. Expose clean, typed interfaces for features to consume. Do not expose implementation details (like SQLite connection objects) directly to UI components.

## Pull Request Expectations

When submitting a Pull Request, ensure:
* The PR title follows Git conventions (e.g., `feat: add medication reminder feature`).
* The PR description clearly explains what was changed and why.
* The code adheres to all guidelines in `CONVENTIONS.md`.
* No `console.log` statements are left in the code.
* TypeScript compiles without errors.
* ESLint and Prettier rules pass.

## Git Conventions

We follow Conventional Commits format:

* `feat:` A new feature.
* `fix:` A bug fix.
* `refactor:` A code change that neither fixes a bug nor adds a feature.
* `docs:` Documentation only changes.
* `chore:` Changes to the build process or auxiliary tools and libraries.
* `test:` Adding missing tests or correcting existing tests.

**Branch Naming:**
* `feat/feature-name`
* `fix/bug-description`
* `chore/task-description`

## Definition of Done (DoD)

A task is considered "Done" when:
- [ ] Code is written and fulfills the requirements.
- [ ] Code follows the architectural rules and conventions.
- [ ] Types are correctly defined (no `any`).
- [ ] UI is responsive and tested on both iOS and Android simulators (or physical devices).
- [ ] PR is approved by at least one reviewer.
