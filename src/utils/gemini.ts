import fs from 'fs-extra';
import path from 'path';
import { input } from '@inquirer/prompts';
import { debugLog } from './debug.js';
import { logger } from './logger.js';

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function getApiKey(): string {
  return process.env.GEMINI_API_KEY || '';
}

function buildEnhancePrompt(config: Record<string, any>, filename: string, content: string): string {
  return `You are a senior technical writer. Review and improve this documentation file for a software project.

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

Improve the file "${filename}" to be:
1. More detailed and specific to the project's tech stack
2. Well-structured with clear sections
3. Include relevant code examples, configuration snippets, or CLI commands
4. Remove placeholder/generic content and replace with project-specific guidance

Return ONLY the full updated markdown content. Do not wrap in code fences.

${content}`;
}

async function enhanceFile(config: Record<string, any>, filePath: string, filename: string): Promise<boolean> {
  const apiKey = getApiKey();
  if (!apiKey) return false;

  logger.info(`Enhancing ${filename} with Gemini...`);

  const content = fs.readFileSync(filePath, 'utf8');
  const prompt = buildEnhancePrompt(config, filename, content);

  debugLog('gemini-prompt-full', prompt);

  try {
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
          maxOutputTokens: 65536,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${body.slice(0, 300)}`);
    }

    let data: any;
    try {
      data = await response.json();
    } catch {
      const raw = await response.text();
      debugLog('gemini-raw-response', raw.slice(0, 1000));
      throw new Error(`Invalid JSON in API response at position ${raw.length}`);
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned empty response');

    const enhanced = text.trim().replace(/^```markdown\n?|```$/g, '');
    fs.writeFileSync(filePath, `<!-- template-version: ${config.cliVersion || '0.0.0'} -->\n\n${enhanced}\n`, 'utf8');
    logger.success(`Gemini updated ${filename}`);
    return true;
  } catch (err: any) {
    logger.warn(`Gemini failed for ${filename}: ${err.message}`);
    debugLog('gemini', 'Error on', filename, err);
    return false;
  }
}

export async function enhanceGeneratedDocs(
  config: Record<string, any>,
  docsDir: string,
): Promise<void> {
  const apiKey = getApiKey();
  if (!apiKey || !config.projectDescription) return;
  if (!fs.existsSync(docsDir)) return;

  const mdFiles = fs.readdirSync(docsDir)
    .filter(f => f.endsWith('.md'))
    .sort();

  if (mdFiles.length === 0) return;

  logger.info('Enhancing documentation with Gemini AI...');
  debugLog('gemini', 'Enhancing', mdFiles.length, 'files');

  let written = 0;
  for (const filename of mdFiles) {
    const filePath = path.join(docsDir, filename);
    if (await enhanceFile(config, filePath, filename)) {
      written++;
    }
  }

  if (written > 0) {
    logger.success(`Gemini enhanced ${written} documentation file(s)`);
  }
}

export async function promptGeminiKeyOnSavedAnswers(projectDescription?: string): Promise<void> {
  if (!projectDescription || process.env.GEMINI_API_KEY) return;
  if (!process.stdout.isTTY) return;

  const answer = await input({
    message: 'Use Gemini AI to enhance docs based on project description? (y/N)',
    default: 'n',
  });
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    const key = await input({
      message: 'Enter your Gemini API key:',
    });
    if (key) {
      process.env.GEMINI_API_KEY = key;
    }
  }
}
