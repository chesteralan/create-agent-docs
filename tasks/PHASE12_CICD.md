# Phase 12 — CI/CD

## Status: Not Started (0% done)

No `.github/` directory, no workflows, no quality gates.

---

## Tasks

### 12.1 Lint Workflow

- [ ] Create `.github/workflows/lint.yml`:
  - Trigger: `push` to `main`, `pull_request` to `main`
  - Steps: checkout, setup Node (20), install deps via yarn, run `yarn lint`
  - Fail if any lint errors

### 12.2 Test Workflow

- [ ] Create `.github/workflows/test.yml`:
  - Trigger: `push` to `main`, `pull_request` to `main`
  - Strategy matrix: Node 18, 20, 22
  - Steps: checkout, setup Node, install deps, run `yarn build`, run `yarn test`
  - Upload coverage report as artifact

### 12.3 Build Workflow

- [ ] Create `.github/workflows/build.yml`:
  - Trigger: `push` to `main`, `pull_request` to `main`
  - Steps: checkout, setup Node, install deps, run `yarn build`
  - Verify the built binary works: `node ./dist/cli.js --version`
  - Cache `node_modules` for faster subsequent runs

### 12.4 Release Workflow

- [ ] Create `.github/workflows/release.yml`:
  - Trigger: `push` with a tag matching `v*.*.*`
  - Steps: checkout, setup Node, install deps, run `yarn build`, run `yarn test`
  - Create GitHub Release with auto-generated changelog from tag
  - Publish to npm (uses `NPM_TOKEN` secret)
  - Attach build artifacts to release

### 12.5 Quality Gates

- [ ] Add `"test:ci": "vitest run --reporter=verbose"` script
- [ ] Add branch protection rules documentation (CONTRIBUTING.md section)
- [ ] Make PR checks required in repo settings (docs in CONTRIBUTING.md)

---

## Verification

- [ ] All workflows pass on push/PR
- [ ] `yarn build` produces a working binary
- [ ] Release workflow creates GitHub Release and publishes to npm
