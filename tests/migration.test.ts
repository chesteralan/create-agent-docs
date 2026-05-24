import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'migrate-test-'));
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

describe('extractVersion', () => {
  test('extracts version from comment', async () => {
    const { extractVersion } = await import('../src/utils/migration.js');
    const version = extractVersion('<!-- template-version: 1.2.3 -->\ncontent');
    expect(version).toBe('1.2.3');
  });

  test('returns null when no version comment', async () => {
    const { extractVersion } = await import('../src/utils/migration.js');
    expect(extractVersion('plain content')).toBeNull();
  });
});

describe('stripVersion', () => {
  test('removes version comment', async () => {
    const { stripVersion } = await import('../src/utils/migration.js');
    const result = stripVersion('<!-- template-version: 1.0.0 -->\n\ncontent');
    expect(result).toBe('content');
  });

  test('returns content unchanged when no version', async () => {
    const { stripVersion } = await import('../src/utils/migration.js');
    expect(stripVersion('content')).toBe('content');
  });
});

describe('diffTemplates', () => {
  test('detects changed lines', async () => {
    const { diffTemplates } = await import('../src/utils/migration.js');
    const diffs = diffTemplates('line1\nline2\nline3', 'line1\nmodified\nline3');
    expect(diffs.length).toBeGreaterThan(0);
    expect(diffs[0].type).toBe('changed');
  });

  test('returns empty for identical content', async () => {
    const { diffTemplates } = await import('../src/utils/migration.js');
    const diffs = diffTemplates('same\ncontent', 'same\ncontent');
    expect(diffs).toHaveLength(0);
  });
});

describe('scanGeneratedFiles', () => {
  test('finds generated files with version comments', async () => {
    const docsDir = path.join(tmpDir, 'docs');
    await fs.ensureDir(docsDir);
    await fs.writeFile(path.join(docsDir, 'AGENTS.md'), '<!-- template-version: 1.0.0 -->\ncontent');
    await fs.writeFile(path.join(docsDir, 'README.md'), 'no version');

    const { scanGeneratedFiles } = await import('../src/utils/migration.js');
    const results = scanGeneratedFiles(tmpDir);
    expect(results.length).toBeGreaterThanOrEqual(1);
    const agents = results.find(r => r.file.endsWith('AGENTS.md'));
    expect(agents).toBeDefined();
    expect(agents?.version).toBe('1.0.0');
  });
});

describe('diffTemplateSets', () => {
  test('detects added templates', async () => {
    const { diffTemplateSets } = await import('../src/utils/migration.js');
    const diffs = diffTemplateSets({}, { 'NEW.md.hbs': 'content' });
    expect(diffs).toHaveLength(1);
    expect(diffs[0].type).toBe('added');
  });

  test('detects removed templates', async () => {
    const { diffTemplateSets } = await import('../src/utils/migration.js');
    const diffs = diffTemplateSets({ 'OLD.md.hbs': 'content' }, {});
    expect(diffs).toHaveLength(1);
    expect(diffs[0].type).toBe('removed');
  });

  test('detects changed templates', async () => {
    const { diffTemplateSets } = await import('../src/utils/migration.js');
    const diffs = diffTemplateSets({ 'FILE.md.hbs': 'old' }, { 'FILE.md.hbs': 'new' });
    expect(diffs).toHaveLength(1);
    expect(diffs[0].type).toBe('changed');
  });
});

describe('applyMigration', () => {
  test('adds new files', async () => {
    const { applyMigration } = await import('../src/utils/migration.js');
    const diffs = [{ file: 'NEW.md', type: 'added' as const, newContent: 'new content' }];
    const applied = await applyMigration(tmpDir, diffs);
    expect(applied).toHaveLength(1);
    expect(fs.existsSync(path.join(tmpDir, 'NEW.md'))).toBe(true);
  });

  test('removes files', async () => {
    const filePath = path.join(tmpDir, 'OLD.md');
    await fs.writeFile(filePath, 'old content');
    const { applyMigration } = await import('../src/utils/migration.js');
    const diffs = [{ file: 'OLD.md', type: 'removed' as const }];
    const applied = await applyMigration(tmpDir, diffs);
    expect(applied).toHaveLength(1);
    expect(fs.existsSync(filePath)).toBe(false);
  });

  test('dry-run does not modify files', async () => {
    const { applyMigration } = await import('../src/utils/migration.js');
    const diffs = [{ file: 'NEW.md', type: 'added' as const, newContent: 'content' }];
    const applied = await applyMigration(tmpDir, diffs, true);
    expect(applied).toHaveLength(1);
    expect(fs.existsSync(path.join(tmpDir, 'NEW.md'))).toBe(false);
  });
});
