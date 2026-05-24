import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

let tmpDir: string;
let localesDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'locale-test-'));
  localesDir = path.join(tmpDir, 'locales');
  await fs.ensureDir(localesDir);
  await fs.writeJson(path.join(localesDir, 'en.json'), {
    prompts: { projectName: 'Project name?' },
    cli: { done: 'Done in {time}s' },
  });
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

describe('loadLocale', () => {
  test('loads requested locale', async () => {
    const { loadLocale } = await import('../src/utils/locale.js');
    const locale = loadLocale('en', localesDir);
    expect(locale.prompts.projectName).toBe('Project name?');
  });

  test('falls back to en when locale missing', async () => {
    const { loadLocale } = await import('../src/utils/locale.js');
    const locale = loadLocale('fr', localesDir);
    expect(locale.prompts.projectName).toBe('Project name?');
  });
});

describe('t', () => {
  test('resolves dot-notation keys', async () => {
    const { loadLocale, t } = await import('../src/utils/locale.js');
    loadLocale('en', localesDir);
    expect(t('prompts.projectName')).toBe('Project name?');
  });

  test('interpolates variables', async () => {
    const { loadLocale, t } = await import('../src/utils/locale.js');
    loadLocale('en', localesDir);
    expect(t('cli.done', { time: '1.5' })).toBe('Done in 1.5s');
  });

  test('returns the key itself if not found', async () => {
    const { loadLocale, t } = await import('../src/utils/locale.js');
    loadLocale('en', localesDir);
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });
});

describe('getCurrentLang', () => {
  test('returns current language code', async () => {
    const { loadLocale, getCurrentLang } = await import('../src/utils/locale.js');
    loadLocale('en', localesDir);
    expect(getCurrentLang()).toBe('en');
  });

  test('returns en after fallback', async () => {
    const { loadLocale, getCurrentLang } = await import('../src/utils/locale.js');
    loadLocale('fr', localesDir);
    expect(getCurrentLang()).toBe('en');
  });
});

describe('getCurrentLocale', () => {
  test('returns current locale data', async () => {
    const { loadLocale, getCurrentLocale } = await import('../src/utils/locale.js');
    loadLocale('en', localesDir);
    const locale = getCurrentLocale();
    expect(locale.prompts.projectName).toBe('Project name?');
  });
});
