import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mono-test-'));
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

describe('detectMonorepo', () => {
  test('returns null without package.json', async () => {
    const { detectMonorepo } = await import('../src/utils/monorepo.js');
    const result = detectMonorepo(tmpDir);
    expect(result).toBeNull();
  });

  test('returns null without workspaces config', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), { name: 'single' });
    const { detectMonorepo } = await import('../src/utils/monorepo.js');
    const result = detectMonorepo(tmpDir);
    expect(result).toBeNull();
  });

  test('discovers workspace packages from array', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'root',
      workspaces: ['packages/*'],
    });
    await fs.ensureDir(path.join(tmpDir, 'packages', 'a'));
    await fs.ensureDir(path.join(tmpDir, 'packages', 'b'));
    await fs.writeJson(path.join(tmpDir, 'packages', 'a', 'package.json'), { name: 'pkg-a' });
    await fs.writeJson(path.join(tmpDir, 'packages', 'b', 'package.json'), { name: 'pkg-b' });

    const { detectMonorepo } = await import('../src/utils/monorepo.js');
    const result = detectMonorepo(tmpDir);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
    const names = result!.map(p => p.name).sort();
    expect(names).toEqual(['pkg-a', 'pkg-b']);
  });

  test('discovers workspace packages from object format', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'root',
      workspaces: { packages: ['libs/*'] },
    });
    await fs.ensureDir(path.join(tmpDir, 'libs', 'core'));
    await fs.writeJson(path.join(tmpDir, 'libs', 'core', 'package.json'), { name: 'core' });

    const { detectMonorepo } = await import('../src/utils/monorepo.js');
    const result = detectMonorepo(tmpDir);
    expect(result).toHaveLength(1);
    expect(result![0].name).toBe('core');
  });

  test('returns null when no packages match', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'root',
      workspaces: ['packages/*'],
    });
    const { detectMonorepo } = await import('../src/utils/monorepo.js');
    const result = detectMonorepo(tmpDir);
    expect(result).toBeNull();
  });
});

describe('getPerPackageConfig', () => {
  test('extracts create-agent-docs config', async () => {
    const { getPerPackageConfig } = await import('../src/utils/monorepo.js');
    const pkg = {
      name: 'test',
      dir: '/tmp',
      packageJson: { 'create-agent-docs': { preset: 'express' } },
    };
    const config = getPerPackageConfig(pkg);
    expect(config).toEqual({ preset: 'express' });
  });

  test('returns null when no config', async () => {
    const { getPerPackageConfig } = await import('../src/utils/monorepo.js');
    const pkg = { name: 'test', dir: '/tmp', packageJson: {} };
    expect(getPerPackageConfig(pkg)).toBeNull();
  });
});
