# Phase 6 — Stack Presets Expansion

## Status: ✅ Complete

All items implemented.

---

## Changes Made

- **14 presets**: nextjs, nextjs-saas, t3, vue, angular, express, nestjs, mern, react-firebase, firebase, ai-cursor, ai-claude, ai-codex, fastapi
- **`src/utils/preset.ts`** — `PRESET_REGISTRY` expanded from 7 to 14 entries; JSON preset loading now validates via `validatePreset()`
- **`src/utils/validation.ts`** — new `validatePreset()` function checks all required `ProjectConfig` keys are present
- **`src/templates/ARCHITECTURE.md.hbs`** — added Next.js App Router section + FastAPI backend section (conditional)
- **`src/templates/API_CONTRACTS.md.hbs`** — added Express REST patterns, FastAPI patterns, and Firebase integration sections
- **`src/templates/CODEBASE_MAP.md.hbs`** — added FastAPI directory structure + NestJS structure
- **`src/templates/AGENTS.md.hbs`** — added Firebase-Specific Guidelines section
- **Tests**: preset count check made robust; added `validatePreset` tests; all presets load and render correctly
