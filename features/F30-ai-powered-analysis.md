# F30 — AI-powered analysis (`analyze --ai`)

**Tier:** 5 — Lower Priority  
**Effort:** 8 hours

## Problem

No LLM-powered analysis to suggest missing docs sections.

## Task

Use an LLM (OpenAI API or similar) to analyze the project and suggest missing documentation sections.

## Acceptance Criteria

- [ ] `analyze --ai` analyzes project and suggests docs sections
- [ ] Configurable API endpoint and model
- [ ] API key configuration (env var or config file)
- [ ] Suggests sections not covered by existing templates
- [ ] Output can be piped into generation workflow
- [ ] Respects `--dry-run` for preview
- [ ] Opt-in (requires explicit `--ai` flag)

## Files

- `src/commands/analyze.ts`
- `src/utils/ai.ts` (new)
