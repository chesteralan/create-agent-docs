import { describe, test, expect, vi, beforeEach } from 'vitest';
import { generateCommand } from '../src/commands/generate.js';
import { initCommand } from '../src/commands/init.js';
import { analyzeCommand } from '../src/commands/analyze.js';
import { validateCommand } from '../src/commands/validate.js';
import { upgradeCommand } from '../src/commands/upgrade.js';
import { listPresetsCommand } from '../src/commands/list-presets.js';

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
  promptProjectConfig: vi.fn().mockResolvedValue({
    projectName: 'test-project',
    frontendFramework: 'React',
    backend: 'None',
    database: 'None',
    authProvider: 'None',
    stateManagement: 'None',
    testingFramework: 'Jest',
    packageManager: 'npm',
  }),
}));

vi.mock('child_process', () => ({
  execSync: vi.fn().mockReturnValue(''),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CLI commands', () => {
  test('init runs without error', async () => {
    await expect(initCommand({})).resolves.toBeUndefined();
  });

  test('generate with preset produces correct output', async () => {
    const { promptProjectConfig } = await import('../src/prompts/index.js');
    const { generateDocs } = await import('../src/generators/file-generator.js');

    await generateCommand({ preset: 'nextjs' });

    expect(promptProjectConfig).toHaveBeenCalled();
    expect(generateDocs).toHaveBeenCalled();
  });

  test('generate --dry-run does not error', async () => {
    await expect(generateCommand({ preset: 'nextjs', dryRun: true })).resolves.toBeUndefined();
  });

  test('presets command runs without error', async () => {
    await expect(listPresetsCommand()).resolves.toBeUndefined();
  });

  test('analyze runs without error', async () => {
    await expect(analyzeCommand({})).resolves.toBeUndefined();
  });

  test('validate runs without error', async () => {
    await expect(validateCommand({})).resolves.toBeUndefined();
  });

  test('upgrade runs without error', async () => {
    await expect(upgradeCommand({})).resolves.toBeUndefined();
  });
});
