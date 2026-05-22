import { describe, test, expect } from 'vitest';
import { validators } from '../src/utils/validation.js';

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
