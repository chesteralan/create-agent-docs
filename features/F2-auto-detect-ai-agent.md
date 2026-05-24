# F2 — Auto-detect AI agent type in `--detect`

**Tier:** 1 — High Impact, Low Effort  
**Effort:** 30 min

## Problem

`scanResultToConfig()` maps everything except `aiAgent`, so `--detect` always prompts for it. The scanner already checks for various config files but not AI agent files.

## Task

Auto-detect the AI agent type from existing project files.

## Acceptance Criteria

- [ ] `.cursorrules` detected as `cursor`
- [ ] `CLAUDE.md` detected as `claude`
- [ ] `.github/copilot-instructions.md` detected as `codex`
- [ ] None found → `generic`
- [ ] No prompt shown for `aiAgent` when running `--detect`

## Concrete Plan

1. **Extend `ScanResult` interface** in `src/analyzers/scanner.ts`:
   ```ts
   detectedAiAgent?: 'cursor' | 'claude' | 'codex' | 'generic';
   ```

2. **Add detection logic** in `scanProject()` after existing file checks:
   ```ts
   // AI agent detection
   if (fs.existsSync(path.join(dir, '.cursorrules'))) {
     result.detectedAiAgent = 'cursor';
   } else if (fs.existsSync(path.join(dir, 'CLAUDE.md'))) {
     result.detectedAiAgent = 'claude';
   } else if (fs.existsSync(path.join(dir, '.github', 'copilot-instructions.md'))) {
     result.detectedAiAgent = 'codex';
   }
   ```

3. **Update `scanResultToConfig()`** to include `aiAgent`:
   ```ts
   aiAgent: scan.detectedAiAgent || undefined,
   ```

4. **No change needed in prompts** — `promptProjectConfig()` already uses `overrides.aiAgent ?? await select(...)`, so when `aiAgent` is populated by detection, the prompt auto-skips.

5. **Update tests** in `tests/scanner.test.ts`:
   - Create a temp dir with `.cursorrules` → verify `scanResultToConfig` returns `aiAgent: 'cursor'`
   - Test with `CLAUDE.md` → returns `'claude'`
   - Test with no agent files → returns `undefined`

## Files

- `src/analyzers/scanner.ts`
- `src/commands/generate.ts` (no changes needed — it already passes the scan result to `promptProjectConfig`)
- `tests/scanner.test.ts`
