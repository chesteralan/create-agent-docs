export type AiAgent = 'cursor' | 'claude' | 'codex' | 'generic';

export interface ProjectConfig {
  projectName: string;
  frontendFramework: string;
  backend: string;
  database: string;
  authProvider: string;
  stateManagement: string;
  testingFramework: string;
  packageManager: string;
  aiAgent: AiAgent;
}
