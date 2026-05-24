# create-agent-docs

> CLI scaffolding tool to generate AI-ready documentation systems for software projects.

<p align="center">
  <img src=".github/banner.svg" alt="create-agent-docs banner" width="800">
</p>

[![npm version](https://img.shields.io/npm/v/create-agent-docs)](https://www.npmjs.com/package/create-agent-docs)
[![build](https://img.shields.io/github/actions/workflow/status/anomalyco/create-agent-docs/test.yml)](https://github.com/chesteralan/create-agent-docs/actions)
[![license](https://img.shields.io/npm/l/create-agent-docs)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/create-agent-docs)](https://www.npmjs.com/package/create-agent-docs)

---

## Quick Start

```bash
npx create-agent-docs generate --preset nextjs
```

This generates 8 markdown files in `./docs/` — AGENTS.md, ARCHITECTURE.md, CODEBASE_MAP.md, BUSINESS_RULES.md, API_CONTRACTS.md, UI_PATTERNS.md, REFACTOR_RULES.md, and GLOSSARY.md — pre-configured for a Next.js project.

Also generates AI agent configuration files (`.cursorrules`, `CLAUDE.md`) tailored to your tech stack.

---

## Demo

Running with a preset generates documentation in seconds:

```
$ npx create-agent-docs generate --preset nextjs

╔══════════════════════════════════════╗
║     create-agent-docs v0.3.3         ║
║  AI-ready documentation scaffolding  ║
╚══════════════════════════════════════╝

ℹ Running generate command...
ℹ Loaded preset "nextjs"
ℹ [preset] Using "nextjs" preset – skipping interactive prompts.
- Generating documentation files in ./docs...
✔ Created: docs/AGENTS.md
✔ Created: docs/ARCHITECTURE.md
✔ Created: docs/CODEBASE_MAP.md
✔ Created: docs/BUSINESS_RULES.md
✔ Created: docs/API_CONTRACTS.md
✔ Created: docs/UI_PATTERNS.md
✔ Created: docs/REFACTOR_RULES.md
✔ Created: docs/GLOSSARY.md
✔ Created: .cursorrules
✔ Created: CLAUDE.md

Generation Summary
ℹ 10 created.
ℹ Done in 1.2s
```

Use `--dry-run` to preview without writing:

```
$ npx create-agent-docs generate --preset nextjs --dry-run

ℹ [Dry-Run] Would write: docs/AGENTS.md
--- Preview ---
# AI Agent Guidelines — my-nextjs-app
*Generated 2026-05-24 — v0.3.3*
...
---------------
ℹ [Dry-Run] Would write: docs/ARCHITECTURE.md
--- Preview ---
# Architecture Blueprint — my-nextjs-app
...
---------------
...
Dry-Run Summary
ℹ 10 would be written.
```

---

## Installation

```bash
# Run without installing (recommended)
npx create-agent-docs generate

# Install globally
npm install -g create-agent-docs
create-agent-docs generate

# Or install locally in your project
npm install --save-dev create-agent-docs
npx create-agent-docs generate
```

Requires **Node.js >= 18**.

---

## Commands

| Command | Description |
|---------|-------------|
| `init` | Initialize AI-ready documentation templates |
| `generate` | Generate documentation files based on prompts or presets |
| `presets` | List available stack presets |
| `analyze` | Analyze existing documentation for completeness |
| `validate` | Validate generated documentation against schema |
| `upgrade` | Check for CLI updates and upgrade templates |

### `generate`

The main command. Prompts you for your tech stack and generates 8 markdown files.

**Flags:**

| Flag | Description |
|------|-------------|
| `-p, --preset <name>` | Use a predefined preset (skips prompts) |
| `-f, --force` | Overwrite existing files without prompting |
| `-d, --dry-run` | Preview what would be generated without writing |
| `-o, --output <dir>` | Output directory (default: current directory) |

### `presets`

Lists all built-in stack presets:

```
nextjs         Next.js with NextAuth, Redux, and Jest
nextjs-saas    Next.js SaaS with NextAuth, PostgreSQL, Zustand, Vitest
t3             T3 Stack: Next.js, tRPC, Prisma, Tailwind, NextAuth, Vitest
vue            Vue with Pinia and Jest
angular        Angular with Jest
express        Express backend with PostgreSQL and JWT auth
nestjs         NestJS backend with PostgreSQL and JWT auth
mern           MERN: MongoDB, Express, React + Vite, Node.js, Redux
react-firebase React + Vite with Firebase, Firestore, Firebase Auth, Vitest
firebase       Firebase with Firestore, Firebase Auth, and Jest
ai-cursor      React + Vite with Cursor-optimized config
ai-claude      React + Vite with Claude-optimized config
ai-codex       React + Vite with Codex-optimized config
fastapi        FastAPI (Python) backend with PostgreSQL and JWT auth
```

### `init`

Initializes the documentation structure with interactive prompts. Supports `--dry-run` and `--force`.

---

## Presets

Presets skip all interactive prompts and generate docs optimized for your stack.

```bash
# Built-in presets
npx create-agent-docs generate --preset nextjs
npx create-agent-docs generate --preset vue
npx create-agent-docs generate --preset angular
npx create-agent-docs generate --preset firebase

# Custom preset from JSON file
npx create-agent-docs generate --preset ./my-config.json
```

When a preset is used, the CLI displays:

```
[preset] Using "nextjs" preset – skipping interactive prompts.
```

All additional flags (`--force`, `--dry-run`, `--output`) still apply.

### JSON Preset Format

Create a custom preset by saving a JSON file:

```json
{
  "projectName": "my-app",
  "frontendFramework": "React + Vite",
  "backend": "Express",
  "database": "PostgreSQL",
  "authProvider": "Auth0",
  "stateManagement": "Zustand",
  "testingFramework": "Vitest",
  "packageManager": "pnpm"
}
```

All keys are optional — any omitted key will fall back to interactive prompts.

---

## Usage Examples

### Interactive Setup

```bash
npx create-agent-docs generate
```

Walks you through 8 prompts (project name, frontend, backend, database, auth, state management, testing, package manager) and generates documentation tailored to your answers.

### Non-Interactive with Preset

```bash
npx create-agent-docs generate --preset firebase --output ./my-app/docs
```

Generates Firebase-optimized docs in `./my-app/docs/` with no prompts.

### Dry-Run to Preview

```bash
npx create-agent-docs generate --preset nextjs --dry-run
```

Shows what files would be created and a preview of their content without writing anything.

### Force Overwrite Existing Docs

```bash
npx create-agent-docs generate --preset vue --force
```

Overwrites any existing files in the docs directory (backups are created automatically).

### List Available Presets

```bash
npx create-agent-docs presets
```

---

## Generated Files

All 8 files are generated in the `docs/` directory, plus AI agent configuration files in the project root:

| File | Purpose |
|------|---------|
| `AGENTS.md` | Instructions for AI agents working with the project |
| `ARCHITECTURE.md` | High-level architecture overview and design decisions |
| `CODEBASE_MAP.md` | Directory structure and code organization |
| `BUSINESS_RULES.md` | Business logic, constraints, and domain rules |
| `API_CONTRACTS.md` | API endpoints, request/response formats, contracts |
| `UI_PATTERNS.md` | UI component patterns, styling conventions, design system |
| `REFACTOR_RULES.md` | Refactoring guidelines and code quality standards |
| `GLOSSARY.md` | Project-specific terminology and definitions |
| `.cursorrules` | AI agent rules for Cursor editor (root) |
| `CLAUDE.md` | AI agent guide for Claude Code (root) |

Each file includes sections specific to your chosen tech stack. For example, the Firebase preset generates Firestore security rules and Auth configuration sections in `ARCHITECTURE.md`.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `command not found: create-agent-docs` | Use `npx create-agent-docs` instead of the global command |
| Prompts don't appear | Ensure you're running in an interactive terminal |
| `--preset unknown` fails silently | Unknown preset names fall back to interactive prompts |
| Files not overwritten | Use `--force` to overwrite existing files |
| Output in wrong directory | Use `--output /path/to/dir` to specify the target directory |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, coding standards, and how to add new presets or templates.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.

---

## License

[MIT](LICENSE)
