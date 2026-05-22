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

- [ ] Ask for project name
- [ ] Ask for frontend framework
- [ ] Ask for backend
- [ ] Ask for database
- [ ] Ask for auth provider
- [ ] Ask for package manager
- [ ] Ask for testing framework
- [ ] Ask for AI agent preferences

---

## Create CLI Commands

### Initialize Command

- [ ] `create-agent-docs init`

### Generate Command

- [ ] `create-agent-docs generate`

### Analyze Command

- [ ] `create-agent-docs analyze`

### Validate Command

- [ ] `create-agent-docs validate`

### Upgrade Command

- [ ] `create-agent-docs upgrade`

---

# Phase 5 — File Generation

## Generate Documentation Structure

- [ ] Create `/docs`
- [ ] Generate markdown files
- [ ] Inject template variables
- [ ] Create missing directories
- [ ] Prevent overwriting existing files
- [ ] Add overwrite confirmation prompts

---

## Add File Safety Features

- [ ] Backup existing files
- [ ] Validate output paths
- [ ] Handle duplicate filenames
- [ ] Add dry-run mode

---

# Phase 6 — Stack Presets

## Create Framework Presets

### Frontend Presets

- [ ] React + Vite
- [ ] Next.js
- [ ] Vue
- [ ] Angular

---

### Backend Presets

- [ ] Firebase
- [ ] Node.js API
- [ ] Express
- [ ] NestJS
- [ ] FastAPI

---

### Full Stack Presets

- [ ] React + Firebase
- [ ] Next.js SaaS
- [ ] MERN Stack
- [ ] T3 Stack

---

# Phase 7 — AI Agent Support

## AI-Specific Configurations

- [ ] Generate `.cursorrules`
- [ ] Generate `AGENTS.md`
- [ ] Generate `CLAUDE.md`
- [ ] Generate AI prompt templates

---

## AI Modes

- [ ] Cursor mode
- [ ] Claude mode
- [ ] Codex mode
- [ ] Generic AI mode

---

## Context Engineering Features

- [ ] Define architecture explanation standards
- [ ] Define AI memory patterns
- [ ] Define project context structure
- [ ] Define business logic documentation format

---

# Phase 8 — Repo Analysis (Advanced)

## Codebase Scanner

- [ ] Detect framework
- [ ] Detect package manager
- [ ] Detect TypeScript usage
- [ ] Detect backend services
- [ ] Detect testing frameworks

---

## Auto-Generated Documentation

- [ ] Generate architecture summaries
- [ ] Generate dependency maps
- [ ] Generate codebase maps
- [ ] Generate AI onboarding docs

---

# Phase 9 — Developer Experience

## Logging & Feedback

- [ ] Add loading spinners
- [ ] Add success messages
- [ ] Add error messages
- [ ] Add verbose mode
- [ ] Add debug mode

---

## Performance Improvements

- [ ] Optimize template loading
- [ ] Optimize file generation
- [ ] Add caching system
- [ ] Reduce startup time

---

# Phase 10 — Testing

## Unit Testing

- [ ] Test template rendering
- [ ] Test CLI commands
- [ ] Test prompt validation
- [ ] Test file generation

---

## Integration Testing

- [ ] Test React preset
- [ ] Test Next.js preset
- [ ] Test Firebase preset
- [ ] Test overwrite handling

---

## Edge Case Testing

- [ ] Empty project names
- [ ] Invalid paths
- [ ] Existing directories
- [ ] Missing permissions

---

# Phase 11 — Documentation

## CLI Documentation

- [ ] Create installation guide
- [ ] Create usage guide
- [ ] Create command reference
- [ ] Create examples
- [ ] Create troubleshooting guide

---

## Open Source Documentation

- [ ] Create CONTRIBUTING.md
- [ ] Create CODE_OF_CONDUCT.md
- [ ] Create CHANGELOG.md
- [ ] Create SECURITY.md

---

# Phase 12 — CI/CD

## GitHub Actions

- [ ] Setup lint workflow
- [ ] Setup test workflow
- [ ] Setup build workflow
- [ ] Setup release workflow

---

## Quality Gates

- [ ] Run tests on PRs
- [ ] Run lint checks
- [ ] Validate formatting
- [ ] Validate builds

---

# Phase 13 — npm Publishing

## Prepare Package

- [ ] Configure package exports
- [ ] Configure binary entry
- [ ] Add README examples
- [ ] Add keywords
- [ ] Add npm metadata

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

- [ ] Finalize CLI API
- [ ] Finalize template structure
- [ ] Improve error handling
- [ ] Improve UX polish

---

## Security

- [ ] Validate filesystem operations
- [ ] Prevent path traversal
- [ ] Sanitize user inputs

---

## Performance

- [ ] Reduce memory usage
- [ ] Optimize template rendering
- [ ] Improve startup speed

---

# Phase 15 — Marketing & Adoption

## GitHub Optimization

- [ ] Add screenshots
- [ ] Add demos
- [ ] Add badges
- [ ] Add repository banner

---

## Community Growth

- [ ] Create roadmap
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

- [ ] Basic CLI
- [ ] Template rendering
- [ ] Interactive prompts
- [ ] Markdown generation

---

## v0.3.0

- [ ] Stack presets
- [ ] AI modes
- [ ] Improved UX

---

## v0.5.0

- [ ] Repo analysis
- [ ] Validation tools
- [ ] CI/CD setup

---

## v1.0.0

- [ ] Production-ready CLI
- [ ] npm published
- [ ] Stable APIs
- [ ] Full documentation

---

# Long-Term Vision

The long-term goal is to evolve `create-agent-docs` into:

- AI context infrastructure
- AI-native repo scaffolding
- Engineering standards platform
- Autonomous onboarding system
- AI-assisted architecture toolkit
- Context engineering ecosystem