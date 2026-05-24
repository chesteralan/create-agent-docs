import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

let tmpDir: string;
let originalCwd: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'analyze-test-'));
  originalCwd = process.cwd();
  process.chdir(tmpDir);
});

afterEach(async () => {
  process.chdir(originalCwd);
  await fs.remove(tmpDir);
});

describe('analyzeCommand', () => {
  test('warns when docs/ directory does not exist', async () => {
    const { analyzeCommand } = await import('../src/commands/analyze.js');
    const logger = await import('../src/utils/logger.js');
    const warnSpy = vi.spyOn(logger.logger, 'warn');

    await analyzeCommand({});
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No docs/'));
  });

  test('reports missing files', async () => {
    await fs.ensureDir(path.join(tmpDir, 'docs'));
    const { analyzeCommand } = await import('../src/commands/analyze.js');
    const logger = await import('../src/utils/logger.js');
    const errorSpy = vi.spyOn(logger.logger, 'error');

    await analyzeCommand({});
    expect(errorSpy).toHaveBeenCalled();
  });

  test('passes when all files are present and complete', async () => {
    const docsDir = path.join(tmpDir, 'docs');
    await fs.ensureDir(docsDir);
    const fileContents: Record<string, string> = {
      'AGENTS.md': '# Tech Stack\n## Command Reference\n## Rules of Engagement\ncontent',
      'ARCHITECTURE.md': '# Architecture Blueprint\n## System Overview\ncontent',
      'CODEBASE_MAP.md': '# Codebase Map\n## Directory Structure\ncontent',
      'BUSINESS_RULES.md': '# Business Rules\n## Domain Rules\ncontent',
      'API_CONTRACTS.md': '# API Contracts\ncontent',
      'UI_PATTERNS.md': '# UI Patterns\ncontent',
      'REFACTOR_RULES.md': '# Refactoring\n## Code Quality\ncontent',
      'GLOSSARY.md': '# Glossary\ncontent',
    };
    for (const [file, content] of Object.entries(fileContents)) {
      await fs.writeFile(path.join(docsDir, file), content);
    }
    const { analyzeCommand } = await import('../src/commands/analyze.js');
    const logger = await import('../src/utils/logger.js');
    const successSpy = vi.spyOn(logger.logger, 'success');

    await analyzeCommand({});
    expect(successSpy).toHaveBeenCalledWith(expect.stringContaining('look good'));
  });

  test('reports stale files with missing sections', async () => {
    const docsDir = path.join(tmpDir, 'docs');
    await fs.ensureDir(docsDir);
    await fs.writeFile(path.join(docsDir, 'AGENTS.md'), '# Empty\n');

    const { analyzeCommand } = await import('../src/commands/analyze.js');
    const logger = await import('../src/utils/logger.js');
    const warnSpy = vi.spyOn(logger.logger, 'warn');

    await analyzeCommand({});
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('missing sections'));
  });

  test('throws on strict mode with issues', async () => {
    await fs.ensureDir(path.join(tmpDir, 'docs'));
    const { analyzeCommand } = await import('../src/commands/analyze.js');
    await expect(analyzeCommand({ strict: true })).rejects.toThrow('Strict mode');
  });

  test('dry-run with --ai flag shows preview', async () => {
    const { analyzeCommand } = await import('../src/commands/analyze.js');
    const logger = await import('../src/utils/logger.js');
    const infoSpy = vi.spyOn(logger.logger, 'info');

    await analyzeCommand({ ai: true, dryRun: true });
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('Dry-run'));
  });
});
