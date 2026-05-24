# F11 — CI/CD template generation

**Tier:** 3 — High Impact, High Effort  
**Effort:** 3-4 hours

## Problem

Scanner detects CI/CD files but templates never generate them.

## Task

Add template set for GitHub Actions workflows, Dockerfile, docker-compose.yml, and platform-specific configs based on detected or prompted choices.

## Acceptance Criteria

- [ ] Generates GitHub Actions CI workflow based on detected stack
- [ ] Generates `Dockerfile` with appropriate base image
- [ ] Generates `docker-compose.yml` if applicable
- [ ] Platform-specific configs generated when detected
- [ ] User prompted for CI/CD provider selection if ambiguous
- [ ] All templates follow existing Handlebars conventions

## Files

- New templates in `src/templates/workflows/`
- New templates in `src/templates/`
- New prompt for CI/CD provider selection
