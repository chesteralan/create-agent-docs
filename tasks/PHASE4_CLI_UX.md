# Phase 4 — CLI User Experience

## Status: In Progress (~60% done)

Prompts are complete. `init`, `generate`, and `presets` commands work.
`analyze`, `validate`, and `upgrade` are placeholders.

---

## Tasks

### 4.1 Implement `analyze` Command

- [ ] In `src/commands/analyze.ts`, scan the `/docs` folder for generated files
- [ ] Check each file exists and has minimum expected sections
- [ ] Report: `[pass]` / `[missing]` / `[stale]` per file
- [ ] Add `--strict` flag that exits non-zero on any missing file

### 4.2 Implement `validate` Command

- [ ] In `src/commands/validate.ts`, read each markdown file in `/docs`
- [ ] Check for required sections (e.g., `## Overview`, `## Getting Started`)
- [ ] Check template variables were rendered (no `{{...}}` left unsubstituted)
- [ ] Report per-file pass/fail with line numbers for issues
- [ ] `--fix` flag auto-inserts missing section headers

### 4.3 Implement `upgrade` Command

- [ ] In `src/commands/upgrade.ts`, check current version against npm registry
- [ ] If newer version exists, print upgrade instructions
- [ ] Offer to re-generate templates in-place (preserving user edits where possible)
- [ ] Add `--dry-run` flag to preview changes

### 4.4 AI Agent Preferences Prompt (optional)

- [ ] Add `aiAgent` field to `ProjectConfig` interface: `'cursor' | 'claude' | 'codex' | 'generic'`
- [ ] Add prompt in `promptProjectConfig`: "Which AI agent will primarily work with this project?"
- [ ] Store preference in generated `AGENTS.md` or a new `.ai-config` file

---

## Verification

- [ ] `yarn test` passes
- [ ] `analyze` actually reviews docs and reports findings
- [ ] `validate` catches unsubstituted `{{variables}}`
- [ ] `upgrade` reports current version and latest
