import { describe, test, expect } from 'vitest';
import { validators, validatePreset } from '../src/utils/validation.js';
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
