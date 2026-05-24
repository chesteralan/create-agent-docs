import fs from 'fs-extra';
import path from 'path';
import { debugLog } from './debug.js';
import { logger } from './logger.js';

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function getApiKey(): string {
  return process.env.GEMINI_API_KEY || '';
}

function buildEnhancePrompt(config: Record<string, any>, files: Record<string, string>): string {
  const fileBlocks = Object.entries(files)
    .map(([name, content]) => `### ${name}\n\n\`\`\`markdown\n${content}\n\`\`\``)
    .join('\n\n');

  return `You are a senior technical writer. Review and improve the following documentation files for a software project.

Project Configuration:
- Name: ${config.projectName}
- Description: ${config.projectDescription || 'N/A'}
- Frontend: ${config.frontendFramework || 'N/A'}
- Backend: ${config.backend || 'N/A'}
- Database: ${config.database || 'N/A'}
- Auth: ${config.authProvider || 'N/A'}
- State Management: ${config.stateManagement || 'N/A'}
- Testing: ${config.testingFramework || 'N/A'}
- Package Manager: ${config.packageManager || 'npm'}
- AI Agent: ${config.aiAgent || 'generic'}

Improve each file to be:
1. More detailed and specific to the project's tech stack
2. Well-structured with clear sections
3. Include relevant code examples, configuration snippets, or CLI commands
4. Remove placeholder/generic content and replace with project-specific guidance

Return a JSON object where each key is a filename and each value is the full updated markdown content for that file. Preserve the original filenames exactly. Do not wrap the JSON in code fences.

${fileBlocks}`;
}

async function generateContent(prompt: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not set');
  }

  const response = await fetch(`${GEMINI_API}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(120000),
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }],
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    if (response.status === 403 || response.status === 400) {
      throw new Error(`Gemini API error (${response.status}): Invalid or missing API key`);
    }
    throw new Error(`Gemini API error (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = await response.json() as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned empty response');
  }
  return text.trim();
}

export async function enhanceGeneratedDocs(
  config: Record<string, any>,
  docsDir: string,
): Promise<void> {
  const apiKey = getApiKey();
  if (!apiKey || !config.projectDescription) {
    return;
  }

  if (!fs.existsSync(docsDir)) return;

  const mdFiles = fs.readdirSync(docsDir)
    .filter(f => f.endsWith('.md'))
    .sort();

  if (mdFiles.length === 0) return;

  const files: Record<string, string> = {};
  for (const f of mdFiles) {
    files[f] = fs.readFileSync(path.join(docsDir, f), 'utf8');
  }

  logger.info('Enhancing documentation with Gemini AI...');
  debugLog('gemini', 'Enhancing', mdFiles.length, 'files');

  try {
    const prompt = buildEnhancePrompt(config, files);
    const response = await generateContent(prompt);

    let updated: Record<string, string>;
    try {
      updated = JSON.parse(response);
    } catch {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        logger.warn('Gemini returned unparseable response — skipping enhancement');
        debugLog('gemini', 'Parse failed, raw response:', response.slice(0, 500));
        return;
      }
      updated = JSON.parse(jsonMatch[0]);
    }

    let written = 0;
    for (const [filename, content] of Object.entries(updated)) {
      const filePath = path.join(docsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, `<!-- template-version: ${config.cliVersion || '0.0.0'} -->\n\n${content.trim()}\n`, 'utf8');
        written++;
        debugLog('gemini', 'Updated', filename);
      }
    }

    logger.success(`Gemini enhanced ${written} documentation file(s)`);
  } catch (err: any) {
    logger.warn(`Gemini enhancement failed: ${err.message}`);
    debugLog('gemini', 'Enhancement error', err);
  }
}
