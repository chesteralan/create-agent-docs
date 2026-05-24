import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { backupExisting, listBackups, restoreBackup } from '../src/generators/backup.js';

let tmpDir: string;
let targetFile: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'backup-test-'));
  targetFile = path.join(tmpDir, 'test.txt');
  await fs.writeFile(targetFile, 'original content');
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

describe('backupExisting', () => {
  test('creates a backup copy of the file', async () => {
    await backupExisting(targetFile);

    const backups = await listBackups(tmpDir);
    expect(backups.length).toBe(1);

    const backupDir = path.join(tmpDir, '.backup', backups[0]);
    expect(fs.existsSync(path.join(backupDir, 'test.txt'))).toBe(true);
    expect(fs.readFileSync(path.join(backupDir, 'test.txt'), 'utf8')).toBe('original content');
  });

  test('prunes oldest backups when exceeding maxBackups', async () => {
    const maxBackups = 3;

    for (let i = 0; i < maxBackups + 2; i++) {
      await sleep(15);
      await backupExisting(targetFile, maxBackups);
    }

    const backups = await listBackups(tmpDir);
    expect(backups.length).toBe(maxBackups);
  });

  test('keeps only the most recent backups within limit', async () => {
    const maxBackups = 2;

    await sleep(15);
    await backupExisting(targetFile, maxBackups);
    await sleep(15);
    await backupExisting(targetFile, maxBackups);
    await sleep(15);
    await backupExisting(targetFile, maxBackups);

    const backups = await listBackups(tmpDir);
    expect(backups.length).toBe(2);
  });

  test('handles non-existent file gracefully', async () => {
    const nonExistent = path.join(tmpDir, 'nonexistent.txt');
    await expect(backupExisting(nonExistent)).rejects.toThrow();
  });
});

describe('listBackups', () => {
  test('returns empty array when no backups exist', async () => {
    const backups = await listBackups(tmpDir);
    expect(backups).toEqual([]);
  });

  test('returns sorted backup timestamps', async () => {
    await backupExisting(targetFile);
    await sleep(10);
    await backupExisting(targetFile);

    const backups = await listBackups(tmpDir);
    expect(backups.length).toBe(2);
    expect(backups[0] < backups[1]).toBe(true);
  });
});

describe('restoreBackup', () => {
  test('restores files from a backup', async () => {
    await backupExisting(targetFile);
    await fs.writeFile(targetFile, 'modified content');

    const backups = await listBackups(tmpDir);
    const restored = await restoreBackup(tmpDir, backups[0]);

    expect(restored).toContain('test.txt');
    expect(fs.readFileSync(targetFile, 'utf8')).toBe('original content');
  });

  test('throws for non-existent backup', async () => {
    await expect(restoreBackup(tmpDir, 'nonexistent')).rejects.toThrow('Backup not found');
  });
});

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
