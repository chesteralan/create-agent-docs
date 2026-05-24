# F20 — Markdown linting of generated output

**Tier:** 5 — Lower Priority  
**Effort:** 2 hours

## Problem

Generated Markdown files may have formatting inconsistencies.

## Task

Run prettier (or a Markdown linter) on generated `.md` files after generation.

## Acceptance Criteria

- [x] Generated `.md` files are auto-formatted
- [x] Configurable formatting options
- [x] No broken formatting after linting

## Concrete Plan

1. **In `src/generators/file-generator.ts`**, after writing each file, optionally format it:
   ```ts
   async function formatMarkdown(content: string): Promise<string> {
     try {
       // Use prettier if available (it's a devDependency)
       const prettier = await import('prettier');
       return await prettier.format(content, { parser: 'markdown' });
     } catch {
       return content; // fallback if prettier not available at runtime
     }
   }
   ```

2. **Apply before writing**:
   ```ts
   const rendered = renderTemplate(templateContent, renderContext);
   const formatted = await formatMarkdown(rendered);
   fs.writeFileSync(outputPath, formatted, 'utf8');
   ```

3. **Note**: `prettier` is currently a devDependency. For runtime formatting, it should be moved to `dependencies` or made optional (try/catch). Alternative: use a lightweight formatter.

4. **Add `--no-format` flag** to `generate` command for users who prefer their own formatting:
   ```ts
   .option('--no-format', 'skip markdown formatting')
   ```

## Files

- `src/generators/file-generator.ts`
- `src/cli.ts`
