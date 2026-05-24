import { describe, test, expect } from 'vitest';
import { scanProject } from '../src/analyzers/scanner.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

describe('scanProject', () => {
  test('detects this project itself', () => {
    const result = scanProject(projectRoot);
    expect(result.projectName).toBe('create-agent-docs');
    expect(result.packageManager).toBe('yarn');
    expect(result.hasTsConfig).toBe(true);
    expect(result.hasEslint).toBe(true);
    expect(result.hasPrettier).toBe(true);
  });

  test('detects dependencies from package.json', () => {
    const result = scanProject(projectRoot);
    expect(Object.keys(result.dependencies).length).toBeGreaterThan(0);
    expect(Object.keys(result.devDependencies).length).toBeGreaterThan(0);
  });

  test('detects docs directory', () => {
    const result = scanProject(projectRoot);
    // This project may or may not have a docs dir
    expect(typeof result.hasDocs).toBe('boolean');
  });

  test('handles non-existent directory gracefully', () => {
    const result = scanProject('/tmp/nonexistent-dir-12345');
    expect(result.projectName).toBe('nonexistent-dir-12345');
    expect(result.packageManager).toBe('npm');
    expect(result.hasTsConfig).toBe(false);
  });

  test('detects TypeScript strict mode', () => {
    const result = scanProject(projectRoot);
    if (result.hasTsConfig) {
      expect(typeof result.tsStrict).toBe('boolean');
      expect(typeof result.tsTarget).toBe('string');
    }
  });
});

describe('scanResultToConfig', () => {
  test('converts scan result to partial ProjectConfig', async () => {
    const { scanResultToConfig } = await import('../src/analyzers/scanner.js');
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const scan = scanProject(projectRoot);
    const config = scanResultToConfig(scan);
    expect(config.projectName).toBe(scan.projectName);
    expect(config.packageManager).toBe(scan.packageManager);
    expect(config).toHaveProperty('frontendFramework');
    expect(config).toHaveProperty('backend');
    expect(config).toHaveProperty('testingFramework');
  });
});
