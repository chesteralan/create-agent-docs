# Phase 11 — Documentation

## Status: Not Started (~15% done)

Minimal README with preset examples. No CONTRIBUTING, CHANGELOG, CODE_OF_CONDUCT,
or SECURITY files.

---

## Tasks

### 11.1 Improve README.md

Replace the minimal README with a comprehensive one:

- [ ] **Title & Badges**: Add npm version, build status, license badges
- [ ] **Quick Start**: One-liner install + first command
- [ ] **Installation**: `npx create-agent-docs`, global install, project install
- [ ] **Usage**: Full command reference table with all flags
- [ ] **Presets**: Already exists — keep and expand with new presets
- [ ] **Examples**: 3-4 concrete examples with expected output
- [ ] **Templates**: What gets generated, how to customize
- [ ] **Configuration**: Environment variables, config file support
- [ ] **Troubleshooting**: Common issues and solutions
- [ ] **Contributing**: Link to CONTRIBUTING.md

### 11.2 Create CONTRIBUTING.md

- [ ] Development setup: `git clone`, `yarn install`, `yarn build`
- [ ] Code style: ESLint + Prettier config
- [ ] Testing: `yarn test`, writing tests, coverage
- [ ] Pull request process: branch naming, commit message format
- [ ] Adding a new preset: step-by-step guide with template
- [ ] Adding a new template: file naming, variable conventions

### 11.3 Create CHANGELOG.md

- [ ] Keep a `CHANGELOG.md` with format:
  ```markdown
  ## [0.3.1] - 2026-05-23
  ### Added
  - Stack presets: nextjs, vue, angular, firebase
  - `--preset` flag for generate command
  - `presets` subcommand to list available presets
  - Custom JSON preset support
  ### Fixed
  - generateCommand now actually calls loadPreset
  - Preset file extension detection for dev/prod
  ```
- [ ] Document v0.1.0 (initial release) through current

### 11.4 Create CODE_OF_CONDUCT.md

- [ ] Use the [Contributor Covenant](https://www.contributor-covenant.org/) template
- [ ] Adapt contact information for the project

### 11.5 Create SECURITY.md

- [ ] How to report a security vulnerability
- [ ] Supported versions
- [ ] Disclosure policy

### 11.6 Create EXAMPLES Directory

- [ ] Create `examples/nextjs-output/` with sample output from `generate --preset nextjs`
- [ ] Create `examples/firebase-output/` with sample output from `generate --preset firebase`
- [ ] Each example contains the full generated `/docs/` folder

---

## Verification

- [ ] README is comprehensive and includes all command docs
- [ ] CONTRIBUTING.md has a "add a preset" guide
- [ ] CHANGELOG.md covers all versions
- [ ] Examples directory has real sample output
