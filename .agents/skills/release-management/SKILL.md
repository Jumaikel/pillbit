---
name: Release Management
description: Triggers when the user mentions "release", "production", or asks to update the changelog based on recent changes. Ensures the changelog is updated and prepares the project configurations for a new release.
---
# Release Management Skill

This skill automates the process of maintaining the changelog and preparing the project for a new production release.

## Triggers
- When the user asks to update the `CHANGELOG.md` after important changes.
- When the user mentions "release", "production", or explicitly asks to "prepare a release".

## Workflow

### 1. Update the Changelog (Always)
Whenever triggered by new important changes:
- Read the recent git commits using `git log --oneline`.
- Classify the recent commits into `Added`, `Fixed`, `Changed`, `Deprecated`, `Removed`, `Security`, or `Chore`.
- Add these new entries to the `[Unreleased]` section of the `CHANGELOG.md` file.

### 2. Prepare for Release (If "release" or "production" is mentioned)
If the user indicates they want to create a new release:
1. **Ask for Version:** Politely ask the user what the new version number should be (following Semantic Versioning, e.g., `v1.0.0` or `v0.2.0`).
2. **Apply the Version (Once provided):**
   - **CHANGELOG.md:** Move the contents from `[Unreleased]` to a new version header (e.g., `## [1.0.0] - YYYY-MM-DD`).
   - **package.json:** Update the `"version"` field.
   - **app.json:** 
     - Update `"expo.version"`.
     - Increment `"expo.ios.buildNumber"`.
     - Increment `"expo.android.versionCode"`.
   - **PROJECT_CONTEXT.md:** Append the new release summary to the "Changelog" section at the bottom of the file.
3. **Verify:** Run a linter command (e.g., `pnpm run lint`) to ensure the codebase is clean before release.
4. **Final Output:**
   - Summarize the files modified.
   - Provide the git commands to commit and tag the release (e.g., `git commit -am "chore: release v1.0.0" && git tag v1.0.0`).
   - Provide the exact Title and Description (in clean Markdown, without emojis) for the user to copy-paste into the GitHub Release page.
