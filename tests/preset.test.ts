import { loadPreset } from '../src/utils/preset.js';
import { generateCommand } from '../src/commands/generate.js';
import { generateDocs } from '../src/generators/file-generator.js';
import { logger } from '../src/utils/logger.js';

jest.mock('../src/generators/file-generator.js', () => ({
  generateDocs: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../src/utils/logger.js', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('Preset loader', () => {
  test('loads known preset', async () => {
    const preset = await loadPreset('nextjs');
    expect(preset).toBeDefined();
    expect(preset?.frontendFramework).toBe('Next.js');
  });

  test('fails on unknown preset', async () => {
    await expect(loadPreset('unknown')).rejects.toThrow();
  });
});

describe('generateCommand with preset', () => {
  test('passes preset config to generateDocs', async () => {
    await generateCommand({ preset: 'nextjs' } as any);
    expect(generateDocs).toHaveBeenCalled();
    const configArg = (generateDocs as jest.Mock).mock.calls[0][0];
    expect(configArg.frontendFramework).toBe('Next.js');
  });
});
