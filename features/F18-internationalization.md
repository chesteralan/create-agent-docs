# F18 — Internationalization (i18n)

**Tier:** 4 — Medium Impact, High Effort  
**Effort:** 6-8 hours

## Problem

All templates and prompts are English-only. Limits global adoption.

## Task

Extract all prompt messages and template strings into locale JSON files. Add `--lang` flag (default: `en`). Load locale at startup, pass `locale` context to Handlebars. Provide community contribution path for new locales.

## Acceptance Criteria

- [ ] All prompt strings extracted to locale JSON files
- [ ] Template strings extracted to locale JSON files
- [ ] `--lang` flag accepts locale codes (e.g., `en`, `zh`, `ja`)
- [ ] Locale loaded at startup and applied globally
- [ ] `locale` context passed to Handlebars for template use
- [ ] At least one additional locale implemented
- [ ] Contribution guide for new locales documented
- [ ] Non-breaking — default is `en` with no config change needed

## Files

- `src/locales/` (new directory)
- `src/prompts/index.ts`
- `src/generators/template-engine.ts`
- All templates
