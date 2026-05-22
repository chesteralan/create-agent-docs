# Phase 10 — Testing

## Status: In Progress (~15% done)

1 test file (13 tests) covering preset loading and generate command with mocks.
No coverage for template rendering, file generation, CLI commands, or edge cases.

---

## Tasks

### 10.1 Template Rendering Tests

- [ ] Create `tests/template-engine.test.ts`
- [ ] Test basic variable injection: `renderTemplate('Hello {{name}}', { name: 'World' })` returns `'Hello World'`
- [ ] Test conditional blocks (`#eq` helper): render correct branch based on config
- [ ] Test empty/missing variables: handle gracefully (empty string, not `undefined`)
- [ ] Test all 8 templates render without error with a standard config
- [ ] Test each of the 4 presets renders all 8 templates without error

### 10.2 File Generator Tests

- [ ] Create `tests/file-generator.test.ts`
- [ ] Test `generateDocs` creates files in the output directory
- [ ] Test dry-run mode does NOT write any files
- [ ] Test force mode overwrites existing files
- [ ] Test backup is created before overwrite
- [ ] Test non-force mode skips existing files
- [ ] Use `fs-extra` with temporary directories for all file operation tests
- [ ] Clean up temp directories in `afterEach`

### 10.3 CLI Command Tests

- [ ] Create `tests/cli.test.ts`
- [ ] Test `init` command runs without error
- [ ] Test `generate --preset nextjs` produces correct output
- [ ] Test `generate --dry-run` produces log output but no files
- [ ] Test `presets` command lists all presets
- [ ] Test `analyze` command runs (even if placeholder)
- [ ] Test `validate` command runs
- [ ] Test `upgrade` command runs

### 10.4 Prompt Validation Tests

- [ ] Create `tests/validation.test.ts`
- [ ] Test `validators.projectName` accepts `my-app`, `my_app`, `myApp`
- [ ] Test `validators.projectName` rejects empty string, special chars, spaces
- [ ] Test `validators.projectName` rejects path separators (`../`, `/etc`)

### 10.5 Edge Case Tests

- [ ] Test empty project name handling
- [ ] Test invalid output paths (permission denied — skip if running as root)
- [ ] Test existing `/docs` directory with and without `--force`
- [ ] Test very long project names (> 100 chars)
- [ ] Test all 8 templates with minimal config (all fields "None")
- [ ] Test all 8 templates with maximal config (every field filled)

### 10.6 Test Infrastructure

- [ ] Add `coverage` directory to `.gitignore`
- [ ] Add `"test:coverage": "vitest run --coverage"` script (install `@vitest/coverage-v8`)
- [ ] Add `"test:ui": "vitest --ui"` script for test UI (install `@vitest/ui`)

---

## Verification

- [ ] `yarn test` passes with all new tests
- [ ] `yarn test:coverage` reports > 80% coverage
- [ ] Template rendering tests cover all 8 templates
- [ ] File generator tests use temp directories and clean up
