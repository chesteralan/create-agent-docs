import { describe, test, expect } from 'vitest';
import { renderTemplate } from '../src/generators/template-engine.js';
import { loadPreset } from '../src/utils/preset.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.resolve(__dirname, '../src/templates');

const standardConfig = {
  projectName: 'test-project',
  frontendFramework: 'Next.js',
  backend: 'Express',
  database: 'PostgreSQL',
  authProvider: 'Auth0',
  stateManagement: 'Zustand',
  testingFramework: 'Vitest',
  packageManager: 'npm',
  aiAgent: 'generic',
};

const minimalConfig = {
  projectName: 'test-project',
  frontendFramework: 'None',
  backend: 'None',
  database: 'None',
  authProvider: 'None',
  stateManagement: 'None',
  testingFramework: 'None',
  packageManager: 'npm',
  aiAgent: 'generic',
};

describe('renderTemplate', () => {
  test('injects simple variables', () => {
    const result = renderTemplate('Hello {{name}}', { name: 'World' });
    expect(result).toContain('Hello World');
    expect(result).not.toContain('{{name}}');
  });

  test('renders all variables from standard config', () => {
    const result = renderTemplate(
      '{{projectName}} | {{frontendFramework}} | {{backend}} | {{database}} | {{authProvider}} | {{stateManagement}} | {{testingFramework}} | {{packageManager}}',
      standardConfig,
    );
    expect(result).toContain('test-project');
    expect(result).toContain('Next.js');
    expect(result).toContain('Express');
    expect(result).toContain('PostgreSQL');
    expect(result).toContain('Auth0');
    expect(result).toContain('Zustand');
    expect(result).toContain('Vitest');
    expect(result).toContain('npm');
    expect(result).not.toContain('{{');
  });

  test('handles missing variables gracefully', () => {
    const result = renderTemplate('Hello {{name}}', {});
    expect(result).toContain('Hello');
    expect(result).not.toContain('undefined');
  });

  test('eq helper renders true branch', () => {
    const result = renderTemplate(
      '{{#eq framework "Next.js"}}IS_NEXT{{else}}NOT_NEXT{{/eq}}',
      { framework: 'Next.js' },
    );
    expect(result).toContain('IS_NEXT');
    expect(result).not.toContain('NOT_NEXT');
  });

  test('eq helper renders false branch', () => {
    const result = renderTemplate(
      '{{#eq framework "Next.js"}}IS_NEXT{{else}}NOT_NEXT{{/eq}}',
      { framework: 'Vue' },
    );
    expect(result).toContain('NOT_NEXT');
    expect(result).not.toContain('IS_NEXT');
  });

  test('ne helper renders true when not equal', () => {
    const result = renderTemplate(
      '{{#ne testingFramework "None"}}HAS_TESTS{{/ne}}',
      { testingFramework: 'Vitest' },
    );
    expect(result).toContain('HAS_TESTS');
  });

  test('ne helper renders nothing when equal', () => {
    const result = renderTemplate(
      '{{#ne testingFramework "None"}}HAS_TESTS{{/ne}}',
      { testingFramework: 'None' },
    );
    expect(result).not.toContain('HAS_TESTS');
  });

  test('or helper renders when either is truthy', () => {
    const result = renderTemplate('{{#or a b}}TRUE{{/or}}', { a: '', b: 'yes' });
    expect(result).toContain('TRUE');
  });

  test('and helper renders when both are truthy', () => {
    const result = renderTemplate('{{#and a b}}TRUE{{/and}}', { a: 'yes', b: 'yes' });
    expect(result).toContain('TRUE');
  });

  test('not helper inverts truthiness', () => {
    const result = renderTemplate('{{#not a}}FALSE{{/not}}', { a: '' });
    expect(result).toContain('FALSE');
  });
});

describe('Template snapshots', () => {
  const snapshotTemplateFiles = [
    'AGENTS.md.hbs',
    'ARCHITECTURE.md.hbs',
    'CODEBASE_MAP.md.hbs',
    'BUSINESS_RULES.md.hbs',
    'API_CONTRACTS.md.hbs',
    'UI_PATTERNS.md.hbs',
    'REFACTOR_RULES.md.hbs',
    'GLOSSARY.md.hbs',
    'TASKS.md.hbs',
    'REFACTORING.md.hbs',
    'TEST_RULES.md.hbs',
    'FEATURES.md.hbs',
    'PRD.md.hbs',
    'ADR.md.hbs',
    'COMPLIANCE.md.hbs',
    'DATA_MODELS.md.hbs',
    'DEPLOYMENT.md.hbs',
    'INFRASTRUCTURE.md.hbs',
    'MONITORING.md.hbs',
    'ONBOARDING.md.hbs',
    'RUNBOOKS.md.hbs',
  ];

  const snapshotPresets = [
    'nextjs', 'nextjs-saas', 'express', 'firebase',
    'vue', 'angular', 'nestjs', 'mern', 'react-firebase',
    't3', 'fastapi', 'ai-claude', 'ai-cursor', 'ai-codex', 'chrome-extension',
  ];

  for (const presetName of snapshotPresets) {
    test(`${presetName} preset renders match snapshot`, async () => {
      const preset = await loadPreset(presetName);
      const fullConfig = { ...standardConfig, ...preset };

      const outputs: Record<string, string> = {};
      for (const file of snapshotTemplateFiles) {
        const content = fs.readFileSync(path.join(TEMPLATE_DIR, file), 'utf8');
        outputs[file] = renderTemplate(content, {
          ...fullConfig,
          generatedDate: '2025-01-01',
          cliVersion: '1.0.0-test',
        } as any);
      }
      expect(outputs).toMatchSnapshot(presetName);
    });
  }
});

describe('All 21 templates render without error', () => {
  const templateFiles = [
    'AGENTS.md.hbs',
    'ARCHITECTURE.md.hbs',
    'CODEBASE_MAP.md.hbs',
    'BUSINESS_RULES.md.hbs',
    'API_CONTRACTS.md.hbs',
    'UI_PATTERNS.md.hbs',
    'REFACTOR_RULES.md.hbs',
    'GLOSSARY.md.hbs',
    'TASKS.md.hbs',
    'REFACTORING.md.hbs',
    'TEST_RULES.md.hbs',
    'FEATURES.md.hbs',
    'PRD.md.hbs',
    'ADR.md.hbs',
    'COMPLIANCE.md.hbs',
    'DATA_MODELS.md.hbs',
    'DEPLOYMENT.md.hbs',
    'INFRASTRUCTURE.md.hbs',
    'MONITORING.md.hbs',
    'ONBOARDING.md.hbs',
    'RUNBOOKS.md.hbs',
  ];

  for (const file of templateFiles) {
    test(`${file} renders with standard config`, () => {
      const content = fs.readFileSync(path.join(TEMPLATE_DIR, file), 'utf8');
      const result = renderTemplate(content, standardConfig);
      expect(result).toBeTruthy();
      expect(result).not.toContain('{{');
      expect(result).not.toContain('undefined');
    });

    test(`${file} renders with minimal config (all None)`, () => {
      const content = fs.readFileSync(path.join(TEMPLATE_DIR, file), 'utf8');
      const result = renderTemplate(content, minimalConfig);
      expect(result).toBeTruthy();
      expect(result).not.toContain('undefined');
    });
  }
});
