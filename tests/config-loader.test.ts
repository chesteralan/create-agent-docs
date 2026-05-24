import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'config-test-'));
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

describe('validateConfig', () => {
  test('passes valid config', async () => {
    const { validateConfig } = await import('../src/utils/config-loader.js');
    const config = { preset: 'nextjs', output: './docs', standard: true };
    expect(validateConfig(config, '.create-agent-docsrc')).toBe(true);
  });

  test('warns on unknown fields', async () => {
    const { validateConfig } = await import('../src/utils/config-loader.js');
    const config = { unknownField: 'value' };
    expect(validateConfig(config, '.create-agent-docsrc')).toBe(false);
  });

  test('warns on wrong types', async () => {
    const { validateConfig } = await import('../src/utils/config-loader.js');
    const config = { preset: 123, standard: 'maybe' };
    expect(validateConfig(config, '.create-agent-docsrc')).toBe(false);
  });
});

describe('loadProjectConfig', () => {
  test('returns null when no config file exists', async () => {
    const { loadProjectConfig } = await import('../src/utils/config-loader.js');
    const result = loadProjectConfig(tmpDir);
    expect(result).toBeNull();
  });

  test('loads .create-agent-docsrc', async () => {
    const configPath = path.join(tmpDir, '.create-agent-docsrc');
    await fs.writeJson(configPath, { preset: 'vue' });
    const { loadProjectConfig } = await import('../src/utils/config-loader.js');
    const result = loadProjectConfig(tmpDir);
    expect(result).not.toBeNull();
    expect(result?.preset).toBe('vue');
  });

  test('loads create-agent-docs.json (without dot)', async () => {
    const configPath = path.join(tmpDir, 'create-agent-docs.json');
    await fs.writeJson(configPath, { output: './custom-docs', standard: true });
    const { loadProjectConfig } = await import('../src/utils/config-loader.js');
    const result = loadProjectConfig(tmpDir);
    expect(result).not.toBeNull();
    expect(result?.output).toBe('./custom-docs');
    expect(result?.standard).toBe(true);
  });

  test('prioritizes .create-agent-docsrc over create-agent-docs.json', async () => {
    await fs.writeJson(path.join(tmpDir, '.create-agent-docsrc'), { preset: 'nextjs' });
    await fs.writeJson(path.join(tmpDir, 'create-agent-docs.json'), { preset: 'vue' });
    const { loadProjectConfig } = await import('../src/utils/config-loader.js');
    const result = loadProjectConfig(tmpDir);
    expect(result?.preset).toBe('nextjs');
  });

  test('handles invalid JSON gracefully', async () => {
    await fs.writeFile(path.join(tmpDir, '.create-agent-docsrc'), '{ invalid json }');
    const { loadProjectConfig } = await import('../src/utils/config-loader.js');
    const result = loadProjectConfig(tmpDir);
    expect(result).toBeNull();
  });
});
