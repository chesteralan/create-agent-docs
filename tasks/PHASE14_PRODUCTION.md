# Phase 14 — Production Readiness

## Status: In Progress (~20% done)

Basic CLI structure, error handling, and input validation exist. Missing:
security hardening, performance optimization, UX polish.

---

## Tasks

### 14.1 Input Sanitization Hardening

- [ ] In `validation.ts`, add `sanitizePath(input: string)` that rejects:
  - Path traversal sequences (`../`, `..\\`, `%2e%2e`)
  - Null bytes
  - Shell metacharacters (`;`, `|`, `` ` ``, `$()` )
- [ ] Apply sanitizer to `--output` path and project name
- [ ] Add `validateOutputPath` that checks the resolved path is within the project directory (or a reasonable parent)

### 14.2 Filesystem Safety

- [ ] In `file-generator.ts`, wrap all `fs.writeFileSync` calls in try/catch
- [ ] Handle `EPERM` (permission denied) with clear message: `"Permission denied: unable to write to <path>. Try running with elevated permissions or choose a different output directory."`
- [ ] Handle `ENOSPC` (disk full) with: `"Not enough disk space. Free up space and try again."`
- [ ] Handle `EEXIST` for directory creation (shouldn't happen, but guard against it)

### 14.3 Error Recovery

- [ ] If file generation fails partway through, report which files succeeded and which failed
- [ ] Don't leave partially generated files — clean up on failure (unless `--dry-run`)
- [ ] Add `--continue-on-error` flag that skips failed files instead of aborting

### 14.4 Performance Optimization

- [ ] Lazy-load prompt modules — only import `@inquirer/prompts` when prompts are needed
- [ ] Cache Handlebars compiled templates (reuse across multiple renders)
- [ ] Use `fs.readFileSync` with `utf8` encoding explicitly (already done, verify)
- [ ] Profile startup time: measure from import to first prompt and optimize slow imports

### 14.5 UX Polish

- [ ] Add a startup banner with version and project name:
  ```
  ╔══════════════════════════════════════╗
  ║     create-agent-docs v0.3.1         ║
  ║  AI-ready documentation scaffolding  ║
  ╚══════════════════════════════════════╝
  ```
- [ ] Show elapsed time at end: `"Done in 2.3s"`
- [ ] Consistent exit codes: 0 = success, 1 = error, 2 = validation failure

---

## Verification

- [ ] `yarn test` passes
- [ ] Path traversal attempts are rejected with clear error
- [ ] Disk full / permission denied produce user-friendly messages
- [ ] Partially failed generation cleans up and reports accurately
- [ ] Startup feels snappy (< 500ms to first prompt)
