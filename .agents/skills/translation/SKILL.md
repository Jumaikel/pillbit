---
name: Enforce Translations
description: Triggers when the user asks to add or modify UI text, components, screens, alerts, or messages. Ensures that all text is fully translated using react-i18next.
---

# Translation Skill

When working on UI components, screens, alerts, or any user-facing text:
1. **Never use hardcoded strings** in the UI.
2. Always import `useTranslation` from `react-i18next`.
3. Extract all strings to both `src/i18n/locales/es.json` and `src/i18n/locales/en.json`.
4. Use the `t()` function from `useTranslation` to render text.
5. If plurals are needed, use `_one` and `_other` keys in the JSON files and pass `{ count }` to `t()`.
6. Make sure to follow the app's configuration for both English and Spanish when adding new keys.
