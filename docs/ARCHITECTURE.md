# Architecture Overview

This project follows a **Feature-First Architecture** combined with a strict separation of concerns. This ensures scalability, maintainability, and clear boundaries between different parts of the application. The architecture is designed to support a medium-scale to large-scale React Native application using Expo.

## Folder Structure

```
src/
├── app/          # Expo Router file-based routing and screens
├── components/   # Shared, generic UI components (buttons, inputs, etc.)
├── features/     # Feature-based modules containing domain-specific logic and UI
├── services/     # External integrations (API, SQLite setup, Notifications)
├── hooks/        # Shared, generic React hooks
├── lib/          # Third-party library configurations (e.g., Zustand setup)
├── types/        # Shared TypeScript interfaces and types
├── utils/        # Helper functions and utilities
└── constants/    # Global constants (colors, layout metrics, API keys)
```

## Layer Responsibilities

1. **App Layer (`src/app`)**: Responsible strictly for routing and assembling features into screens. Should not contain business logic.
2. **Feature Layer (`src/features`)**: Contains vertical slices of the application. Each feature encapsulates its own components, hooks, state (Zustand stores), and types.
3. **Component Layer (`src/components`)**: Contains highly reusable, presentation-only components. They should be "dumb" and rely on props, agnostic to business logic.
4. **Service Layer (`src/services`)**: Acts as a boundary to the outside world. Handles data fetching, local database (SQLite) queries, and push notifications.
5. **Shared/Core Layer (`src/hooks`, `src/lib`, `src/types`, `src/utils`, `src/constants`)**: Foundational code that can be used by any feature or service.

## Dependency Flow Rules

To maintain a healthy architecture and avoid circular dependencies, strictly adhere to the following rules:

1. **App** can depend on **Features**, **Components**, **Services**, and **Shared**.
2. **Features** can depend on **Components**, **Services**, and **Shared**.
   - *Rule:* A feature can depend on another feature ONLY through explicit public APIs (if defined) or by composing them in the App layer. Cross-feature dependencies should be minimized.
3. **Components** can depend on **Shared** (e.g., `theme`, `types`).
   - *Rule:* Components MUST NOT depend on **Features** or **Services**.
4. **Services** can depend on **Shared**.
   - *Rule:* Services MUST NOT depend on **Features** or **Components**.
5. **Shared** layers should not depend on higher layers.

## Import Rules

* Always use the configured Path Aliases (e.g., `@/components`, `@/features`).
* Avoid relative imports that traverse up multiple directories (`../../../`).
* Import from the public interface of a feature if using index files, otherwise keep imports specific to the module.

## Examples of Acceptable Dependencies

* **Acceptable**: `src/features/auth/hooks/useLogin.ts` importing `src/services/api/client.ts`.
* **Acceptable**: `src/app/(tabs)/home.tsx` importing `src/features/feed/components/FeedList.tsx`.
* **Acceptable**: `src/components/Button.tsx` importing `src/constants/colors.ts`.

## Examples of Unacceptable Dependencies (Violations)

* **Violation**: `src/components/UserCard.tsx` importing `src/features/users/store/useUserStore.ts` (Components must be feature-agnostic).
* **Violation**: `src/services/sqlite/db.ts` importing `src/app/index.tsx` (Services cannot depend on UI routing).
* **Violation**: `src/features/profile/components/ProfileHeader.tsx` importing `../../auth/components/AuthForm.tsx` (Avoid tight coupling between features unless explicitly designed as a shared feature module).
