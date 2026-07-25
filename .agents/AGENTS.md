# PillBit — Agent Rules

These rules apply to **every task** performed by any agent in this workspace.

---

## Docs Workflow

### Before any change — Read relevant docs

Before writing any code or modifying any file, read the docs that are relevant to the task:

| Doc | When to read |
|---|---|
| `docs/PROJECT_CONTEXT.md` | Always — overview, architecture decisions, feature status |
| `docs/ARCHITECTURE.md` | When touching folder structure, layers, imports, or routing |
| `docs/CONVENTIONS.md` | When writing new code (naming, TypeScript, React, Zustand patterns) |
| `docs/DESIGN_SYSTEM.md` | When creating or modifying UI components, screens, or visual elements |
| `docs/DATABASE_ARCHITECTURE.md` | When touching SQLite, repositories, migrations, or domain models |
| `docs/DEVELOPMENT_GUIDE.md` | When adding features, shared components, services, or hooks |
| `docs/PillBit.md` | When implementing or verifying functional requirements |

Use these documents to understand the existing patterns, naming conventions, and architecture before writing any code.

---

### After any change — Update relevant docs

Once all code changes are done, update every `docs/` file affected by the change:

| Change type | Docs to update |
|---|---|
| New screen or navigation route | `docs/PROJECT_CONTEXT.md`, `docs/ARCHITECTURE.md` |
| New shared component | `docs/DESIGN_SYSTEM.md`, `docs/PROJECT_CONTEXT.md` |
| New design token | `docs/DESIGN_SYSTEM.md` |
| New convention or coding pattern | `docs/CONVENTIONS.md` |
| New DB table, column, or migration | `docs/DATABASE_ARCHITECTURE.md`, `docs/PROJECT_CONTEXT.md` |
| New service, hook, or feature module | `docs/PROJECT_CONTEXT.md`, `docs/DEVELOPMENT_GUIDE.md` |
| Any meaningful change | `docs/PROJECT_CONTEXT.md` — add a brief summary entry |

**Do not skip the docs update step.** Every meaningful change must be reflected in the documentation.
