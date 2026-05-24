import fs from 'fs-extra';
import path from 'path';
import type { FrontendFramework, Backend, Database, AuthProvider, StateManagement, TestingFramework, PackageManager, AiAgent, ProjectConfig } from '../types/index.js';

export interface ScanResult {
  projectName: string;
  frontendFramework: FrontendFramework;
  backend: Backend;
  database: Database;
  authProvider: AuthProvider;
  stateManagement: StateManagement;
  testingFramework: TestingFramework;
  packageManager: PackageManager;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  hasTsConfig: boolean;
  tsStrict: boolean;
  tsTarget: string;
  hasDocs: boolean;
  existingDocFiles: string[];
  detectedAiAgent?: AiAgent;
  hasDockerfile: boolean;
  hasDockerCompose: boolean;
  hasEslint: boolean;
  hasPrettier: boolean;
  hasServerDir: boolean;
  hasApiDir: boolean;
  hasFunctionsDir: boolean;
}

/**
 * Scan a project directory to auto-detect the technology stack.
 * Reads package.json dependencies, tsconfig.json, and project structure
 * to infer frontend framework, backend, database, auth provider, testing
 * framework, package manager, and AI agent configuration.
 * @param dir - Directory to scan (defaults to current working directory)
 * @returns Complete scan result with all detected values
 */
export function scanProject(dir: string = process.cwd()): ScanResult {
  const result: ScanResult = {
    projectName: path.basename(dir),
    frontendFramework: 'None',
    backend: 'None',
    database: 'None',
    authProvider: 'None',
    stateManagement: 'None',
    testingFramework: 'None',
    packageManager: detectPackageManager(dir),
    dependencies: {},
    devDependencies: {},
    hasTsConfig: false,
    tsStrict: false,
    tsTarget: '',
    hasDocs: false,
    existingDocFiles: [],
    hasDockerfile: false,
    hasDockerCompose: false,
    hasEslint: false,
    hasPrettier: false,
    hasServerDir: false,
    hasApiDir: false,
    hasFunctionsDir: false,
  };

  const pkgPath = path.join(dir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = fs.readJsonSync(pkgPath);
      result.projectName = pkg.name || result.projectName;
      result.dependencies = pkg.dependencies || {};
      result.devDependencies = pkg.devDependencies || {};
      detectFromDependencies(result);
    } catch { /* ignore */ }
  }

  const tsconfigPath = path.join(dir, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    result.hasTsConfig = true;
    try {
      const tsconfig = fs.readJsonSync(tsconfigPath);
      result.tsStrict = tsconfig.compilerOptions?.strict === true;
      result.tsTarget = tsconfig.compilerOptions?.target || '';
    } catch { /* ignore */ }
  }

  const docsDir = path.join(dir, 'docs');
  result.hasDocs = fs.existsSync(docsDir);
  if (result.hasDocs) {
    try {
      result.existingDocFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
    } catch { /* ignore */ }
  }

  result.hasDockerfile = fs.existsSync(path.join(dir, 'Dockerfile'));
  result.hasDockerCompose = fs.existsSync(path.join(dir, 'docker-compose.yml'));
  result.hasEslint = fs.existsSync(path.join(dir, '.eslintrc')) ||
    fs.existsSync(path.join(dir, '.eslintrc.json')) ||
    fs.existsSync(path.join(dir, '.eslintrc.js')) ||
    fs.existsSync(path.join(dir, '.eslintrc.cjs')) ||
    fs.existsSync(path.join(dir, '.eslintrc.yaml')) ||
    fs.existsSync(path.join(dir, 'eslint.config.js')) ||
    fs.existsSync(path.join(dir, 'eslint.config.mjs'));
  result.hasPrettier = fs.existsSync(path.join(dir, '.prettierrc')) ||
    fs.existsSync(path.join(dir, '.prettierrc.json'));

  const srcDir = path.join(dir, 'src');
  if (fs.existsSync(srcDir)) {
    result.hasServerDir = fs.existsSync(path.join(srcDir, 'server'));
    result.hasApiDir = fs.existsSync(path.join(srcDir, 'api'));
    result.hasFunctionsDir = fs.existsSync(path.join(srcDir, 'functions'));
  }
  result.hasServerDir = result.hasServerDir || fs.existsSync(path.join(dir, 'server'));
  result.hasApiDir = result.hasApiDir || fs.existsSync(path.join(dir, 'api'));
  result.hasFunctionsDir = result.hasFunctionsDir || fs.existsSync(path.join(dir, 'functions'));

  // AI agent detection
  if (fs.existsSync(path.join(dir, '.cursorrules'))) {
    result.detectedAiAgent = 'cursor';
  } else if (fs.existsSync(path.join(dir, 'CLAUDE.md'))) {
    result.detectedAiAgent = 'claude';
  } else if (fs.existsSync(path.join(dir, '.github', 'copilot-instructions.md'))) {
    result.detectedAiAgent = 'codex';
  }

  return result;
}

function detectPackageManager(dir: string): PackageManager {
  if (fs.existsSync(path.join(dir, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(dir, 'bun.lockb'))) return 'bun';
  return 'npm';
}

function detectFromDependencies(result: ScanResult): void {
  const allDeps = { ...result.dependencies, ...result.devDependencies };
  const depNames = Object.keys(allDeps);

  // Frontend framework
  if (depNames.includes('next')) result.frontendFramework = 'Next.js';
  else if (depNames.includes('react') || depNames.includes('react-dom')) result.frontendFramework = 'React + Vite';
  else if (depNames.includes('vue')) result.frontendFramework = 'Vue';
  else if (depNames.includes('@angular/core')) result.frontendFramework = 'Angular';

  // Backend
  if (depNames.includes('firebase') || depNames.includes('firebase-admin') || depNames.includes('firebase-functions')) {
    result.backend = 'Firebase';
    if (depNames.includes('firebase')) result.database = 'Firestore';
    if (depNames.includes('firebase-admin')) result.authProvider = 'Firebase Auth';
  } else if (depNames.includes('express')) result.backend = 'Express';
  else if (depNames.includes('@nestjs/core')) result.backend = 'NestJS';
  else if (depNames.includes('fastify')) result.backend = 'Fastify';

  // Database
  if (!result.database || result.database === 'None') {
    if (depNames.includes('mongoose') || depNames.includes('mongodb')) result.database = 'MongoDB';
    else if (depNames.includes('pg') || depNames.includes('postgres') || depNames.includes('prisma') || depNames.includes('drizzle-orm')) result.database = 'PostgreSQL';
    else if (depNames.includes('firebase')) result.database = 'Firestore';
    else if (depNames.includes('redis')) result.database = 'Redis';
  }

  // Auth
  if (!result.authProvider || result.authProvider === 'None') {
    if (depNames.includes('next-auth') || depNames.includes('next-auth/react')) result.authProvider = 'NextAuth';
    else if (depNames.includes('firebase')) result.authProvider = 'Firebase Auth';
    else if (depNames.includes('auth0') || depNames.includes('@auth0/auth0-react')) result.authProvider = 'Auth0';
    else if (depNames.includes('passport') || depNames.includes('jsonwebtoken')) result.authProvider = 'Custom';
  }

  // State management
  if (depNames.includes('zustand')) result.stateManagement = 'Zustand';
  else if (depNames.includes('@reduxjs/toolkit') || depNames.includes('redux')) result.stateManagement = 'Redux';
  else if (depNames.includes('pinia')) result.stateManagement = 'Pinia';

  // Testing
  if (depNames.includes('vitest')) result.testingFramework = 'Vitest';
  else if (depNames.includes('jest')) result.testingFramework = 'Jest';
  else if (depNames.includes('playwright') || depNames.includes('@playwright/test')) result.testingFramework = 'Playwright';
  else if (depNames.includes('cypress')) result.testingFramework = 'Cypress';
}

/**
 * Convert a scan result into a partial ProjectConfig suitable for
 * passing to generateDocs or promptProjectConfig as pre-filled values.
 * @param scan - Result from scanProject()
 * @returns Partial project configuration
 */
export function scanResultToConfig(scan: ScanResult): Partial<ProjectConfig> {
  return {
    projectName: scan.projectName,
    frontendFramework: scan.frontendFramework,
    backend: scan.backend,
    database: scan.database,
    authProvider: scan.authProvider,
    stateManagement: scan.stateManagement,
    testingFramework: scan.testingFramework,
    packageManager: scan.packageManager,
    aiAgent: scan.detectedAiAgent || undefined,
  };
}
