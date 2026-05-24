import fs from 'fs-extra';
import path from 'path';

export function ensureGitignoreEntry(dir: string, entry: string): boolean {
  const gitignorePath = path.join(dir, '.gitignore');
  let content = '';

  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf8');
    const lines = content.split('\n').map(l => l.trim());
    if (lines.includes(entry)) return false;
  }

  content += (content.endsWith('\n') ? '' : '\n') + entry + '\n';
  fs.writeFileSync(gitignorePath, content);
  return true;
}
