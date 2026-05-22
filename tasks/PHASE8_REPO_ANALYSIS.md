# Phase 8 — Repo Analysis

## Status: Not Started (0% done)

`analyze` command is a placeholder that calls `generateDocs`.

---

## Tasks

### 8.1 Codebase Scanner

- [ ] Create `src/analyzers/scanner.ts`:
  - Read `package.json` to detect framework (`next`, `react`, `vue`, `angular`), testing framework (`jest`, `vitest`, `playwright`), package manager (`yarn`, `npm`, `pnpm`, `bun`)
  - Read `tsconfig.json` to detect TypeScript strictness, target
  - Scan for key config files: `.eslintrc`, `.prettierrc`, `Dockerfile`, `docker-compose.yml`
  - Scan for `/docs/` directory and list existing documentation files
  - Detect backend: check for `server/`, `api/`, `functions/` directories; check for `express`, `fastify`, `nest` in dependencies

### 8.2 Auto-Configure from Detection

- [ ] When running `generate` without `--preset`, auto-detect settings:
  - If `package.json` has `next`, default `frontendFramework` to `'Next.js'`
  - If `jest` is a devDep, default `testingFramework` to `'Jest'`
  - If `firebase` or `firebase-admin` is a dep, default `backend` to `'Firebase'`
- [ ] Show detected values and allow override via prompts
- [ ] Add `--detect` flag to `generate` command that runs scanner before prompting

### 8.3 Architecture Summary Generator

- [ ] Create `src/analyzers/architecture.ts` that generates an architecture summary based on detected stack:
  - Framework + version
  - Backend + database
  - Auth strategy
  - Testing setup
  - CI/CD config
- [ ] Output as JSON for use in template rendering
- [ ] Include in generated docs as an architecture overview section

### 8.4 Dependency Map Generator

- [ ] Scan `package.json` `dependencies` and `devDependencies`
- [ ] Categorize: frontend, backend, database, testing, tooling, AI/ML
- [ ] Generate a dependency summary section in `ARCHITECTURE.md`

---

## Verification

- [ ] `yarn test` passes
- [ ] Scanner correctly identifies a Next.js project with Jest
- [ ] `--detect` flag pre-fills prompt answers
- [ ] Architecture summary is accurate and useful
