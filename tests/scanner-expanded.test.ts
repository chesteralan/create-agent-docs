import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'scan-test-'));
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

describe('scanProject dependency detection', () => {
  test('detects Next.js frontend', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test', dependencies: { next: '^14.0.0' },
    });
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.frontendFramework).toBe('Next.js');
  });

  test('detects Vue frontend', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test', dependencies: { vue: '^3.0.0' },
    });
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.frontendFramework).toBe('Vue');
  });

  test('detects Angular frontend', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test', dependencies: { '@angular/core': '^17.0.0' },
    });
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.frontendFramework).toBe('Angular');
  });

  test('detects Express backend', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test', dependencies: { express: '^4.0.0' },
    });
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.backend).toBe('Express');
  });

  test('detects NestJS backend', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test', dependencies: { '@nestjs/core': '^10.0.0' },
    });
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.backend).toBe('NestJS');
  });

  test('detects Firebase backend and database', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test', dependencies: { firebase: '^10.0.0' },
    });
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.backend).toBe('Firebase');
    expect(result.database).toBe('Firestore');
    expect(result.authProvider).toBe('Firebase Auth');
  });

  test('detects MongoDB database', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test', dependencies: { mongoose: '^8.0.0' },
    });
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.database).toBe('MongoDB');
  });

  test('detects PostgreSQL via prisma', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test', dependencies: { prisma: '^5.0.0' },
    });
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.database).toBe('PostgreSQL');
  });

  test('detects Zustand state management', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test', dependencies: { zustand: '^4.0.0' },
    });
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.stateManagement).toBe('Zustand');
  });

  test('detects Redux state management', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test', dependencies: { '@reduxjs/toolkit': '^2.0.0' },
    });
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.stateManagement).toBe('Redux');
  });

  test('detects Playwright testing', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test', dependencies: { '@playwright/test': '^1.0.0' },
    });
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.testingFramework).toBe('Playwright');
  });

  test('detects Cypress testing', async () => {
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test', dependencies: { cypress: '^13.0.0' },
    });
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.testingFramework).toBe('Cypress');
  });
});

describe('scanProject AI agent detection', () => {
  test('detects Cursor from .cursorrules', async () => {
    await fs.writeFile(path.join(tmpDir, '.cursorrules'), 'rules');
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.detectedAiAgent).toBe('cursor');
  });

  test('detects Claude from CLAUDE.md', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), 'instructions');
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.detectedAiAgent).toBe('claude');
  });

  test('detects Codex from copilot-instructions.md', async () => {
    const ghDir = path.join(tmpDir, '.github');
    await fs.ensureDir(ghDir);
    await fs.writeFile(path.join(ghDir, 'copilot-instructions.md'), 'instructions');
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.detectedAiAgent).toBe('codex');
  });

  test('Cursor takes priority over CLAUDE.md', async () => {
    await fs.writeFile(path.join(tmpDir, '.cursorrules'), 'rules');
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), 'instructions');
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.detectedAiAgent).toBe('cursor');
  });
});

describe('scanProject infrastructure detection', () => {
  test('detects Dockerfile', async () => {
    await fs.writeFile(path.join(tmpDir, 'Dockerfile'), 'FROM node');
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.hasDockerfile).toBe(true);
  });

  test('detects docker-compose.yml', async () => {
    await fs.writeFile(path.join(tmpDir, 'docker-compose.yml'), 'version: "3"');
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.hasDockerCompose).toBe(true);
  });

  test('detects package manager from lockfiles', async () => {
    await fs.writeFile(path.join(tmpDir, 'pnpm-lock.yaml'), '');
    const { scanProject } = await import('../src/analyzers/scanner.js');
    const result = scanProject(tmpDir);
    expect(result.packageManager).toBe('pnpm');
  });
});
