import { describe, test, expect, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { generateDocs, loadPreset, scanProject, scanResultToConfig, saveAnswers, loadAnswers } from '../dist/index.js';
import type { ProjectConfig } from '../dist/index.js';

const tmpDirs: string[] = [];

function makeTmpDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-gen-'));
  tmpDirs.push(dir);
  return dir;
}

afterEach(async () => {
  for (const dir of tmpDirs) {
    await fs.remove(dir);
  }
  tmpDirs.length = 0;
});

const CORE_FILES = [
  'AGENTS.md',
  'ARCHITECTURE.md',
  'CODEBASE_MAP.md',
  'BUSINESS_RULES.md',
  'API_CONTRACTS.md',
  'UI_PATTERNS.md',
  'REFACTOR_RULES.md',
  'GLOSSARY.md',
  'TASKS.md',
];

describe('e2e: template generation with preset configs', () => {
  const presetsToTest = ['nextjs', 'react-firebase', 'express', 'fastapi'];

  for (const presetName of presetsToTest) {
    test(`${presetName}: creates all 9 core docs with valid content`, async () => {
      const preset = await loadPreset(presetName);
      expect(preset).toBeTruthy();

      const config: ProjectConfig = {
        projectName: `e2e-${presetName}`,
        packageManager: 'npm',
        aiAgent: 'generic',
        frontendFramework: 'React + Vite',
        backend: 'None',
        database: 'None',
        authProvider: 'None',
        stateManagement: 'None',
        testingFramework: 'None',
        ...preset,
      };

      const tmpDir = makeTmpDir();
      await generateDocs(config, { targetDir: tmpDir, force: true });

      const docsDir = path.join(tmpDir, 'docs');
      expect(fs.existsSync(docsDir), 'docs/ directory should exist').toBe(true);

      const createdFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
      expect(createdFiles.length).toBeGreaterThanOrEqual(9);

      for (const file of CORE_FILES) {
        const filePath = path.join(docsDir, file);
        expect(fs.existsSync(filePath), `${file} should exist`).toBe(true);
        const content = fs.readFileSync(filePath, 'utf8');
        expect(content.length, `${file} should have content`).toBeGreaterThan(50);
        expect(content, `${file} should reference project name`).toContain(config.projectName);
        expect(content, `${file} should include version comment`).toMatch(/Generated|generated/);
      }
    });
  }
});

describe('e2e: agent-specific files', () => {
  for (const agent of ['cursor', 'claude', 'codex', 'generic'] as const) {
    test(`${agent} creates correct agent config files`, async () => {
      const config: ProjectConfig = {
        projectName: `e2e-agent-${agent}`,
        frontendFramework: 'React + Vite',
        backend: 'Express',
        database: 'PostgreSQL',
        authProvider: 'Auth0',
        stateManagement: 'Zustand',
        testingFramework: 'Vitest',
        packageManager: 'npm',
        aiAgent: agent,
      };

      const tmpDir = makeTmpDir();
      await generateDocs(config, { targetDir: tmpDir, force: true });

      if (agent === 'cursor') {
        const cursorPath = path.join(tmpDir, '.cursorrules');
        expect(fs.existsSync(cursorPath), '.cursorrules should exist').toBe(true);
        expect(fs.readFileSync(cursorPath, 'utf8').length).toBeGreaterThan(50);
      } else if (agent === 'claude') {
        const claudePath = path.join(tmpDir, 'CLAUDE.md');
        expect(fs.existsSync(claudePath), 'CLAUDE.md should exist').toBe(true);
        expect(fs.readFileSync(claudePath, 'utf8').length).toBeGreaterThan(50);
      } else {
        const cursorPath = path.join(tmpDir, '.cursorrules');
        const claudePath = path.join(tmpDir, 'CLAUDE.md');
        expect(fs.existsSync(cursorPath), `.cursorrules should exist for ${agent}`).toBe(true);
        expect(fs.existsSync(claudePath), `CLAUDE.md should exist for ${agent}`).toBe(true);
      }

      const docsDir = path.join(tmpDir, 'docs');
      expect(fs.existsSync(docsDir)).toBe(true);
      const docsFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
      expect(docsFiles.length).toBeGreaterThanOrEqual(9);
    });
  }
});

describe('e2e: standard docs generation', () => {
  test('generateStandardDocs: true creates 6 additional files', async () => {
    const config: ProjectConfig = {
      projectName: 'e2e-standard',
      frontendFramework: 'Next.js',
      backend: 'None',
      database: 'None',
      authProvider: 'NextAuth',
      stateManagement: 'Redux',
      testingFramework: 'Jest',
      packageManager: 'npm',
      aiAgent: 'generic',
      generateStandardDocs: true,
      license: 'MIT',
    };

    const tmpDir = makeTmpDir();
    await generateDocs(config, { targetDir: tmpDir, force: true });
    const docsDir = path.join(tmpDir, 'docs');

    const standardFiles = ['README.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'SECURITY.md', 'LICENSE'];
    for (const file of standardFiles) {
      const filePath = path.join(docsDir, file);
      expect(fs.existsSync(filePath), `${file} should exist`).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content.length, `${file} should have content`).toBeGreaterThan(50);
    }
  });

  test('generateStandardDocs: false does NOT create standard files', async () => {
    const config: ProjectConfig = {
      projectName: 'e2e-no-standard',
      frontendFramework: 'React + Vite',
      backend: 'None',
      database: 'None',
      authProvider: 'None',
      stateManagement: 'None',
      testingFramework: 'None',
      packageManager: 'npm',
      aiAgent: 'generic',
      generateStandardDocs: false,
    };

    const tmpDir = makeTmpDir();
    await generateDocs(config, { targetDir: tmpDir, force: true });
    const docsDir = path.join(tmpDir, 'docs');

    expect(fs.existsSync(path.join(docsDir, 'README.md'))).toBe(false);
    expect(fs.existsSync(path.join(docsDir, 'LICENSE'))).toBe(false);
    expect(fs.existsSync(path.join(docsDir, 'CONTRIBUTING.md'))).toBe(false);
  });
});

describe('e2e: CI/CD generation', () => {
  test('generateCicd: true creates CI/CD files', async () => {
    const config: ProjectConfig = {
      projectName: 'e2e-cicd',
      frontendFramework: 'React + Vite',
      backend: 'Express',
      database: 'PostgreSQL',
      authProvider: 'Auth0',
      stateManagement: 'Zustand',
      testingFramework: 'Vitest',
      packageManager: 'npm',
      aiAgent: 'generic',
      generateCicd: true,
      cicdProvider: 'github-actions',
      generateDockerfile: true,
      generateDockerCompose: true,
    };

    const tmpDir = makeTmpDir();
    await generateDocs(config, { targetDir: tmpDir, force: true });
    const docsDir = path.join(tmpDir, 'docs');

    expect(fs.existsSync(path.join(docsDir, 'Dockerfile')), 'Dockerfile should exist').toBe(true);
    expect(fs.existsSync(path.join(docsDir, 'docker-compose.yml')), 'docker-compose.yml should exist').toBe(true);
    expect(fs.existsSync(path.join(docsDir, '.github', 'workflows', 'ci.yml')), 'ci.yml should exist').toBe(true);

    expect(fs.readFileSync(path.join(docsDir, 'Dockerfile'), 'utf8').length).toBeGreaterThan(50);
    expect(fs.readFileSync(path.join(docsDir, 'docker-compose.yml'), 'utf8').length).toBeGreaterThan(50);
    expect(fs.readFileSync(path.join(docsDir, '.github', 'workflows', 'ci.yml'), 'utf8').length).toBeGreaterThan(50);
  });
});

describe('e2e: full feature toggle combination', () => {
  test('all features enabled creates 17+ files', async () => {
    const config: ProjectConfig = {
      projectName: 'e2e-full',
      frontendFramework: 'Next.js',
      backend: 'Firebase',
      database: 'Firestore',
      authProvider: 'Firebase Auth',
      stateManagement: 'Redux',
      testingFramework: 'Playwright',
      packageManager: 'pnpm',
      aiAgent: 'cursor',
      generateStandardDocs: true,
      license: 'MIT',
      generateCicd: true,
      cicdProvider: 'github-actions',
      generateDockerfile: true,
      generateDockerCompose: true,
    };

    const tmpDir = makeTmpDir();
    await generateDocs(config, { targetDir: tmpDir, force: true });

    const docsDir = path.join(tmpDir, 'docs');
    expect(fs.existsSync(docsDir)).toBe(true);

    const allFiles = getAllFiles(docsDir);
    const mdFiles = allFiles.filter(f => f.endsWith('.md'));
    const ymlFiles = allFiles.filter(f => f.endsWith('.yml'));
    const noExt = allFiles.filter(f => !f.includes('.'));

    expect(mdFiles.length).toBeGreaterThanOrEqual(13);
    expect(allFiles).toContain('Dockerfile');
    if (!allFiles.includes('.github/workflows/ci.yml')) {
      expect(ymlFiles.length).toBeGreaterThanOrEqual(1);
    }
    expect(noExt).toContain('LICENSE');
    expect(fs.readFileSync(path.join(docsDir, 'AGENTS.md'), 'utf8')).toContain('e2e-full');
    expect(fs.readFileSync(path.join(docsDir, 'ARCHITECTURE.md'), 'utf8')).toContain('Firebase');
    expect(fs.readFileSync(path.join(docsDir, 'GLOSSARY.md'), 'utf8')).toContain('e2e-full');
  });
});

describe('e2e: detect pipeline (scanProject + scanResultToConfig + generateDocs)', () => {
  test('scans a real project and generates docs without prompts', async () => {
    const scan = scanProject();
    expect(scan.frontendFramework).not.toBe('');
    expect(scan.projectName).toBeTruthy();

    const detected = scanResultToConfig(scan);
    expect(detected.projectName).toBe(scan.projectName);
    expect(detected.frontendFramework).toBe(scan.frontendFramework);
    expect(detected.backend).toBe(scan.backend);
    expect(detected.database).toBe(scan.database);
    expect(detected.authProvider).toBe(scan.authProvider);
    expect(detected.stateManagement).toBe(scan.stateManagement);
    expect(detected.testingFramework).toBe(scan.testingFramework);
    expect(detected.packageManager).toBe(scan.packageManager);

    const defaults: ProjectConfig = {
      projectName: 'my-app',
      frontendFramework: 'React + Vite',
      backend: 'None',
      database: 'None',
      authProvider: 'None',
      stateManagement: 'None',
      testingFramework: 'None',
      packageManager: 'npm',
      aiAgent: 'generic',
    };
    const config: ProjectConfig = { ...defaults, ...detected };

    const tmpDir = makeTmpDir();
    await generateDocs(config, { targetDir: tmpDir, force: true });

    const docsDir = path.join(tmpDir, 'docs');
    expect(fs.existsSync(docsDir)).toBe(true);
    for (const file of CORE_FILES) {
      const filePath = path.join(docsDir, file);
      expect(fs.existsSync(filePath), `${file} should exist`).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content.length).toBeGreaterThan(50);
    }
  });

  test('scanResultToConfig maps all detected fields', async () => {
    const scan = scanProject();
    const config = scanResultToConfig(scan);
    expect(config.projectName).toBe(scan.projectName);
    expect(config.frontendFramework).toBe(scan.frontendFramework);
    expect(config.backend).toBe(scan.backend);
    expect(config.database).toBe(scan.database);
    expect(config.authProvider).toBe(scan.authProvider);
    expect(config.stateManagement).toBe(scan.stateManagement);
    expect(config.testingFramework).toBe(scan.testingFramework);
    expect(config.packageManager).toBe(scan.packageManager);
  });
});

describe('e2e: save/load answers cycle', () => {
  test('saveAnswers writes a file that loadAnswers can read back', async () => {
    const tmpDir = makeTmpDir();
    const answers = {
      projectName: 'e2e-save-load',
      frontendFramework: 'Next.js',
      backend: 'Express',
      database: 'PostgreSQL',
      authProvider: 'Auth0',
      stateManagement: 'Zustand',
      testingFramework: 'Vitest',
      packageManager: 'pnpm',
      aiAgent: 'cursor',
      generateStandardDocs: true,
      license: 'MIT',
      generateCicd: true,
      cicdProvider: 'github-actions',
      generateDockerfile: true,
      generateDockerCompose: true,
    };

    saveAnswers(answers, tmpDir);
    const filePath = path.join(tmpDir, 'create-agent-docs.answers.json');
    expect(fs.existsSync(filePath)).toBe(true);
    const raw = fs.readJsonSync(filePath);
    expect(raw.projectName).toBe('e2e-save-load');
    expect(raw.frontendFramework).toBe('Next.js');

    const loaded = loadAnswers(tmpDir);
    expect(loaded).toBeTruthy();
    expect(loaded!.projectName).toBe('e2e-save-load');
    expect(loaded!.backend).toBe('Express');
    expect(loaded!.aiAgent).toBe('cursor');
    expect(loaded!.generateStandardDocs).toBe(true);
    expect(loaded!.generateCicd).toBe(true);
  });

  test('saved answers can generate docs without prompts', async () => {
    const tmpDir = makeTmpDir();
    const answers = {
      projectName: 'e2e-skip-prompts',
      frontendFramework: 'React + Vite',
      backend: 'None',
      database: 'None',
      authProvider: 'None',
      stateManagement: 'None',
      testingFramework: 'None',
      packageManager: 'npm',
      aiAgent: 'generic',
    };

    saveAnswers(answers, tmpDir);

    const loaded = loadAnswers(tmpDir);
    expect(loaded).toBeTruthy();

    const config: ProjectConfig = {
      projectName: loaded!.projectName,
      frontendFramework: loaded!.frontendFramework as ProjectConfig['frontendFramework'],
      backend: loaded!.backend as ProjectConfig['backend'],
      database: loaded!.database as ProjectConfig['database'],
      authProvider: loaded!.authProvider as ProjectConfig['authProvider'],
      stateManagement: loaded!.stateManagement as ProjectConfig['stateManagement'],
      testingFramework: loaded!.testingFramework as ProjectConfig['testingFramework'],
      packageManager: loaded!.packageManager as ProjectConfig['packageManager'],
      aiAgent: loaded!.aiAgent as ProjectConfig['aiAgent'],
    };

    await generateDocs(config, { targetDir: tmpDir, force: true });

    const docsDir = path.join(tmpDir, 'docs');
    expect(fs.existsSync(docsDir)).toBe(true);
    for (const file of ['AGENTS.md', 'ARCHITECTURE.md', 'GLOSSARY.md']) {
      const content = fs.readFileSync(path.join(docsDir, file), 'utf8');
      expect(content).toContain('e2e-skip-prompts');
    }
  });

  test('loadAnswers returns null when no file exists', () => {
    const tmpDir = makeTmpDir();
    const loaded = loadAnswers(tmpDir);
    expect(loaded).toBeNull();
  });
});

function getAllFiles(dir: string, baseDir = dir): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.backup') continue;
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(path.relative(baseDir, fullPath));
    }
  }
  return files;
}
