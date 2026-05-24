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

## Concrete Plan

1. **Create `src/utils/ai.ts`**:
   ```ts
   import fs from 'fs-extra';
   import path from 'path';
   import { execSync } from 'child_process';
   
   export interface AiSuggestion {
     section: string;
     reason: string;
     suggestedFile: string;
   }
   
   function getApiKey(): string {
     return process.env.OPENAI_API_KEY || '';
   }
   
   function buildProjectContext(dir: string): string {
     const parts: string[] = [];
     
     // Read package.json
     const pkgPath = path.join(dir, 'package.json');
     if (fs.existsSync(pkgPath)) {
       const pkg = fs.readJsonSync(pkgPath);
       parts.push(`Project: ${pkg.name || 'unknown'}`);
       parts.push(`Dependencies: ${Object.keys(pkg.dependencies || {}).join(', ')}`);
     }
     
     // List source files
     const srcDir = path.join(dir, 'src');
     if (fs.existsSync(srcDir)) {
       const files = getFilesRecursive(srcDir);
       parts.push(`Source files (${files.length}): ${files.slice(0, 20).join(', ')}`);
     }
     
     return parts.join('\n');
   }
   
   export async function analyzeWithAI(dir: string): Promise<AiSuggestion[]> {
     const apiKey = getApiKey();
     if (!apiKey) {
       throw new Error('OPENAI_API_KEY not set');
     }
     
     const context = buildProjectContext(dir);
     
     const response = await fetch('https://api.openai.com/v1/chat/completions', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${apiKey}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         model: 'gpt-4o-mini',
         messages: [
           {
             role: 'system',
             content: 'You analyze software projects and suggest documentation sections. Return JSON array.',
           },
           {
             role: 'user',
             content: `Analyze this project and suggest documentation sections not covered by standard templates:\n${context}`,
           },
         ],
         response_format: { type: 'json_object' },
       }),
     });
     
     const data = await response.json();
     return parseSuggestions(data);
   }
   
   function parseSuggestions(data: any): AiSuggestion[] {
     try {
       const content = JSON.parse(data.choices[0].message.content);
       return content.suggestions || [];
     } catch {
       return [];
     }
   }
   ```

2. **Update `src/commands/analyze.ts`** to add `--ai` flag handling:
   ```ts
   if (options.ai) {
     logger.info('Running AI-powered analysis...');
     const suggestions = await analyzeWithAI(process.cwd());
     if (suggestions.length === 0) {
       logger.info('No AI suggestions. Try setting OPENAI_API_KEY.');
       return;
     }
     logger.header('AI Suggestions');
     for (const s of suggestions) {
       logger.info(`  [${s.suggestedFile}] ${s.section}`);
       logger.info(`    ${s.reason}`);
     }
   }
   ```

3. **Add `--ai` flag** in `src/cli.ts` on `analyze` command:
   ```ts
   .option('--ai', 'use AI (OpenAI) to suggest missing documentation')
   ```

4. **Handle errors gracefully** — network failure, missing API key, etc. should not crash.

## Files

- `src/utils/ai.ts` (new)
- `src/commands/analyze.ts`
- `src/cli.ts`
