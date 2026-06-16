# Project Conventions

Consistency is key to a maintainable codebase. All contributors must follow these conventions.

## Naming Conventions

### Files and Directories
* **React Components**: `PascalCase.tsx` (e.g., `PrimaryButton.tsx`, `UserProfile.tsx`).
* **Hooks**: `camelCase.ts` prefixed with `use` (e.g., `useAuth.ts`, `useFetch.ts`).
* **Utility/Service Files**: `camelCase.ts` or `kebab-case.ts` (stick to `camelCase` for variables and exports, but filenames can be `kebab-case` if preferred, e.g., `api-client.ts` or `apiClient.ts`. *Project standard:* `camelCase.ts`).
* **Directories**: `kebab-case` (e.g., `user-profile`, `auth`).

### Code Elements
* **Variables & Functions**: `camelCase`.
* **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`).
* **Interfaces & Types**: `PascalCase` (e.g., `UserData`, `AppConfig`). Do NOT prefix with `I` or `T` (e.g., avoid `IUserData`).
* **Zustand Stores**: `use[Feature]Store` (e.g., `useAuthStore`, `useSettingsStore`).

## Folder Conventions

When creating a new Feature in `src/features/`, structure it as follows:
```
src/features/feature-name/
├── components/   # UI components specific to this feature
├── hooks/        # Hooks specific to this feature
├── store/        # Zustand stores for this feature
├── types/        # Feature-specific types
└── api/          # Feature-specific API calls or DB queries
```

## TypeScript Guidelines

* **Strict Mode**: TypeScript strict mode is enabled. No `any` types allowed. Use `unknown` if the type is truly dynamic.
* **Interfaces vs Types**: Prefer `interface` for object shapes. Use `type` for unions, intersections, or primitives.
* **Return Types**: Explicitly define return types for hooks and utility functions. Component return types can be inferred.

## React Guidelines

* **Functional Components**: Use functional components and hooks. No class components.
* **Separation of Concerns**: Keep components small. If a component grows beyond 150-200 lines, consider extracting sub-components or moving logic to custom hooks.
* **Prop Drilling**: Avoid excessive prop drilling. If passing props more than 2 levels deep, consider using Zustand or React Context.
* **State Ownership**: Keep state as close to where it's needed as possible. Don't put everything in Zustand if it's only used locally in a component.

## Zustand Guidelines

* **Slices Pattern**: For large stores, use the slices pattern to break them down.
* **Actions inside Stores**: Keep actions (functions that modify state) collocated inside the store.
* **Selectors**: Always use selectors when consuming state to prevent unnecessary re-renders:
  ```tsx
  // Good
  const username = useAuthStore(state => state.user.name);
  // Bad
  const { user } = useAuthStore();
  ```

## NativeWind Guidelines

* **Utility-First**: Use NativeWind utility classes (`className`) for all styling.
* **Avoid StyleSheet**: Minimize the use of `StyleSheet.create`. Only use it for complex animations or styles that NativeWind cannot handle.
* **Responsive Design**: Utilize NativeWind's responsive prefixes (`sm:`, `md:`) where applicable.

## Error Handling

* **Try/Catch**: Wrap async operations in try/catch blocks.
* **User Feedback**: Always provide user-facing feedback for errors (e.g., toasts, error states) using a centralized error handling strategy.
* **Logging**: Log errors to a monitoring service (when implemented) rather than just `console.error`.
