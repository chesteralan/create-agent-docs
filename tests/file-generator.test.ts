import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { generateDocs } from '../src/generators/file-generator.js';

import type { ProjectConfig } from '../src/types/index.js';

const mockConfig: ProjectConfig = {
  projectName: 'test-project',
  frontendFramework: 'React + Vite',
  backend: 'Express',
  database: 'PostgreSQL',
  authProvider: 'Auth0',
  stateManagement: 'Zustand',
  testingFramework: 'Vitest',
  packageManager: 'npm',
  aiAgent: 'generic',
};

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gen-test-'));
  vi.clearAllMocks();
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

describe('generateDocs', () => {
  test('creates docs directory with 8 files', async () => {
    await generateDocs(mockConfig, { targetDir: tmpDir });

    const docsDir = path.join(tmpDir, 'docs');
    expect(fs.existsSync(docsDir)).toBe(true);

    const files = [
      'AGENTS.md',
      'ARCHITECTURE.md',
      'CODEBASE_MAP.md',
      'BUSINESS_RULES.md',
      'API_CONTRACTS.md',
      'UI_PATTERNS.md',
      'REFACTOR_RULES.md',
      'GLOSSARY.md',
    ];

    for (const file of files) {
      const filePath = path.join(docsDir, file);
      expect(fs.existsSync(filePath), `${file} should exist`).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toBeTruthy();
      expect(content).toContain('test-project');
    }
  });

  test('dry-run mode does NOT write any files', async () => {
    await generateDocs(mockConfig, { targetDir: tmpDir, dryRun: true });

    const docsDir = path.join(tmpDir, 'docs');
    expect(fs.existsSync(docsDir)).toBe(false);
  });

  test('force mode overwrites existing files', async () => {
    await generateDocs(mockConfig, { targetDir: tmpDir, force: true });
    const agentsPath = path.join(tmpDir, 'docs', 'AGENTS.md');
    const firstContent = fs.readFileSync(agentsPath, 'utf8');

    await generateDocs(mockConfig, { targetDir: tmpDir, force: true });
    const secondContent = fs.readFileSync(agentsPath, 'utf8');

    expect(secondContent).toBe(firstContent);
  });

  test('non-force mode skips existing files without error', async () => {
    await generateDocs(mockConfig, { targetDir: tmpDir, force: true });
    const agentsPath = path.join(tmpDir, 'docs', 'AGENTS.md');
    const originalContent = fs.readFileSync(agentsPath, 'utf8');

    await generateDocs(mockConfig, { targetDir: tmpDir });
    const afterSkip = fs.readFileSync(agentsPath, 'utf8');

    expect(afterSkip).toBe(originalContent);
  });

  test('handles permission errors when writing files', async () => {
    await generateDocs(mockConfig, { targetDir: tmpDir, force: true });

    const agentsPath = path.join(tmpDir, 'docs', 'AGENTS.md');
    fs.chmodSync(agentsPath, 0o444);

    await generateDocs(mockConfig, { targetDir: tmpDir, force: true });

    const backupDir = path.join(tmpDir, 'docs', '.backup');
    expect(fs.existsSync(backupDir)).toBe(true);

    const backedUpFiles = fs.readdirSync(backupDir).flatMap(t =>
      fs.readdirSync(path.join(backupDir, t))
    );
    expect(backedUpFiles).toContain('AGENTS.md');

    fs.chmodSync(agentsPath, 0o644);
  });

  test('creates backup before overwriting with force', async () => {
    await generateDocs(mockConfig, { targetDir: tmpDir, force: true });

    const agentsPath = path.join(tmpDir, 'docs', 'AGENTS.md');
    const originalContent = fs.readFileSync(agentsPath, 'utf8');

    await generateDocs(mockConfig, { targetDir: tmpDir, force: true });

    const backupDir = path.join(tmpDir, 'docs', '.backup');
    const timestamps = fs.readdirSync(backupDir);
    expect(timestamps.length).toBeGreaterThanOrEqual(1);

    const backedUpFiles = timestamps.flatMap(t => fs.readdirSync(path.join(backupDir, t)));
    for (const file of ['AGENTS.md', 'ARCHITECTURE.md', 'CODEBASE_MAP.md', 'BUSINESS_RULES.md', 'API_CONTRACTS.md', 'UI_PATTERNS.md', 'REFACTOR_RULES.md', 'GLOSSARY.md']) {
      expect(backedUpFiles, `Backup should contain ${file}`).toContain(file);
    }

    const agentsBackupDir = timestamps
      .find(t => fs.readdirSync(path.join(backupDir, t)).includes('AGENTS.md'));
    expect(agentsBackupDir).toBeTruthy();
    const backupContent = fs.readFileSync(path.join(backupDir, agentsBackupDir!, 'AGENTS.md'), 'utf8');
    expect(backupContent).toBe(originalContent);
  });
});
