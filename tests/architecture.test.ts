import { describe, test, expect } from 'vitest';
import { generateArchitectureSummary, categorizeDependencies } from '../src/analyzers/architecture.js';
import type { ScanResult } from '../src/analyzers/scanner.js';

const baseScan: ScanResult = {
  projectName: 'test',
  frontendFramework: 'React + Vite',
  backend: 'Express',
  database: 'PostgreSQL',
  authProvider: 'Auth0',
  stateManagement: 'Zustand',
  testingFramework: 'Vitest',
  packageManager: 'npm',
  dependencies: {},
  devDependencies: {},
  hasTsConfig: true,
  tsStrict: true,
  tsTarget: 'ES2022',
  hasDocs: true,
  existingDocFiles: [],
  hasDockerfile: false,
  hasDockerCompose: false,
  hasEslint: true,
  hasPrettier: true,
  hasServerDir: false,
  hasApiDir: false,
  hasFunctionsDir: false,
  detectedAiAgent: undefined,
};

describe('generateArchitectureSummary', () => {
  test('creates summary from scan result', () => {
    const summary = generateArchitectureSummary(baseScan);
    expect(summary.projectName).toBe('test');
    expect(summary.frontend).toBe('React + Vite');
    expect(summary.backend).toBe('Express');
    expect(summary.database).toBe('PostgreSQL');
    expect(summary.auth).toBe('Auth0');
    expect(summary.stateManagement).toBe('Zustand');
    expect(summary.testing).toBe('Vitest');
    expect(summary.packageManager).toBe('npm');
  });

  test('includes TypeScript config', () => {
    const summary = generateArchitectureSummary(baseScan);
    expect(summary.typescript.enabled).toBe(true);
    expect(summary.typescript.strict).toBe(true);
    expect(summary.typescript.target).toBe('ES2022');
  });

  test('detects CI/CD from Docker', () => {
    const scan: ScanResult = { ...baseScan, hasDockerfile: true, hasDockerCompose: true };
    const summary = generateArchitectureSummary(scan);
    expect(summary.ciCd).toContain('Docker');
    expect(summary.ciCd).toContain('Docker Compose');
  });

  test('counts dependencies', () => {
    const scan: ScanResult = {
      ...baseScan,
      dependencies: { express: '^4.0.0', react: '^18.0.0' },
      devDependencies: { vitest: '^1.0.0' },
    };
    const summary = generateArchitectureSummary(scan);
    expect(summary.dependencyCount).toBe(2);
    expect(summary.devDependencyCount).toBe(1);
  });
});

describe('categorizeDependencies', () => {
  test('categorizes frontend deps', () => {
    const result = categorizeDependencies({ react: '^18.0.0', next: '^14.0.0' }, {});
    expect(result.frontend).toHaveLength(2);
  });

  test('categorizes backend deps', () => {
    const result = categorizeDependencies({ express: '^4.0.0', '@nestjs/core': '^10.0.0' }, {});
    expect(result.backend).toHaveLength(2);
  });

  test('categorizes database deps', () => {
    const result = categorizeDependencies({ pg: '^8.0.0', prisma: '^5.0.0' }, {});
    expect(result.database).toHaveLength(2);
  });

  test('categorizes testing deps', () => {
    const result = categorizeDependencies({}, { vitest: '^1.0.0', jest: '^29.0.0' });
    expect(result.testing).toHaveLength(2);
  });

  test('categorizes tooling deps', () => {
    const result = categorizeDependencies({ eslint: '^8.0.0', prettier: '^3.0.0', typescript: '^5.0.0' }, {});
    expect(result.tooling).toHaveLength(3);
  });

  test('categorizes AI/ML deps', () => {
    const result = categorizeDependencies({ openai: '^4.0.0', langchain: '^0.1.0' }, {});
    expect(result['ai/ml']).toHaveLength(2);
  });

  test('puts unknown deps in other', () => {
    const result = categorizeDependencies({ someRandomLib: '^1.0.0' }, {});
    expect(result.other).toHaveLength(1);
  });
});
