# Phase 16 — Future Features

## Status: Not Started (0% done)

Long-term, high-effort features. None are started.

---

## Tasks

### 16.1 AI-Powered Repo Analysis

- [ ] Integrate with an LLM (via API or local model) to:
  - Read project files and generate architecture descriptions in natural language
  - Suggest documentation sections based on actual code patterns
  - Identify undocumented APIs, missing business rules, uncovered edge cases
- [ ] `analyze --ai` flag that sends codebase summary to an LLM and returns insights
- [ ] Generate `ARCHITECTURE.md` content from actual code structure (not templates)

### 16.2 Auto-Update Architecture Docs

- [ ] Watch mode: `generate --watch` that re-generates docs when source files change
- [ ] Diff detection: only update sections that changed since last generation
- [ ] PR integration: comment on PRs with documentation diff

### 16.3 Diagram Generation

- [ ] Generate Mermaid.js diagrams for:
  - Architecture overview (system context diagram)
  - Data flow (component interactions)
  - Database schema (entity relationships)
  - API routes (endpoint map)
- [ ] Embed diagrams in `ARCHITECTURE.md` and `API_CONTRACTS.md`

### 16.4 Editor Integrations

- [ ] **VSCode Extension**:
  - Command palette: "Generate AI Docs"
  - Right-click folder → "Generate Documentation"
  - Sidebar panel showing generated docs status
- [ ] **Cursor Integration**: Rules for auto-generating docs on project open
- [ ] **JetBrains Plugin**: Same features for IntelliJ/WebStorm

### 16.5 Enterprise Features

- [ ] **Team Templates**: Shared template repository via Git URL
- [ ] **Organization Standards**: Enforce organization-wide doc standards
- [ ] **Multi-Repo Support**: Generate docs across a monorepo structure
- [ ] **Audit Trail**: Track who generated docs and when

### 16.6 Plugin System

- [ ] Allow third-party plugins via `npm install create-agent-docs-plugin-*`
- [ ] Plugin hooks: `beforeGenerate`, `afterGenerate`, `beforeRender`, `afterRender`
- [ ] Plugin API: access to config, templates, and generated files
- [ ] Plugin registry: `create-agent-docs plugins search <keyword>`

---

## Verification

- [ ] AI analysis produces accurate architecture descriptions (manual review)
- [ ] Watch mode detects file changes and re-generates (integration test)
- [ ] Mermaid diagrams render correctly in GitHub markdown preview
- [ ] VSCode extension installs and runs commands
