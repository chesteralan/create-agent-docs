export type FrontendFramework = 'React + Vite' | 'Next.js' | 'Vue' | 'Angular' | 'None';
export type Backend = 'Express' | 'NestJS' | 'FastAPI' | 'Firebase' | 'Fastify' | 'None';
export type Database = 'PostgreSQL' | 'MongoDB' | 'Firestore' | 'SQLite' | 'Redis' | 'None';
export type AuthProvider = 'Firebase Auth' | 'NextAuth' | 'Auth0' | 'Custom' | 'None';
export type StateManagement = 'Zustand' | 'Redux' | 'React Context' | 'Pinia' | 'None';
export type TestingFramework = 'Vitest' | 'Jest' | 'Playwright' | 'Cypress' | 'None';
export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';
export type AiAgent = 'cursor' | 'claude' | 'codex' | 'generic';
export type License = 'MIT' | 'Apache-2.0' | 'GPL-3.0';
export type CiCdProvider = 'github-actions' | 'none';

export interface ProjectConfig {
  projectName: string;
  projectDescription?: string;
  frontendFramework: FrontendFramework;
  backend: Backend;
  database: Database;
  authProvider: AuthProvider;
  stateManagement: StateManagement;
  testingFramework: TestingFramework;
  packageManager: PackageManager;
  aiAgent: AiAgent;
  generateStandardDocs?: boolean;
  license?: License;
  generateCicd?: boolean;
  cicdProvider?: CiCdProvider;
  generateDockerfile?: boolean;
  generateDockerCompose?: boolean;
  templateOverrides?: Record<string, string>;
}
