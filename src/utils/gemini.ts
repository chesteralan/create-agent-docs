import { debugLog } from './debug.js';

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function getApiKey(): string {
  return process.env.GEMINI_API_KEY || '';
}

function buildPrompt(config: Record<string, any>, templateName: string, templateContent: string): string {
  return `You are a technical documentation writer. Given the following project configuration and a template outline, generate a complete, well-written markdown document.

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

Generate the file "${templateName}" based on this template structure:

${templateContent}

Return ONLY the raw markdown content. Do not wrap in code fences. Do not include the template-version comment.`;
}

async function generateContent(prompt: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not set');
  }

  const response = await fetch(`${GEMINI_API}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(60000),
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }],
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
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

export async function generateDocWithGemini(
  config: Record<string, any>,
  templateName: string,
  templateContent: string,
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey || !config.projectDescription) {
    return null;
  }

  debugLog('gemini', 'Generating content for', templateName);

  try {
    const prompt = buildPrompt(config, templateName, templateContent);
    const content = await generateContent(prompt);
    debugLog('gemini', 'Generated', content.length, 'bytes for', templateName);
    return content;
  } catch (err: any) {
    debugLog('gemini', 'Failed for', templateName, err.message);
    return null;
  }
}
