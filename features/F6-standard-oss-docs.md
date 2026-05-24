# F6 — Standard OSS document generation

**Tier:** 2 — High Impact, Medium Effort  
**Effort:** 2-3 hours

## Problem

The tool generates 8 AI-agent doc files but no standard project README, CONTRIBUTING, CHANGELOG, or LICENSE.

## Task

Add a `--standard` flag or new template category that generates standard OSS documents with stack-appropriate content.

## Acceptance Criteria

- [ ] New `--standard` flag (or equivalent) available
- [ ] Generates `README.md` with stack-appropriate content
- [ ] Generates `CHANGELOG.md`
- [ ] Generates `CONTRIBUTING.md`
- [ ] Generates `CODE_OF_CONDUCT.md`
- [ ] Generates `SECURITY.md`
- [ ] Generates `LICENSE` with license selection (MIT/Apache/GPL)
- [ ] Templates use Handlebars and match project conventions
- [ ] Tests pass

## Files

- New templates in `src/templates/`
- `src/generators/file-generator.ts`
- Types updates
