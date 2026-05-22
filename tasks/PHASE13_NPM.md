# Phase 13 — npm Publishing

## Status: In Progress (~30% done)

package.json is configured with name, version, bin, main entry, and files.
Not published. Missing keywords, prepublish scripts.

---

## Tasks

### 13.1 Package Metadata Polish

- [ ] Add `"keywords"` field to `package.json`:
  ```json
  "keywords": [
    "documentation", "ai", "agent", "scaffold", "cli",
    "nextjs", "react", "vue", "angular", "firebase",
    "cursor", "claude", "codex", "developer-tools"
  ]
  ```
- [ ] Add `"repository"` field:
  ```json
  "repository": {
    "type": "git",
    "url": "git+https://github.com/anomalyco/create-agent-docs.git"
  }
  ```
- [ ] Add `"homepage"` field (GitHub repo URL)
- [ ] Add `"bugs"` field (GitHub issues URL)
- [ ] Add `"engines"` field: `{ "node": ">=18" }`
- [ ] Add `"license"` field if missing (should be MIT)

### 13.2 Prepublish Scripts

- [ ] Add `"prepublishOnly": "yarn build && yarn test"` script
- [ ] Add `"prepack": "yarn build"` script to ensure dist is fresh

### 13.3 Publishing Setup

- [ ] Create `.npmrc`:
  ```
  //registry.npmjs.org/:_authToken=${NPM_TOKEN}
  ```
- [ ] Add `publishConfig` to `package.json`:
  ```json
  "publishConfig": {
    "access": "public"
  }
  ```
- [ ] Document publishing steps in CONTRIBUTING.md:
  1. Bump version in `package.json`
  2. Create git tag `vx.y.z`
  3. Push tag: `git push origin vx.y.z`
  4. GitHub Action publishes to npm automatically (or `npm publish` manually)

### 13.4 Post-Publish Verification

- [ ] Verify `npx create-agent-docs` works (pulls from npm)
- [ ] Verify `npx create-agent-docs --version` shows correct version
- [ ] Verify `npx create-agent-docs generate --preset nextjs` works end-to-end

---

## Verification

- [ ] `npm pack` produces a tarball with only `dist/`, `README.md`, `LICENSE`
- [ ] `yarn test` passes
- [ ] `npx create-agent-docs` works after publish
