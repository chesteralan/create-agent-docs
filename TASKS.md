# create-agent-docs CLI — Tasks.md

A complete roadmap for building the `create-agent-docs` CLI from scratch to production.

---

# Vision

Build a CLI scaffolding tool that generates AI-ready documentation systems for software projects.

The CLI should help developers and AI agents quickly understand:
- architecture
- business rules
- engineering standards
- codebase structure
- workflows
- conventions

---

# Phase 1 — Repository Setup

## Initialize Project

- [x] Create GitHub repository
- [x] Add repository description
- [x] Add GitHub topics
- [x] Configure repository visibility
- [x] Create initial commit

---

## Setup Node.js + TypeScript

- [x] Initialize `package.json`
- [x] Install TypeScript
- [x] Create `tsconfig.json`
- [x] Setup build pipeline
- [x] Configure output directory
- [x] Configure executable entry point

---

## Install Core Dependencies

### CLI Framework

- [x] Install Commander.js or CAC

### Interactive Prompts

- [x] Install Inquirer.js

### Template Rendering

- [x] Install Handlebars

### Utilities

- [x] Install fs-extra
- [x] Install chalk
- [x] Install ora

### Development Dependencies

- [x] Install tsup
- [x] Install ESLint
- [x] Install Prettier
- [x] Install @types/node

---

# Phase 2 — Project Architecture

## Create Project Structure

```txt
create-agent-docs/
│
├── src/
│   ├── cli.ts
│   ├── commands/
│   ├── prompts/
│   ├── generators/
│   ├── templates/
│   ├── utils/
│   ├── constants/
│   └── types/
│
├── tests/
├── examples/
├── docs/
├── dist/
└── package.json
```

---

## Setup Core Modules

- [x] Create CLI entry file
- [x] Create command system
- [x] Create prompt handlers
- [x] Create template engine
- [x] Create file generator utilities
- [x] Create logger utilities
- [x] Create validation utilities

---

# Phase 3 — Template System

## Create Template Engine

- [x] Setup Handlebars rendering
- [x] Create template loader
- [x] Create variable injection system
- [x] Create template validation
- [x] Create partial template support
- [x] Create reusable layout system

---

## Define Template Variables

- [x] `{{PROJECT_NAME}}`
- [x] `{{FRONTEND_FRAMEWORK}}`
- [x] `{{BACKEND}}`
- [x] `{{DATABASE}}`
- [x] `{{AUTH_PROVIDER}}`
- [x] `{{STATE_MANAGEMENT}}`
- [x] `{{TESTING_FRAMEWORK}}`
- [x] `{{PACKAGE_MANAGER}}`

---

## Create Documentation Templates

- [x] AGENTS.md
- [x] ARCHITECTURE.md
- [x] CODEBASE_MAP.md
- [x] BUSINESS_RULES.md
- [x] API_CONTRACTS.md
- [x] UI_PATTERNS.md
- [x] REFACTOR_RULES.md
- [x] GLOSSARY.md

---

# Phase 4 — CLI User Experience

## Interactive CLI Prompts

- [x] Ask for project name
- [x] Ask for frontend framework
- [x] Ask for backend
- [x] Ask for database
- [x] Ask for auth provider
- [x] Ask for package manager
- [x] Ask for testing framework
- [x] Ask for AI agent preferences

---

## Create CLI Commands

### Initialize Command

- [x] `create-agent-docs init`

### Generate Command

- [x] `create-agent-docs generate`

### Analyze Command

- [x] `create-agent-docs analyze`

### Validate Command

- [x] `create-agent-docs validate`

### Upgrade Command

- [x] `create-agent-docs upgrade`

---

# Phase 5 — File Generation

## Generate Documentation Structure

- [x] Create `/docs`
- [x] Generate markdown files
- [x] Inject template variables
- [x] Create missing directories
- [x] Prevent overwriting existing files
- [x] Add overwrite confirmation prompts

---

## Add File Safety Features

- [x] Backup existing files
- [x] Validate output paths
- [x] Handle duplicate filenames
- [x] Add dry-run mode

---

# Phase 6 — Stack Presets

## Create Framework Presets

### Frontend Presets

- [x] **React + Vite** – already functional (baseline preset)
- [x] **Next.js** – implement preset, auto‑select Next.js, inject `{{NEXT_JS}}` variable, update templates
- [x] **Vue** – implement Vue preset, add Pinia state‑management option
- [x] **Angular** – implement Angular preset, add RxJS support
- [x] **None (Pure Backend / HTML)** – placeholder for backend‑only projects (default when frontend is None)

---

### Backend Presets

- [x] **Firebase** – generate Firebase serverless docs, include Firestore & Auth sections
- [x] **Node.js API** – Express preset covers generic Node.js backend
- [x] **Express** – implement Express‑specific docs
- [x] **NestJS** – add NestJS preset with module structure docs
- [x] **FastAPI** – add Python FastAPI preset (future cross‑language support)

---

### Full‑Stack Presets

- [x] **React + Firebase** – combine React Vite frontend with Firebase backend
- [x] **Next.js SaaS** – full‑stack SaaS preset with NextAuth & Prisma
- [x] **MERN Stack** – React + Express + MongoDB preset
- [x] **T3 Stack** – Next.js + Tailwind + tRPC + Prisma preset

---

**Implementation Steps**
1. [x] Create a `src/presets/` directory with TypeScript files exporting preset configurations.
2. [x] Extend `promptProjectConfig` to accept `--preset <name>` flag that bypasses interactive prompts and applies the preset values.
3. [x] Update `generateDocs` to merge preset values into the config before template rendering.
4. [x] Add unit tests for each preset (verify generated docs contain correct variables).
5. [x] Document usage in README (`yarn create-agent-docs generate --preset nextjs`).

---

# Phase 7 — AI Agent Support

## AI-Specific Configurations

- [x] Generate `.cursorrules`
- [x] Generate `AGENTS.md`
- [x] Generate `CLAUDE.md`
- [x] Generate AI prompt templates

---

## AI Modes

- [x] Cursor mode
- [x] Claude mode
- [x] Codex mode
- [x] Generic AI mode

---

## Context Engineering Features

- [x] Define architecture explanation standards
- [x] Define AI memory patterns
- [x] Define project context structure
- [x] Define business logic documentation format

---

# Phase 8 — Repo Analysis (Advanced)

## Codebase Scanner

- [x] Detect framework
- [x] Detect package manager
- [x] Detect TypeScript usage
- [x] Detect backend services
- [x] Detect testing frameworks

---

## Auto-Generated Documentation

- [x] Generate architecture summaries
- [x] Generate dependency maps
- [x] Generate codebase maps
- [x] Generate AI onboarding docs

---

# Phase 9 — Developer Experience

## Logging & Feedback

- [x] Add loading spinners
- [x] Add success messages
- [x] Add error messages
- [x] Add verbose mode
- [x] Add debug mode

---

## Performance Improvements

- [x] Optimize template loading
- [x] Optimize file generation
- [x] Add caching system
- [x] Reduce startup time

---

# Phase 10 — Testing

## Unit Testing

- [x] Test template rendering
- [x] Test CLI commands
- [x] Test prompt validation
- [x] Test file generation

---

## Integration Testing

- [x] Test React preset
- [x] Test Next.js preset
- [x] Test Firebase preset
- [x] Test overwrite handling

---

## Edge Case Testing

- [x] Empty project names
- [x] Invalid paths
- [x] Existing directories
- [x] Missing permissions

---

# Phase 11 — Documentation

## CLI Documentation

- [x] Create installation guide
- [x] Create usage guide
- [x] Create command reference
- [x] Create examples
- [x] Create troubleshooting guide

---

## Open Source Documentation

- [x] Create CONTRIBUTING.md
- [x] Create CODE_OF_CONDUCT.md
- [x] Create CHANGELOG.md
- [x] Create SECURITY.md

---

# Phase 12 — CI/CD

## GitHub Actions

- [x] Setup lint workflow
- [x] Setup test workflow
- [x] Setup build workflow
- [x] Setup release workflow

---

## Quality Gates

- [x] Run tests on PRs
- [x] Run lint checks
- [x] Validate formatting
- [x] Validate builds

---

# Phase 13 — npm Publishing

## Prepare Package

- [x] Configure package exports
- [x] Configure binary entry
- [x] Add README examples
- [x] Add keywords
- [x] Add npm metadata

---

## Publish Package

- [ ] Create npm account
- [ ] Configure npm access
- [ ] Publish initial release
- [ ] Verify npx execution

---

## Example Usage

```bash
npx create-agent-docs
```

---

# Phase 14 — Production Readiness

## Stability

- [x] Finalize CLI API
- [x] Finalize template structure
- [x] Improve error handling
- [x] Improve UX polish

---

## Security

- [x] Validate filesystem operations
- [x] Prevent path traversal
- [x] Sanitize user inputs

---

## Performance

- [x] Reduce memory usage
- [x] Optimize template rendering
- [x] Improve startup speed

---

# Phase 15 — Marketing & Adoption

## GitHub Optimization

- [ ] Add screenshots
- [ ] Add demos
- [x] Add badges
- [ ] Add repository banner

---

## Community Growth

- [x] Create roadmap
- [ ] Create discussions board
- [ ] Add contribution labels
- [ ] Create good first issues

---

# Phase 16 — Future Features

## Advanced Automation

- [ ] AI-powered repo analysis
- [ ] Auto-update architecture docs
- [ ] Sync codebase map automatically
- [ ] Generate diagrams

---

## Editor Integrations

- [ ] VSCode extension
- [ ] Cursor integration
- [ ] JetBrains plugin

---

## Enterprise Features

- [ ] Team templates
- [ ] Organization standards
- [ ] Shared architecture packs
- [ ] Multi-repo support

---

# Milestones

## v0.1.0

- [x] Basic CLI
- [x] Template rendering
- [x] Interactive prompts
- [x] Markdown generation

---

## v0.3.0

- [x] Stack presets
- [x] AI modes
- [x] Improved UX

---

## v0.5.0

- [x] Repo analysis
- [x] Validation tools
- [x] CI/CD setup

---

## v1.0.0

- [x] Production-ready CLI
- [ ] npm published
- [x] Stable APIs
- [x] Full documentation

---

# Long-Term Vision

The long-term goal is to evolve `create-agent-docs` into:

- AI context infrastructure
- AI-native repo scaffolding
- Engineering standards platform
- Autonomous onboarding system
- AI-assisted architecture toolkit
- Context engineering ecosystem