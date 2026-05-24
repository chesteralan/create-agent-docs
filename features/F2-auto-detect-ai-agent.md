# F2 — Auto-detect AI agent type in `--detect`

**Tier:** 1 — High Impact, Low Effort  
**Effort:** 30 min

## Problem

`scanResultToConfig()` maps everything except `aiAgent`, so `--detect` always prompts for it.

## Task

Auto-detect the AI agent type from existing project files.

## Acceptance Criteria

- [ ] `.cursorrules` detected as `cursor`
- [ ] `CLAUDE.md` detected as `claude`
- [ ] `.github/copilot-instructions.md` detected as `codex`
- [ ] None found → `generic`
- [ ] No prompt shown for `aiAgent` when running `--detect`

## Files

- `src/analyzers/scanner.ts`
- `src/commands/generate.ts`
