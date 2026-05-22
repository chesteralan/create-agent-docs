# create-agent-docs

> CLI scaffolding tool to generate AI-ready documentation systems for software projects.

[![npm version](https://img.shields.io/npm/v/create-agent-docs)](https://www.npmjs.com/package/create-agent-docs)
[![build](https://img.shields.io/github/actions/workflow/status/anomalyco/create-agent-docs/test.yml)](https://github.com/anomalyco/create-agent-docs/actions)
[![license](https://img.shields.io/npm/l/create-agent-docs)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/create-agent-docs)](https://www.npmjs.com/package/create-agent-docs)

---

## Quick Start

```bash
npx create-agent-docs generate --preset nextjs
```

This generates 8 markdown files in `./docs/` — AGENTS.md, ARCHITECTURE.md, CODEBASE_MAP.md, BUSINESS_RULES.md, API_CONTRACTS.md, UI_PATTERNS.md, REFACTOR_RULES.md, and GLOSSARY.md — pre-configured for a Next.js project.

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
nextjs       Next.js with NextAuth, Redux, and Jest
vue          Vue with Pinia and Jest
angular      Angular with Jest
firebase     Firebase with Firestore, Firebase Auth, and Jest
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

All 8 files are generated in the `docs/` directory:

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
