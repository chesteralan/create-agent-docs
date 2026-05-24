# Docs Site — GitHub Pages

Build a documentation site for create-agent-docs using VitePress and deploy to GitHub Pages.

---

## Overview

- **Framework**: VitePress (fast, Markdown-based, zero-config)
- **Deploy**: GitHub Pages via GitHub Actions
- **Content**: Migrate from README.md + inline docs to a proper site

---

## Tasks

### 1. Scaffold VitePress

**1.1 Install dependencies**
- [ ] Run `yarn add -D vitepress` (check peer dep compat with existing vite used by vitest)
- [ ] Verify `vitepress` appears in `devDependencies` in package.json

**1.2 Create VitePress config**
- [ ] Create `docs/.vitepress/config.ts`
- [ ] Set `title: 'create-agent-docs'`
- [ ] Set `description: 'AI-ready documentation scaffolding'`
- [ ] Set `base: '/create-agent-docs/'` (required for GitHub Pages project site)
- [ ] Configure `themeConfig.siteTitle: 'create-agent-docs'`
- [ ] Configure `themeConfig.logo` — none initially, add later in polish phase
- [ ] Configure `themeConfig.nav` with top nav links:
  - Guide → `/guide/`
  - Commands → `/commands/generate`
  - Presets → `/presets/`
  - Contributing → `/contributing/setup`
- [ ] Configure `themeConfig.socialLinks` with GitHub repo URL
- [ ] Configure `themeConfig.footer` with MIT license message
- [ ] Configure `themeConfig.editLink` pointing to `main` branch
- [ ] Configure `themeConfig.lastUpdated` enabled
- [ ] Configure `themeConfig.search` with mini-search (or algolia if needed)

**1.3 Create landing page**
- [ ] Create `docs/index.md`
- [ ] Hero section with CLI name, tagline, and version badge
- [ ] Features section (3 columns): "Stack Presets", "AI-Ready Docs", "CLI First"
- [ ] Quick start code block: `npx create-agent-docs generate --preset nextjs`
- [ ] Badge strip linking to npm, GitHub, license

**1.4 Add npm scripts**
- [ ] Add `"docs:dev": "vitepress dev docs"` to package.json scripts
- [ ] Add `"docs:build": "vitepress build docs"` to package.json scripts
- [ ] Add `"docs:preview": "vitepress preview docs"` to package.json scripts

**1.5 Verify scaffolding works**
- [ ] Run `yarn docs:dev` and confirm site loads at localhost
- [ ] Run `yarn docs:build` and confirm no errors

---

### 2. Core Pages

**2.1 What is it?** (`docs/guide/what-is-it.md`)
- [ ] Write project elevator pitch (2-3 paragraphs)
- [ ] The problem: projects lack structured docs for AI agents
- [ ] The solution: CLI that generates 8 doc files + AI config per tech stack
- [ ] Call to action: quick start link

**2.2 Getting started** (`docs/guide/getting-started.md`)
- [ ] Prerequisites: Node.js >= 18
- [ ] Installation methods: npx, global install, local dev dependency
- [ ] Quick start: `npx create-agent-docs generate --preset nextjs`
- [ ] Show expected output (the 10 generated files listing)
- [ ] Next steps links to usage guide and presets

**2.3 Usage guide** (`docs/guide/usage.md`)
- [ ] Interactive mode: walk through the 9 prompts with example session
- [ ] Preset mode: `--preset` flag usage with all flags
- [ ] Dry-run mode: `--dry-run` flag with preview example
- [ ] Force mode: `--force` and `--yes` flags
- [ ] Output directory: `--output` flag
- [ ] AI agent selection: how cursor/claude/codex/generic affects generated files
- [ ] Auto-detect: `--detect` flag with example output
- [ ] Custom JSON presets: format and usage with `--preset ./custom.json`

**2.4 Presets overview** (`docs/guide/presets.md`)
- [ ] What presets are (pre-filled configs that skip prompts)
- [ ] Table of all 14 presets with name, description, and key tech
- [ ] How to use: `--preset <name>` flag
- [ ] How custom JSON presets work with schema reference
- [ ] Link to individual preset pages (phase 5)

**2.5 Templates** (`docs/guide/templates.md`)
- [ ] List all 10 generated files with purpose description
- [ ] Table: File → Location → Purpose
- [ ] Template variables reference table
- [ ] Handlebars helpers: `{{#eq}}`, `{{#ne}}`, etc.
- [ ] How templates are structured (partials, conditional sections)
- [ ] How to customize templates (point to contributing guide)

---

### 3. Command Reference

**3.1 Sidebar configuration**
- [ ] Add `themeConfig.sidebar` commands section in `config.ts`
- [ ] Structure: Commands → init, generate, presets, analyze, validate, upgrade

**3.2 Init command** (`docs/commands/init.md`)
- [ ] Description: Initialize AI-ready documentation templates
- [ ] Usage: `create-agent-docs init [options]`
- [ ] Options table: `-d, --dry-run`, `-f, --force`
- [ ] Example with output

**3.3 Generate command** (`docs/commands/generate.md`)
- [ ] Description: Generate documentation files based on prompts
- [ ] Usage: `create-agent-docs generate [options]`
- [ ] Options table:
  - `-p, --preset <name>` — preset name or JSON path
  - `-f, --force` — overwrite without prompt
  - `-d, --dry-run` — preview without writing
  - `-y, --yes` — auto-confirm all prompts
  - `-o, --output <dir>` — output directory
  - `--detect` — auto-detect from package.json
- [ ] Multiple examples: interactive, preset, dry-run, detect, custom output

**3.4 Presets command** (`docs/commands/presets.md`)
- [ ] Description: List available stack presets
- [ ] Usage: `create-agent-docs presets`
- [ ] Example output showing all 14 presets
- [ ] JSON output option if supported (TBD)

**3.5 Analyze command** (`docs/commands/analyze.md`)
- [ ] Description: Analyze existing docs for completeness
- [ ] Usage: `create-agent-docs analyze [options]`
- [ ] Options: `--strict` (exit non-zero on missing files)
- [ ] Example output with pass/missing/stale indicators

**3.6 Validate command** (`docs/commands/validate.md`)
- [ ] Description: Validate rendered docs for unsubstituted variables
- [ ] Usage: `create-agent-docs validate [options]`
- [ ] Options: `--fix` (auto-insert missing section headers)
- [ ] Example output

**3.7 Upgrade command** (`docs/commands/upgrade.md`)
- [ ] Description: Check for CLI updates
- [ ] Usage: `create-agent-docs upgrade [options]`
- [ ] Options: `-d, --dry-run`
- [ ] Example output

---

### 4. Contributing & Project Docs

**4.1 Sidebar configuration**
- [ ] Add `themeConfig.sidebar` contributing section
- [ ] Structure: Contributing → Setup, Adding a Preset, Adding a Template, Release Process

**4.2 Dev setup** (`docs/contributing/setup.md`)
- [ ] Clone + install: `git clone`, `yarn install`, `yarn build`
- [ ] Dev commands table (build, dev, test, lint, format)
- [ ] Code style: TypeScript strict, ESLint, Prettier, ESM
- [ ] Testing guide: Vitest, how to run, how to write
- [ ] PR process: branch naming, conventional commits, pre-submit checks

**4.3 Adding a preset** (`docs/contributing/presets.md`)
- [ ] Step-by-step: create file, register, add tests, verify
- [ ] Code template for preset file
- [ ] Code template for registry entry
- [ ] Code template for test entry
- [ ] How to add framework-specific template sections

**4.4 Adding a template** (`docs/contributing/templates.md`)
- [ ] Step-by-step: create .hbs file, register in file-generator, add tests
- [ ] Template variables reference
- [ ] Handlebars helpers reference
- [ ] Partial system overview (header/footer)
- [ ] Conditional section pattern: `{{#eq backend "Firebase"}}`

**4.5 Release process** (`docs/contributing/releasing.md`)
- [ ] Version bump: `yarn version` or manual package.json edit
- [ ] Tag: `git tag vX.Y.Z`
- [ ] Push tags
- [ ] CI/CD: GitHub Action handles npm publish + GitHub Release
- [ ] Verify: `npx create-agent-docs --version`

**4.6 Changelog** (`docs/changelog.md`)
- [ ] Frontmatter with `editLink: false` (changelog lives in repo)
- [ ] Embed or link to CHANGELOG.md
- [ ] Latest version first, oldest last

---

### 5. Presets Reference

**5.1 Individual preset pages**
- [ ] Create `docs/presets/index.md` with overview and table of all 14 presets
- [ ] Create `docs/presets/nextjs.md` — Next.js + NextAuth + Redux + Jest
  - Config values, when to use, generated file examples
- [ ] Create `docs/presets/nextjs-saas.md` — SaaS stack
- [ ] Create `docs/presets/t3.md` — T3 stack
- [ ] Create `docs/presets/vue.md` — Vue + Pinia
- [ ] Create `docs/presets/angular.md` — Angular + Jest
- [ ] Create `docs/presets/express.md` — Express + PostgreSQL + JWT
- [ ] Create `docs/presets/nestjs.md` — NestJS + PostgreSQL + JWT
- [ ] Create `docs/presets/mern.md` — MERN stack
- [ ] Create `docs/presets/react-firebase.md` — React + Firebase
- [ ] Create `docs/presets/firebase.md` — Firebase serverless
- [ ] Create `docs/presets/ai-cursor.md` — Cursor-optimized
- [ ] Create `docs/presets/ai-claude.md` — Claude-optimized
- [ ] Create `docs/presets/ai-codex.md` — Codex-optimized
- [ ] Create `docs/presets/fastapi.md` — FastAPI (Python)
- [ ] Add presets sidebar in config.ts

**5.2 Preset page template (each preset page)**
- [ ] Description of what the preset generates
- [ ] Table of config values (projectName, frontend, backend, database, auth, state, testing, packageManager, aiAgent)
- [ ] When to use this preset
- [ ] Example CLI usage: `npx create-agent-docs generate --preset <name>`
- [ ] Framework-specific doc sections generated (e.g., Firebase → Firestore rules, Next.js → App Router)

---

### 6. GitHub Actions Deployment

**6.1 Create workflow**
- [ ] Create `.github/workflows/docs.yml`
- [ ] Trigger: `push` to `main`, `pull_request` to `main`
- [ ] Job: `build-and-deploy`
- [ ] `runs-on: ubuntu-latest`
- [ ] Permissions: `contents: read`, `pages: write`, `id-token: write`

**6.2 Build step**
- [ ] Checkout repo
- [ ] Setup Node 20 (or 24)
- [ ] Restore yarn cache
- [ ] `yarn install --frozen-lockfile`
- [ ] `yarn docs:build`

**6.3 Upload + deploy step**
- [ ] Use `actions/upload-pages-artifact@v3` with path `docs/.vitepress/dist`
- [ ] Use `actions/deploy-pages@v4` for deployment
- [ ] Environment name: `github-pages`
- [ ] URL: auto-generated from the environment

**6.4 Test the workflow**
- [ ] Push to `docs` branch (or PR) and verify workflow runs
- [ ] Fix any build errors
- [ ] Verify deploy artifact is created

---

### 7. Polish

**7.1 Theme customization**
- [ ] Create `docs/.vitepress/theme/index.ts`
- [ ] Import default theme
- [ ] Export enhanced theme with custom CSS
- [ ] Create `docs/.vitepress/theme/custom.css`
- [ ] Set CSS variables matching CLI banner:
  - `--vp-c-brand-1`: `#00d2ff` (cyan accent)
  - `--vp-c-brand-2`: `#3a7bd5` (blue accent)
  - `--vp-c-brand-3`: `#1a1a2e` (dark background)
  - `--vp-home-hero-name-color`: `#00d2ff`
  - Gradient hero name effect

**7.2 Visual assets**
- [ ] Convert `.github/banner.svg` to a square logo for the nav bar
- [ ] Or create a simple `docs/public/logo.svg`
- [ ] Add `docs/public/favicon.svg` — simple CLI icon (terminal `>_` symbol)
- [ ] Link favicon in `config.ts` head

**7.3 Search**
- [ ] Verify mini-search works (built into VitePress, just needs `themeConfig.search` config)
- [ ] Test search indexing across all pages

**7.4 Edit links**
- [ ] Verify `themeConfig.editLink` points to `https://github.com/chesteralan/create-agent-docs/edit/main/docs/`
- [ ] Test edit link on a few pages

**7.5 Homepage polish**
- [ ] Add CLI asciicast or demo GIF if available, or use code block
- [ ] Add npm version badge + build badge to hero section
- [ ] Add feature icons (use emoji or SVG)

---

### 8. Launch

**8.1 Enable GitHub Pages**
- [ ] In repo Settings → Pages → Source: "GitHub Actions"
- [ ] Verify the docs workflow has `environment: github-pages` config
- [ ] Optional: configure custom domain

**8.2 Verify live site**
- [ ] Visit `https://chesteralan.github.io/create-agent-docs/`
- [ ] Check all pages render
- [ ] Check navigation works
- [ ] Check search works
- [ ] Check mobile layout

**8.3 Add badge**
- [ ] Add docs badge to README.md:
  `[![docs](https://img.shields.io/badge/docs-v1.0.0-blue)](https://chesteralan.github.io/create-agent-docs/)`

**8.4 Add docs link to CLI**
- [ ] Add `--help` footer: `Full documentation: https://chesteralan.github.io/create-agent-docs/`
- [ ] Add link to startup banner or as a `--docs` flag

---

## Verification

- [ ] `yarn docs:dev` serves the site locally with hot-reload
- [ ] `yarn docs:build` succeeds with zero warnings
- [ ] All 20+ Markdown pages render correctly
- [ ] Sidebar navigation shows all sections
- [ ] Prev/next page links work at bottom of each page
- [ ] Mini-search returns relevant results
- [ ] GitHub Actions workflow completes successfully
- [ ] Live URL loads all assets (CSS, JS, images)
- [ ] Mobile responsive layout works
- [ ] Edit link on each page opens correct GitHub file
