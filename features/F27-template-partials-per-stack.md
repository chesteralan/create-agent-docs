# F27 — Template partials per-stack

**Tier:** 5 — Lower Priority  
**Effort:** 2 hours

## Problem

No stack-specific partials for reusable template fragments.

## Task

Create stack-specific Handlebars partials (Firebase, Next.js, etc.) for reusable documentation fragments.

## Acceptance Criteria

- [ ] Stack-specific partials registered in Handlebars
- [ ] Partials loaded based on detected/selected stack
- [ ] Templates can reference `{{> stackPartial}}`

## Files

`src/generators/template-engine.ts`
