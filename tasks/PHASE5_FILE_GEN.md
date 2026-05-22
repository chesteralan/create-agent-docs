# Phase 5 — File Generation Polish

## Status: In Progress (~90% done)

All core features work: directory creation, file generation, variable injection,
backup, dry-run. Only missing: interactive overwrite confirmation.

---

## Tasks

### 5.1 Interactive Overwrite Confirmation

- [ ] In `file-generator.ts`, when a file exists and `--force` is NOT set, prompt user: `"docs/AGENTS.md already exists. Overwrite? (y/N) "`
- [ ] Use `@inquirer/confirm` for the prompt
- [ ] Add `--yes` / `-y` flag to auto-accept all overwrites (non-interactive mode)
- [ ] Show a summary at the end: "3 files overwritten, 5 files skipped"

### 5.2 Generation Summary Report

- [ ] After generation completes, print a summary table:
  ```
  ┌─────────────────────┬──────────┬────────┐
  │ File                │ Status   │ Size   │
  ├─────────────────────┼──────────┼────────┤
  │ docs/AGENTS.md      │ Created  │ 2.1 kB │
  │ docs/ARCHITECTURE.md│ Skipped  │ —      │
  └─────────────────────┴──────────┴────────┘
  ```
- [ ] Use `console.table` or a simple formatted output (no new deps)

### 5.3 Output Directory Flexibility

- [ ] Allow `--output` to accept a relative or absolute path (already partially works)
- [ ] If the output dir is outside the project, warn the user
- [ ] Create output directory if it doesn't exist

---

## Verification

- [ ] `yarn test` passes
- [ ] Running without `--force` prompts before overwriting
- [ ] `-y` flag skips prompts
- [ ] Summary table displays after generation
