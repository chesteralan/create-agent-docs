import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { ensureGitignoreEntry } from '../src/utils/gitignore.js';

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gi-test-'));
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

describe('ensureGitignoreEntry', () => {
  test('creates .gitignore and adds entry', () => {
    const result = ensureGitignoreEntry(tmpDir, '.backup/');
    expect(result).toBe(true);
    const content = fs.readFileSync(path.join(tmpDir, '.gitignore'), 'utf8');
    expect(content).toContain('.backup/');
  });

  test('appends to existing .gitignore', () => {
    fs.writeFileSync(path.join(tmpDir, '.gitignore'), 'node_modules/\n');
    const result = ensureGitignoreEntry(tmpDir, 'dist/');
    expect(result).toBe(true);
    const content = fs.readFileSync(path.join(tmpDir, '.gitignore'), 'utf8');
    expect(content).toContain('node_modules/');
    expect(content).toContain('dist/');
  });

  test('returns false if entry already exists', () => {
    ensureGitignoreEntry(tmpDir, 'node_modules/');
    const result = ensureGitignoreEntry(tmpDir, 'node_modules/');
    expect(result).toBe(false);
  });

  test('handles multiple entries', () => {
    ensureGitignoreEntry(tmpDir, '.backup/');
    ensureGitignoreEntry(tmpDir, 'docs/');
    ensureGitignoreEntry(tmpDir, '.env');
    const content = fs.readFileSync(path.join(tmpDir, '.gitignore'), 'utf8');
    expect(content).toContain('.backup/');
    expect(content).toContain('docs/');
    expect(content).toContain('.env');
  });
});
