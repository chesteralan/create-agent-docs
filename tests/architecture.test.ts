import { describe, test, expect } from 'vitest';
import { categorizeDependencies } from '../src/analyzers/architecture.js';

describe('categorizeDependencies', () => {
  test('categorizes known packages correctly', () => {
    const result = categorizeDependencies(
      { react: '^18.0.0', express: '^4.0.0', pg: '^8.0.0' },
      { vitest: '^1.0.0', eslint: '^8.0.0' },
    );
    expect(result.frontend.some(d => d.name === 'react')).toBe(true);
    expect(result.backend.some(d => d.name === 'express')).toBe(true);
    expect(result.database.some(d => d.name === 'pg')).toBe(true);
    expect(result.testing.some(d => d.name === 'vitest')).toBe(true);
    expect(result.tooling.some(d => d.name === 'eslint')).toBe(true);
  });

  test('categorizes AI/ML packages', () => {
    const result = categorizeDependencies({ openai: '^4.0.0' }, {});
    expect(result['ai/ml'].some(d => d.name === 'openai')).toBe(true);
  });

  test('puts unknown packages in other', () => {
    const result = categorizeDependencies({ 'some-obscure-pkg': '1.0.0' }, {});
    expect(result.other.some(d => d.name === 'some-obscure-pkg')).toBe(true);
  });
});
