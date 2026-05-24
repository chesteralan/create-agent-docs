import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import { loadPreset, listPresets } from '../src/utils/preset.js';
import { generateCommand } from '../src/commands/generate.js';
import { generateDocs } from '../src/generators/file-generator.js';
import { logger } from '../src/utils/logger.js';

vi.mock('../src/generators/file-generator.js', () => ({
  generateDocs: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    bold: vi.fn((msg: string) => msg),
  },
}));

vi.mock('../src/prompts/index.js', () => ({
  promptProjectConfig: vi.fn().mockImplementation(
    (overrides: Record<string, string> | undefined) =>
      Promise.resolve({
        projectName: overrides?.projectName || 'test-project',
        frontendFramework: overrides?.frontendFramework || 'React',
        backend: overrides?.backend || 'None',
        database: overrides?.database || 'None',
        authProvider: overrides?.authProvider || 'None',
        stateManagement: overrides?.stateManagement || 'None',
        testingFramework: overrides?.testingFramework || 'Jest',
        packageManager: overrides?.packageManager || 'npm',
        aiAgent: overrides?.aiAgent || 'generic',
      }),
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Preset loader', () => {

  const presets: { name: string; field: string; value: string }[] = [
    { name: 'nextjs', field: 'frontendFramework', value: 'Next.js' },
    { name: 'vue', field: 'frontendFramework', value: 'Vue' },
    { name: 'angular', field: 'frontendFramework', value: 'Angular' },
    { name: 'firebase', field: 'backend', value: 'Firebase' },
    { name: 'fastapi', field: 'backend', value: 'FastAPI' },
  ];

  for (const { name, field, value } of presets) {
    test(`loads "${name}" preset with correct values`, async () => {
      const preset = await loadPreset(name);
      expect(preset).toBeDefined();
      expect(preset).toHaveProperty(field, value);
      expect(preset).toHaveProperty('projectName');
      expect(preset).toHaveProperty('frontendFramework');
      expect(preset).toHaveProperty('backend');
      expect(preset).toHaveProperty('database');
      expect(preset).toHaveProperty('authProvider');
      expect(preset).toHaveProperty('stateManagement');
      expect(preset).toHaveProperty('testingFramework');
      expect(preset).toHaveProperty('packageManager');
    });
  }

  test('returns undefined for unknown preset', async () => {
    const preset = await loadPreset('unknown');
    expect(preset).toBeUndefined();
  });
});

describe('listPresets', () => {
  test('returns all built-in presets', () => {
    const presets = listPresets();
    expect(presets.length).toBeGreaterThanOrEqual(15);
    const names = presets.map((p) => p.name);
    expect(names).toContain('nextjs');
    expect(names).toContain('vue');
    expect(names).toContain('angular');
    expect(names).toContain('firebase');
    expect(names).toContain('fastapi');
  });

  test('each preset has a name and description', () => {
    const presets = listPresets();
    for (const preset of presets) {
      expect(preset.name).toBeTruthy();
      expect(preset.description).toBeTruthy();
    }
  });
});

describe('Custom JSON preset', () => {
  const tmpPreset = '/tmp/test-preset.json';

  beforeEach(async () => {
    vi.clearAllMocks();
    await fs.writeJson(tmpPreset, {
      projectName: 'custom-app',
      frontendFramework: 'React + Vite',
      backend: 'Express',
      database: 'PostgreSQL',
      authProvider: 'Auth0',
      stateManagement: 'Zustand',
      testingFramework: 'Vitest',
      packageManager: 'pnpm',
    });
  });

  afterEach(async () => {
    await fs.remove(tmpPreset);
  });

  test('loads a valid JSON preset file', async () => {
    const preset = await loadPreset(tmpPreset);
    expect(preset).toBeDefined();
    expect(preset?.projectName).toBe('custom-app');
    expect(preset?.frontendFramework).toBe('React + Vite');
  });

  test('returns undefined for non-existent JSON preset', async () => {
    const preset = await loadPreset('/tmp/nope.json');
    expect(preset).toBeUndefined();
  });
});

describe('generateCommand with preset', () => {
  test('passes preset config to generateDocs', async () => {
    await generateCommand({ preset: 'nextjs' });
    expect(generateDocs).toHaveBeenCalled();
    const configArg = (generateDocs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(configArg.frontendFramework).toBe('Next.js');
  });

  test('passes preset config to prompts in interactive mode', async () => {
    const { promptProjectConfig } = await import('../src/prompts/index.js');
    await generateCommand({ preset: 'nextjs', interactive: true });
    expect(promptProjectConfig).toHaveBeenCalled();
    const overrides = (promptProjectConfig as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(overrides?.frontendFramework).toBe('Next.js');
    expect(generateDocs).toHaveBeenCalled();
  });

  test('unknown preset warns and falls back to interactive prompts', async () => {
    const { promptProjectConfig } = await import('../src/prompts/index.js');
    await generateCommand({ preset: 'nonexistent' });
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('"nonexistent" not found'),
    );
    expect(promptProjectConfig).toHaveBeenCalled();
    expect(generateDocs).toHaveBeenCalled();
  });

  test('preset with --force flag still applies', async () => {
    await generateCommand({ preset: 'nextjs', force: true });
    expect(generateDocs).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ force: true }),
    );
  });

  test('preset with --dry-run flag still applies', async () => {
    await generateCommand({ preset: 'nextjs', dryRun: true });
    expect(generateDocs).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ dryRun: true }),
    );
  });
});
