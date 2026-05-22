# Phase 6 — Stack Presets Expansion

## Status: In Progress (~70% done)

4 built-in presets (nextjs, vue, angular, firebase) work with full CLI integration,
custom JSON support, and tests. Missing: full-stack presets, backend presets.

---

## Tasks

### 6.1 Backend Presets

- [ ] Create `src/presets/express.ts` — `{ backend: 'Express', database: 'PostgreSQL', ... }`
- [ ] Create `src/presets/nestjs.ts` — `{ backend: 'NestJS', database: 'PostgreSQL', ... }`
- [ ] Register both in `PRESET_REGISTRY` in `src/utils/preset.ts`

### 6.2 Full-Stack Presets

- [ ] Create `src/presets/react-firebase.ts` — React + Vite frontend, Firebase backend, Firestore DB, Firebase Auth
- [ ] Create `src/presets/nextjs-saas.ts` — Next.js, NextAuth, PostgreSQL, Prisma (noted as future)
- [ ] Create `src/presets/mern.ts` — React, Express, MongoDB, JWT Auth
- [ ] Create `src/presets/t3.ts` — Next.js, tRPC, Prisma, Tailwind, NextAuth
- [ ] Register all in `PRESET_REGISTRY`

### 6.3 Framework-Specific Template Sections

- [ ] In `ARCHITECTURE.md.hbs`, add `{{#eq frontendFramework "Next.js"}}` section covering App Router, Server Components, etc.
- [ ] In `AGENTS.md.hbs`, add `{{#eq backend "Firebase"}}` section with Firestore rules, security tips, etc.
- [ ] In `API_CONTRACTS.md.hbs`, add `{{#eq backend "Express"}}` section for REST endpoint patterns
- [ ] Review all 8 templates for framework-specific opportunities

### 6.4 Preset Validation

- [ ] Add a `validatePreset` function that checks all required `ProjectConfig` keys are present
- [ ] When loading a custom JSON preset, validate and warn on missing keys
- [ ] Provide default values for missing optional fields

---

## Verification

- [ ] `yarn test` passes with tests for all new presets
- [ ] `create-agent-docs presets` lists all new presets
- [ ] Each preset generates docs with appropriate framework-specific sections
