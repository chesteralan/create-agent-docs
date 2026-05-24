# F20 — Markdown linting of generated output

**Tier:** 5 — Lower Priority  
**Effort:** 2 hours

## Problem

Generated Markdown files may have formatting inconsistencies.

## Task

Run prettier (or a Markdown linter) on generated `.md` files after generation.

## Acceptance Criteria

- [ ] Generated `.md` files are auto-formatted
- [ ] Configurable formatting options
- [ ] No broken formatting after linting

## Files

`src/generators/file-generator.ts`
