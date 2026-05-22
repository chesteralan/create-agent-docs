# Phase 7 — AI Agent Support

## Status: Not Started (~15% done)

Only `AGENTS.md` template exists. No `.cursorrules`, `CLAUDE.md`, AI modes, or
context engineering features.

---

## Tasks

### 7.1 Generate `.cursorrules`

- [ ] Create `src/templates/.cursorrules.hbs` with:
  - Project tech stack summary (from config)
  - Key architectural decisions
  - Code style conventions
  - Testing patterns
- [ ] Add to `TEMPLATES` list in `file-generator.ts`
- [ ] Place in project root (not `/docs/`)

### 7.2 Generate `CLAUDE.md`

- [ ] Create `src/templates/CLAUDE.md.hbs` with:
  - Project overview and purpose
  - Commands for building, testing, linting
  - Key files and their responsibilities
  - Common patterns and conventions
- [ ] Add to `TEMPLATES` list
- [ ] Place in project root

### 7.3 AI Mode Selection

- [ ] Add `aiAgent` field to `ProjectConfig` (values: `cursor`, `claude`, `codex`, `generic`)
- [ ] Add prompt in `promptProjectConfig` for AI agent selection
- [ ] When `cursor` is selected, generate `.cursorrules` (not `CLAUDE.md`)
- [ ] When `claude` is selected, generate `CLAUDE.md` (not `.cursorrules`)
- [ ] When `codex` or `generic` is selected, generate both with generic content

### 7.4 Context Engineering

- [ ] In `AGENTS.md.hbs`, add architecture explanation standards section
- [ ] Add AI memory patterns section: how the agent should remember project context
- [ ] Add project context structure section: where to find key docs, configs, entry points
- [ ] Add business logic documentation format: how business rules should be documented

### 7.5 AI-Specific Presets

- [ ] Create `src/presets/ai-cursor.ts` — Cursor-optimized config
- [ ] Create `src/presets/ai-claude.ts` — Claude-optimized config
- [ ] Create `src/presets/ai-codex.ts` — Codex-optimized config
- [ ] Register in `PRESET_REGISTRY`

---

## Verification

- [ ] `yarn test` passes
- [ ] `.cursorrules` generated in project root when AI agent is Cursor
- [ ] `CLAUDE.md` generated in project root when AI agent is Claude
- [ ] AI prompt templates contain actionable context for agents
