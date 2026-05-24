import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ai-test-'));
  vi.stubEnv('OPENAI_API_KEY', '');
});

afterEach(async () => {
  vi.unstubAllEnvs();
  await fs.remove(tmpDir);
});

describe('analyzeWithAI', () => {
  test('throws if OPENAI_API_KEY is not set', async () => {
    const { analyzeWithAI } = await import('../src/utils/ai.js');
    await expect(analyzeWithAI(tmpDir)).rejects.toThrow('OPENAI_API_KEY');
  });

  test('sends request to default endpoint and returns suggestions', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-key');

    const mockResponse = {
      choices: [{
        message: {
          content: JSON.stringify({
            suggestions: [
              { section: 'Deployment', reason: 'No deployment docs found', suggestedFile: 'DEPLOYMENT.md' },
            ],
          }),
        },
      }],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { analyzeWithAI } = await import('../src/utils/ai.js');
    const suggestions = await analyzeWithAI(tmpDir);

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].section).toBe('Deployment');
    expect(suggestions[0].suggestedFile).toBe('DEPLOYMENT.md');

    const callUrl = mockFetch.mock.calls[0][0];
    expect(callUrl).toBe('https://api.openai.com/v1/chat/completions');
  });

  test('uses custom endpoint when provided', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-key');

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: '{"suggestions":[]}' } }] }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { analyzeWithAI } = await import('../src/utils/ai.js');
    const customEndpoint = 'https://custom.api.example.com/v1/chat';
    await analyzeWithAI(tmpDir, { endpoint: customEndpoint });

    expect(mockFetch.mock.calls[0][0]).toBe(customEndpoint);
  });

  test('handles 401 response', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-invalid-key');

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Invalid auth'),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { analyzeWithAI } = await import('../src/utils/ai.js');
    await expect(analyzeWithAI(tmpDir)).rejects.toThrow('Invalid API key');
  });

  test('handles 429 rate limit', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-key');

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      text: () => Promise.resolve('Rate limit'),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { analyzeWithAI } = await import('../src/utils/ai.js');
    await expect(analyzeWithAI(tmpDir)).rejects.toThrow('Rate limited');
  });

  test('handles network failure', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-key');

    const mockFetch = vi.fn().mockRejectedValue({ code: 'ENOTFOUND', name: 'Error', message: 'getaddrinfo ENOTFOUND' });
    vi.stubGlobal('fetch', mockFetch);

    const { analyzeWithAI } = await import('../src/utils/ai.js');
    await expect(analyzeWithAI(tmpDir)).rejects.toThrow('Network error');
  });

  test('handles empty suggestions from API', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-key');

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: '{"suggestions":[]}' } }] }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { analyzeWithAI } = await import('../src/utils/ai.js');
    const suggestions = await analyzeWithAI(tmpDir);
    expect(suggestions).toEqual([]);
  });

  test('builds project context from directory', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-key');

    const srcDir = path.join(tmpDir, 'src');
    await fs.ensureDir(srcDir);
    await fs.writeFile(path.join(srcDir, 'index.js'), '// test');
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test-project',
      dependencies: { express: '^4.0.0' },
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: '{"suggestions":[]}' } }] }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { analyzeWithAI } = await import('../src/utils/ai.js');
    await analyzeWithAI(tmpDir);

    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.messages[1].content).toContain('test-project');
    expect(callBody.messages[1].content).toContain('express');
  });
});
