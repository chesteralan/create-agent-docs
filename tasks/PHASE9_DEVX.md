# Phase 9 — Developer Experience

## Status: In Progress (~30% done)

Logger exists with info/success/warn/error. Missing: loading spinners,
verbose/debug modes, performance optimizations.

---

## Tasks

### 9.1 Loading Spinners

- [ ] `ora` is already installed — import and use in long-running operations
- [ ] Wrap `generateDocs` with a spinner: `Generating documentation files...`
- [ ] Wrap `loadBuiltinPreset` with a spinner when dynamically importing
- [ ] Wrap template rendering loop with a spinner per file
- [ ] Stop spinner on success/error with appropriate message

### 9.2 Verbose Mode

- [ ] Add `--verbose` / `-v` global flag to CLI (`program.option('-v, --verbose', 'verbose output')`)
- [ ] Create `src/utils/debug.ts` that exports `isVerbose` state
- [ ] When verbose, log: file paths being read, template compilation steps, preset resolution paths
- [ ] When not verbose, suppress detailed logs (only show info/success/warn/error)

### 9.3 Debug Mode

- [ ] Add `--debug` global flag that:
  - Enables verbose mode automatically
  - Logs stack traces for errors
  - Logs Handlebars template compilation details
  - Logs file read/write operations with byte counts
- [ ] Create `src/utils/debug.ts` with `isDebug`, `debugLog()`, `debugError()` utilities

### 9.4 Performance

- [ ] Cache compiled Handlebars templates in a `Map<string, Template>` keyed by filename
- [ ] Only re-compile when template file changes (check mtime)
- [ ] Lazy-load presets — only import the requested preset, not all at startup
- [ ] Measure and log startup time in debug mode

### 9.5 Colored Output Consistency

- [ ] Audit all `logger.info` / `logger.warn` / `logger.error` calls for consistent formatting
- [ ] Use `logger.bold()` for file paths and command names consistently
- [ ] Add `logger.success()` for completion messages
- [ ] Add `logger.header()` for section titles in multi-line output

---

## Verification

- [ ] `yarn test` passes
- [ ] Spinner shows during file generation
- [ ] `--verbose` shows detailed operation logs
- [ ] `--debug` shows stack traces and compilation details
- [ ] Repeated `generate` calls compile templates only once
