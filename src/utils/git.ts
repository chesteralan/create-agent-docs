import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

export function initGitRepo(dir: string): boolean {
  if (fs.existsSync(path.join(dir, '.git'))) return false;
  execSync('git init', { cwd: dir, stdio: 'pipe' });
  return true;
}

export function createDefaultGitignore(dir: string): void {
  const gitignorePath = path.join(dir, '.gitignore');
  if (fs.existsSync(gitignorePath)) return;

  const defaults = [
    '# Dependencies',
    'node_modules/',
    '.pnp',
    '.pnp.js',
    '',
    '# Build outputs',
    'dist/',
    'build/',
    '.next/',
    '',
    '# Environment',
    '.env',
    '.env.local',
    '.env.*.local',
    '',
    '# IDE',
    '.vscode/',
    '.idea/',
    '*.swp',
    '*.swo',
    '',
    '# OS',
    '.DS_Store',
    'Thumbs.db',
    '',
    '# Backups',
    '.backup/',
    '',
  ].join('\n');

  fs.writeFileSync(gitignorePath, defaults);
}
