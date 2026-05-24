# Phase 12 — CI/CD

## Status: ✅ Complete

All items implemented.

---

## Changes Made

### 12.1 Lint Workflow
- `.github/workflows/lint.yml` — `push`/`pull_request` to `main`, Node 20, `yarn lint`

### 12.2 Test Workflow
- `.github/workflows/test.yml` — `push`/`pull_request` to `main`, matrix Node 18/20/22, `yarn build` + `yarn test:ci`

### 12.3 Build Workflow
- `.github/workflows/build.yml` — `push`/`pull_request` to `main`, Node 20, `yarn build`, verify binary

### 12.4 Release Workflow
- `.github/workflows/release.yml` — tag push `v*.*.*`, build + test + npm publish + GitHub Release

### 12.5 Quality Gates
- `test:ci` script added: `vitest run --reporter=verbose`
- Branch protection documented in CONTRIBUTING.md
