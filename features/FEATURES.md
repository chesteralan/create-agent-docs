# Feature Ideas

Feature suggestions for `create-agent-docs` organized by impact and effort.

---

## Tier 1 — High Impact, Low Effort

### F1. Default package manager to `npm`
**Problem:** 12 of 14 presets hardcode `packageManager: 'yarn'`. npm is more universal.
**Fix:** Change preset defaults to `npm`. The `--detect` flag already auto-detects from lockfiles, so this only affects fresh preset usage.
**Files:** `src/presets/*.ts` (12 files)
**Effort:** 5 min

### F2. Auto-detect AI agent type in `--detect`
**Problem:** `scanResultToConfig()` maps everything except `aiAgent`, so `--detect` always prompts for it.
**Fix:** Check for `.cursorrules` → `cursor`, `CLAUDE.md` → `claude`, `.github/copilot-instructions.md` → `codex`, else `generic`.
**Files:** `src/analyzers/scanner.ts`, `src/commands/generate.ts`
**Effort:** 30 min

### F3. Add `--no-color` / `NO_COLOR` support
**Problem:** No way to disable chalk colors for CI or non-TTY terminals.
**Fix:** Check `process.env.NO_COLOR` and `--no-color` flag in cli.ts, pass to logger.
**Files:** `src/cli.ts`, `src/utils/logger.ts`
**Effort:** 20 min

### F4. Improve `--fix` in validate to use placeholders
**Problem:** `--fix` replaces `{{unsetVar}}` with empty string, leaving broken Markdown.
**Fix:** Replace with `__MISSING__` or `[UNSET: variableName]` instead of empty string.
**Files:** `src/commands/validate.ts`
**Effort:** 10 min

### F5. Offer to add `docs:generate` script to package.json
**Problem:** After generating docs, there's no easy way to re-run. No package.json script is created.
**Fix:** After `generateDocs()`, ask "Add `docs:generate` script to package.json?" and append it.
**Files:** `src/generators/file-generator.ts`
**Effort:** 20 min

---

## Tier 2 — High Impact, Medium Effort

### F6. Standard OSS document generation
**Problem:** The tool generates 8 AI-agent doc files but no standard project README, CONTRIBUTING, CHANGELOG, or LICENSE.
**Fix:** Add a `--standard` flag or new template category that generates `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE` with stack-appropriate content.
**Templates:** `src/templates/README.md.hbs`, `src/templates/LICENSE.hbs` (select MIT/Apache/GPL)
**Files:** New templates + `file-generator.ts` + types
**Effort:** 2-3 hours

### F7. Config file support (`.create-agent-docsrc`)
**Problem:** No automatic project-level config. Users must pass `--preset ./config.json` every time.
**Fix:** Auto-detect `.create-agent-docsrc` (JSON/YAML) in project root. Can store preset name, output dir, flags, and custom template paths.
**Files:** `src/utils/config-loader.ts` (new), `src/commands/generate.ts`
**Effort:** 1-2 hours

### F8. Watch mode for template development
**Problem:** No way to auto-re-generate docs when templates or config change.
**Fix:** Add `--watch` flag to `generate` that uses `fs.watch` on template dir and re-runs `generateDocs` on change.
**Files:** `src/commands/generate.ts` + new watch utility
**Dependencies:** `chokidar` (or built-in `fs.watch`)
**Effort:** 2-3 hours

### F9. `.gitignore` management
**Problem:** The tool creates `.backup/` dirs but doesn't add them to `.gitignore`. Generated `docs/` may or may not want to be committed.
**Fix:** Offer to append `.backup/` to `.gitignore`. Offer to add/remove `docs/` from `.gitignore` based on user preference.
**Files:** `src/generators/file-generator.ts` or new `src/utils/gitignore.ts`
**Effort:** 1 hour

### F10. Snapshot tests for template output
**Problem:** No regression protection for template changes. The `examples/` dir has output but no automated comparison.
**Fix:** Add Vitest snapshot tests (`toMatchSnapshot()`) for each preset render. CI would catch unintended template changes.
**Files:** `tests/template-engine.test.ts` (extend with snapshot cases)
**Effort:** 1-2 hours

---

## Tier 3 — High Impact, High Effort

### F11. CI/CD template generation
**Problem:** Scanner detects CI/CD files but templates never generate them.
**Fix:** Add template set for GitHub Actions workflows, Dockerfile, docker-compose.yml, and platform-specific configs based on detected or prompted choices.
**Templates:** `src/templates/workflows/ci.yml.hbs`, `src/templates/Dockerfile.hbs`, etc.
**Files:** New templates + new prompt for CI/CD provider selection
**Effort:** 3-4 hours

### F12. Interactive preset override mode
**Problem:** `--preset` skips ALL prompts. No way to use a preset as a base and override a few fields interactively.
**Fix:** Add `--preset nextjs --interactive` that loads preset values but still runs prompts, pre-filled with preset values.
**Files:** `src/commands/generate.ts`, `src/prompts/index.ts`
**Effort:** 1-2 hours

### F13. Backup rotation and restore command
**Problem:** Multiple overwrites create unlimited `.backup/` dirs with no cleanup or restore capability.
**Fix:**
- Add `--max-backups N` to prune old backups
- Add `restore` command to list/restore from `.backup/` snapshots
- Consider switching from timestamp dirs to single zip archive
**Files:** `src/commands/restore.ts` (new), `src/generators/backup.ts`
**Effort:** 3-4 hours

### F14. Programmatic Node.js API
**Problem:** `main` in package.json points to `dist/cli.js`. No documented API for programmatic use.
**Fix:**
- Add `"exports"` map with `"."` for API entry point
- Create `src/index.ts` exporting public API: `generateDocs()`, `loadPreset()`, `scanProject()`, etc.
- Add JSDoc to all public exports
- Document in README with code examples
**Files:** `src/index.ts` (new), `package.json`, README
**Effort:** 2-3 hours

### F15. Type-safe config with union types
**Problem:** `ProjectConfig` fields are `string` instead of union types, allowing invalid values with no compile-time checking.
**Fix:** Define union literal types for each field (e.g., `type Backend = 'Express' | 'NestJS' | 'FastAPI' | 'Firebase' | 'None'`). Update all presets, prompts, templates, and tests to use them.
**Files:** `src/types/index.ts` + all presets + all tests + scanner
**Effort:** 2-3 hours (lots of find-and-replace + test updates)

---

## Tier 4 — Medium Impact, High Effort

### F16. Template versioning and migration
**Problem:** Old generated docs have no upgrade path when templates change between CLI versions. `upgrade` command doesn't touch generated output.
**Fix:** Embed template version in generated files. `upgrade --migrate` diffs old vs new templates and applies changes, preserving user edits where possible.
**Files:** `src/commands/upgrade.ts`, new migration engine
**Effort:** 4-6 hours

### F17. Preset template overrides
**Problem:** Presets only supply config values. No mechanism for a preset to override a template (e.g., Next.js providing a custom ARCHITECTURE.md.hbs).
**Fix:** Allow presets to specify `templateOverrides: Record<string, string>` mapping filenames to custom template paths. `loadPreset` merges these.
**Files:** `src/utils/preset.ts`, `src/generators/file-generator.ts`, types
**Effort:** 3-4 hours

### F18. Internationalization (i18n)
**Problem:** All templates and prompts are English-only. Limits global adoption.
**Fix:**
- Extract all prompt messages and template strings into locale JSON files
- Add `--lang` flag (default: `en`)
- Load locale at startup, pass `locale` context to Handlebars
- Provide community contribution path for new locales
**Files:** `src/locales/` (new directory), `src/prompts/index.ts`, `src/generators/template-engine.ts`, all templates
**Effort:** 6-8 hours for initial en + one additional locale

### F19. Plugin system
**Problem:** No way for third-party packages to extend the tool (custom presets, custom templates, custom prompts, custom analyzers).
**Fix:** Design a plugin interface:
- Plugins are npm packages named `create-agent-docs-plugin-*`
- Plugin hooks: `beforeGenerate`, `afterGenerate`, `beforeRender`, `afterRender`
- Plugin API: access to config, templates, and generated files
- Plugin registry subcommand: `plugins search`, `plugins install`
**Files:** `src/plugins/` (new), plugin loader, plugin API types
**Effort:** 8-12 hours

---

## Tier 5 — Lower Priority

| ID | Feature | Effort | Notes |
|----|---------|--------|-------|
| F20 | Markdown linting of generated output | 2h | Run prettier on generated .md files |
| F21 | `create-agent-docs.json` project-level config | 3h | Auto-load from project root |
| F22 | Project scaffolding (`--scaffold src/`) | 4h | Create basic project structure alongside docs |
| F23 | Git init integration (`--git`) | 1h | `git init` + .gitignore during init |
| F24 | `.cursorrules` for this project | 30m | Add Cursor config to the repo itself |
| F25 | `restore` command for backups | 3h | List/restore from timestamped backups |
| F26 | Non-TTY CI mode (no spinners, clean output) | 1h | Detect CI env, use logger instead of ora |
| F27 | Template partials per-stack | 2h | Stack-specific partials (Firebase, Next.js) |
| F28 | `upgrade --diff` to see template changes | 2h | Show what changed between template versions |
| F29 | Multi-repo / monorepo support | 4h | Generate docs across multiple packages |
| F30 | AI-powered analysis (`analyze --ai`) | 8h | Use LLM to suggest missing docs sections |

---

## Quick Wins (Pick & Implement)

If implementing today, start with these in order:

1. **F2** — Auto-detect AI agent (30 min) — completes the `--detect` feature
2. **F3** — NO_COLOR support (20 min) — CI-friendly
3. **F4** — Better `--fix` placeholders (10 min) — prevents broken markdown
4. **F1** — npm as default package manager (5 min) — unbiased defaults
5. **F5** — package.json script offer (20 min) — sticky UX improvement
6. **F10** — Snapshot tests (1-2 hrs) — prevents regressions
