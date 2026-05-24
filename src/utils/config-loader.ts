import fs from 'fs-extra';
import path from 'path';

export interface ProjectConfigFile {
  preset?: string;
  output?: string;
  standard?: boolean;
  detect?: boolean;
  force?: boolean;
  dryRun?: boolean;
  yes?: boolean;
  interactive?: boolean;
}

const CONFIG_VARIANTS = [
  '.create-agent-docsrc',
  '.create-agent-docsrc.json',
  'create-agent-docs.json',
];

export function loadProjectConfig(dir: string = process.cwd()): ProjectConfigFile | null {
  for (const variant of CONFIG_VARIANTS) {
    const filePath = path.join(dir, variant);
    if (fs.existsSync(filePath)) {
      try {
        const config = fs.readJsonSync(filePath) as ProjectConfigFile;
        return config;
      } catch {
        continue;
      }
    }
  }
  return null;
}
