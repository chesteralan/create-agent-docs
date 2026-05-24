import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { initGitRepo, createDefaultGitignore } from '../src/utils/git.js';

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'git-test-'));
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

describe('initGitRepo', () => {
  test('initializes a git repo', () => {
    const result = initGitRepo(tmpDir);
    expect(result).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, '.git'))).toBe(true);
  });

  test('returns false if already a git repo', () => {
    initGitRepo(tmpDir);
    const result = initGitRepo(tmpDir);
    expect(result).toBe(false);
  });
});

describe('createDefaultGitignore', () => {
  test('creates .gitignore with default entries', () => {
    createDefaultGitignore(tmpDir);
    const gitignorePath = path.join(tmpDir, '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);
    const content = fs.readFileSync(gitignorePath, 'utf8');
    expect(content).toContain('node_modules/');
    expect(content).toContain('.env');
    expect(content).toContain('.backup/');
    expect(content).toContain('.DS_Store');
  });

  test('does not overwrite existing .gitignore', () => {
    const gitignorePath = path.join(tmpDir, '.gitignore');
    fs.writeFileSync(gitignorePath, 'custom-content\n');
    createDefaultGitignore(tmpDir);
    const content = fs.readFileSync(gitignorePath, 'utf8');
    expect(content).toBe('custom-content\n');
  });
});
