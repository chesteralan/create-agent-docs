# F24 — `.cursorrules` for this project

**Tier:** 5 — Lower Priority  
**Effort:** 30 min

## Problem

No Cursor configuration for the repository itself.

## Task

Add `.cursorrules` file to the repo for better AI-assisted development of this project.

## Acceptance Criteria

- [x] `.cursorrules` added to project root
- [x] Rules cover code style, conventions, and project structure

## Concrete Plan

1. **Create `.cursorrules`** at project root:
   ```
   You are working on create-agent-docs, a CLI scaffolding tool.
   
   ## Project Structure
   - src/ — TypeScript source
   - src/presets/ — Stack presets (Partial<ProjectConfig> exports)
   - src/templates/ — Handlebars templates (*.hbs)
   - src/generators/ — file-generator, template-engine, backup
   - src/commands/ — CLI commands (generate, validate, analyze, etc.)
   - src/prompts/ — Interactive prompts (@inquirer/prompts)
   - src/analyzers/ — Project scanner, architecture analyzer
   - features/ — Feature task files
   - tests/ — Vitest tests
   
   ## Code Conventions
   - TypeScript with strict mode
   - ESM modules (import/export)
   - No JSDoc comments unless exporting public API
   - No emoji in output
   - Handlebars for templates, partials for reusable snippets
   - Use chalk for terminal colors
   - Use @inquirer/prompts for interactive prompts
   - Use fs-extra for file operations
   - Use ora for spinners
   
   ## Testing
   - Vitest for testing
   - Snapshots for template regression
   - Temp directories for file-generation tests
   
   ## Architecture
   - Commands call generators, generators use templates
   - Presets are Partial<ProjectConfig> objects
   - Scanner detects project config, prompts fill in gaps
   - Config merging: CLI flags > config file > preset > defaults
   ```

## Files

- `.cursorrules` (new)
