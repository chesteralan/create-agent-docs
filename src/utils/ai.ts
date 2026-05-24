import fs from 'fs-extra';
import path from 'path';

const AI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini';

export interface AiSuggestion {
  section: string;
  reason: string;
  suggestedFile: string;
}

export interface AiAnalyzeOptions {
  endpoint?: string;
  model?: string;
}

function getApiKey(): string {
  return process.env.OPENAI_API_KEY || '';
}

function buildProjectContext(dir: string): string {
  const parts: string[] = [];

  const pkgPath = path.join(dir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = fs.readJsonSync(pkgPath);
      parts.push(`Project: ${pkg.name || 'unknown'}`);
      if (pkg.description) parts.push(`Description: ${pkg.description}`);
      parts.push(`Dependencies: ${Object.keys(pkg.dependencies || {}).join(', ')}`);
      parts.push(`Dev Dependencies: ${Object.keys(pkg.devDependencies || {}).join(', ')}`);
    } catch { /* ignore */ }
  }

  const srcDir = path.join(dir, 'src');
  if (fs.existsSync(srcDir)) {
    const files = getFilesRecursive(srcDir);
    parts.push(`Source files (showing up to 30): ${files.slice(0, 30).join(', ')}`);
  }

  const docsDir = path.join(dir, 'docs');
  if (fs.existsSync(docsDir)) {
    try {
      const docFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
      parts.push(`Existing docs: ${docFiles.join(', ')}`);
    } catch { /* ignore */ }
  }

  const tsconfigPath = path.join(dir, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    parts.push('Has TypeScript config');
  }

  return parts.join('\n');
}

function getFilesRecursive(dir: string): string[] {
  const results: string[] = [];
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        if (!entry.startsWith('.') && entry !== 'node_modules') {
          results.push(...getFilesRecursive(full));
        }
      } else {
        results.push(path.relative(process.cwd(), full));
      }
    }
  } catch { /* ignore */ }
  return results;
}

export async function analyzeWithAI(
  dir: string,
  options: AiAnalyzeOptions = {},
): Promise<AiSuggestion[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY environment variable not set. ' +
      'Set it to use --ai analysis, e.g.: OPENAI_API_KEY=sk-... create-agent-docs analyze --ai',
    );
  }

  const context = buildProjectContext(dir);
  const endpoint = options.endpoint || AI_ENDPOINT;
  const model = options.model || DEFAULT_MODEL;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a documentation expert. Analyze the given project and suggest documentation sections that are not covered by standard templates. Return a JSON object with a "suggestions" array, where each item has "section" (string), "reason" (string), and "suggestedFile" (string, a filename like "SECURITY.md" or "DEPLOYMENT.md").',
          },
          {
            role: 'user',
            content: `Analyze this project and suggest documentation sections not covered by standard templates:\n${context}`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });
  } catch (err: any) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      throw new Error('AI API request timed out after 30s. Check your network connection.', { cause: err });
    }
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      throw new Error(`Network error: unable to reach ${new URL(endpoint).hostname}. Check your internet connection.`, { cause: err });
    }
    throw new Error(`AI API request failed: ${err.message || err}`, { cause: err });
  }

  if (!response.ok) {
    const body = await response.text();
    if (response.status === 401) {
      throw new Error('Invalid API key. Check your OPENAI_API_KEY environment variable.');
    }
    if (response.status === 429) {
      throw new Error('Rate limited by AI API. Please wait and try again.');
    }
    throw new Error(`AI API request failed (${response.status}): ${body.slice(0, 500)}`);
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error('Failed to parse AI API response. The server returned invalid JSON.');
  }

  const suggestions = parseSuggestions(data);
  if (!Array.isArray(suggestions)) {
    throw new Error('AI response did not contain a valid suggestions array.');
  }

  return suggestions;
}

function parseSuggestions(data: any): AiSuggestion[] {
  try {
    const content = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    return content.suggestions || [];
  } catch {
    return [];
  }
}
