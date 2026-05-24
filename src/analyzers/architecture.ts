import { ScanResult } from './scanner.js';

export interface ArchitectureSummary {
  projectName: string;
  nodeVersion?: string;
  packageManager: string;
  typescript: {
    enabled: boolean;
    strict: boolean;
    target: string;
  };
  frontend: string;
  backend: string;
  database: string;
  auth: string;
  stateManagement: string;
  testing: string;
  ciCd: string[];
  dependencyCount: number;
  devDependencyCount: number;
}

export function generateArchitectureSummary(scan: ScanResult): ArchitectureSummary {
  const ciCd: string[] = [];
  if (scan.hasDockerfile) ciCd.push('Docker');
  if (scan.hasDockerCompose) ciCd.push('Docker Compose');
  if (fs.existsSync('.github/workflows')) ciCd.push('GitHub Actions');
  if (fs.existsSync('.circleci/config.yml')) ciCd.push('CircleCI');

  return {
    projectName: scan.projectName,
    packageManager: scan.packageManager,
    typescript: {
      enabled: scan.hasTsConfig,
      strict: scan.tsStrict,
      target: scan.tsTarget,
    },
    frontend: scan.frontendFramework,
    backend: scan.backend,
    database: scan.database,
    auth: scan.authProvider,
    stateManagement: scan.stateManagement,
    testing: scan.testingFramework,
    ciCd,
    dependencyCount: Object.keys(scan.dependencies).length,
    devDependencyCount: Object.keys(scan.devDependencies).length,
  };
}

export function categorizeDependencies(
  deps: Record<string, string>,
  devDeps: Record<string, string>,
): Record<string, Array<{ name: string; version: string }>> {
  const all = { ...deps, ...devDeps };
  const result: Record<string, Array<{ name: string; version: string }>> = {
    frontend: [],
    backend: [],
    database: [],
    testing: [],
    tooling: [],
    'ai/ml': [],
    other: [],
  };

  for (const [name, version] of Object.entries(all)) {
    const item = { name, version };
    if (isTestingDep(name)) result.testing.push(item);
    else if (isFrontendDep(name)) result.frontend.push(item);
    else if (isBackendDep(name)) result.backend.push(item);
    else if (isDatabaseDep(name)) result.database.push(item);
    else if (isToolingDep(name)) result.tooling.push(item);
    else if (isAiMlDep(name)) result['ai/ml'].push(item);
    else result.other.push(item);
  }

  return result;
}

import fs from 'fs-extra';

function isFrontendDep(name: string): boolean {
  return /^(react|next|vue|angular|svelte|solid|preact|sass|less|tailwindcss|postcss|vite|webpack|esbuild)/i.test(name);
}

function isBackendDep(name: string): boolean {
  return /^(express|fastify|nestjs|@nestjs|koa|hapi|firebase|firebase-admin|firebase-functions|trpc)/i.test(name);
}

function isDatabaseDep(name: string): boolean {
  return /^(pg|postgres|mongodb|mongoose|redis|prisma|drizzle|typeorm|sequelize|knex|sqlite3|better-sqlite3|mysql)/i.test(name);
}

function isTestingDep(name: string): boolean {
  return /^(vitest|jest|playwright|cypress|mocha|chai|jasmine|ava|supertest|@testing-library)/i.test(name);
}

function isToolingDep(name: string): boolean {
  return /^(eslint|prettier|typescript|husky|lint-staged|commitlint|semantic-release|rollup|tsup|nx|turbo|lerna)/i.test(name);
}

function isAiMlDep(name: string): boolean {
  return /^(openai|langchain|anthropic|cohere|huggingface|transformers|tensorflow|pytorch|onnx)/i.test(name);
}
