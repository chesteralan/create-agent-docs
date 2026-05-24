import { describe, test, expect } from 'vitest';
import { validators, validatePreset, sanitizePath, validateOutputPath } from '../src/utils/validation.js';
import type { ProjectConfig } from '../src/types/index.js';

describe('validators.projectName', () => {
  const validNames = ['my-app', 'my_app', 'myApp', 'MyApp', 'app123', 'a', '123', 'a-b_c'];

  for (const name of validNames) {
    test(`accepts "${name}"`, () => {
      expect(validators.projectName(name)).toBe(true);
    });
  }

  const invalidNames = [
    { value: '', reason: 'empty string' },
    { value: ' ', reason: 'whitespace' },
    { value: 'my app', reason: 'space in name' },
    { value: 'my/app', reason: 'path separator' },
    { value: '../etc', reason: 'path traversal' },
    { value: 'my@app', reason: 'special char @' },
    { value: 'my!app', reason: 'special char !' },
    { value: 'my#app', reason: 'special char #' },
  ];

  for (const { value, reason } of invalidNames) {
    test(`rejects "${value}" (${reason})`, () => {
      const result = validators.projectName(value);
      expect(result).not.toBe(true);
      expect(typeof result).toBe('string');
    });
  }

  test('returns meaningful error message', () => {
    const result = validators.projectName('');
    expect(result).toBe('Project name cannot be empty.');
  });

  test('returns pattern error for invalid chars', () => {
    const result = validators.projectName('hello world');
    expect(result).toBe(
      'Project name can only contain alphanumeric characters, dashes, and underscores.',
    );
  });

  test('trims whitespace before validating', () => {
    expect(validators.projectName('  my-app  ')).toBe(true);
  });
});

describe('sanitizePath', () => {
  test('accepts normal paths', () => {
    expect(sanitizePath('my-project')).toBe('my-project');
    expect(sanitizePath('src/components')).toBe('src/components');
  });

  test('rejects path traversal', () => {
    expect(sanitizePath('../etc')).toBeNull();
    expect(sanitizePath('..\\etc')).toBeNull();
  });

  test('rejects null bytes', () => {
    expect(sanitizePath('file\0name')).toBeNull();
  });

  test('rejects shell metacharacters', () => {
    expect(sanitizePath('file;rm')).toBeNull();
    expect(sanitizePath('$(echo)')).toBeNull();
  });
});

describe('validateOutputPath', () => {
  test('rejects empty path', () => {
    expect(validateOutputPath('')).toBe('Output path cannot be empty.');
  });

  test('rejects path traversal', () => {
    expect(validateOutputPath('/tmp/../etc')).toContain('path traversal');
  });

  test('rejects null bytes', () => {
    expect(validateOutputPath('path\0file')).toContain('null bytes');
  });

  test('accepts valid path', () => {
    expect(validateOutputPath('/tmp/my-project')).toBeNull();
  });
});

describe('validatePreset', () => {
  test('returns empty array for complete preset', () => {
    const missing = validatePreset({
      projectName: 'test',
      frontendFramework: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      authProvider: 'Auth0',
      stateManagement: 'Redux',
      testingFramework: 'Jest',
      packageManager: 'yarn',
      aiAgent: 'generic',
    });
    expect(missing).toHaveLength(0);
  });

  test('reports missing keys', () => {
    const missing = validatePreset({ projectName: 'test' });
    expect(missing).toContain('backend');
    expect(missing).toContain('database');
    expect(missing).toContain('authProvider');
  });
});
