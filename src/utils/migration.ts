import fs from 'fs-extra';
import path from 'path';

const VERSION_RE = /<!-- template-version:\s*([^\s]+)\s*-->/;

export interface MigrationDiff {
  file: string;
  type: 'added' | 'removed' | 'changed';
  oldContent?: string;
  newContent?: string;
}

export function extractVersion(content: string): string | null {
  const match = content.match(VERSION_RE);
  return match ? match[1] : null;
}

export function stripVersion(content: string): string {
  return content.replace(VERSION_RE, '').trimStart();
}

export function diffTemplates(oldContent: string, newContent: string): MigrationDiff[] {
  const diffs: MigrationDiff[] = [];
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const maxLen = Math.max(oldLines.length, newLines.length);

  let inBlock = false;
  let blockStart = -1;
  let blockOld: string[] = [];
  let blockNew: string[] = [];

  function flushBlock(): void {
    if (blockOld.length > 0 || blockNew.length > 0) {
      const changed = blockOld.join('\n') !== blockNew.join('\n');
      if (changed) {
        diffs.push({
          file: '',
          type: 'changed',
          oldContent: blockOld.join('\n'),
          newContent: blockNew.join('\n'),
        });
      }
    }
    blockOld = [];
    blockNew = [];
  }

  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i] ?? '';
    const newLine = newLines[i] ?? '';

    if (oldLine !== newLine) {
      if (!inBlock) {
        inBlock = true;
        blockStart = i;
      }
      blockOld.push(oldLine);
      blockNew.push(newLine);
    } else {
      if (inBlock) {
        flushBlock();
        inBlock = false;
      }
    }
  }
  if (inBlock) flushBlock();

  return diffs;
}

export function scanGeneratedFiles(dir: string): { file: string; version: string | null; content: string }[] {
  const results: { file: string; version: string | null; content: string }[] = [];

  function walk(directory: string): void {
    if (!fs.existsSync(directory)) return;
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name === '.cursorrules' || entry.name === 'CLAUDE.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const version = extractVersion(content);
        results.push({ file: fullPath, version, content });
      }
    }
  }

  walk(dir);
  return results;
}

export async function readTemplates(dir: string): Promise<Record<string, string>> {
  const templates: Record<string, string> = {};
  if (!fs.existsSync(dir)) return templates;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'partials') {
      const nested = await readTemplates(fullPath);
      Object.assign(templates, nested);
    } else if (entry.isFile() && entry.name.endsWith('.hbs')) {
      templates[entry.name] = fs.readFileSync(fullPath, 'utf8');
    }
  }
  return templates;
}

export function diffTemplateSets(
  current: Record<string, string>,
  latest: Record<string, string>,
): MigrationDiff[] {
  const diffs: MigrationDiff[] = [];
  const allFiles = new Set([...Object.keys(current), ...Object.keys(latest)]);

  for (const file of [...allFiles].sort()) {
    const cur = current[file];
    const lat = latest[file];

    if (!lat) {
      diffs.push({ file, type: 'removed' });
    } else if (!cur) {
      diffs.push({ file, type: 'added', newContent: lat });
    } else if (cur !== lat) {
      diffs.push({ file, type: 'changed', oldContent: cur, newContent: lat });
    }
  }

  return diffs;
}

export async function applyMigration(
  targetDir: string,
  diffs: MigrationDiff[],
  dryRun: boolean = false,
): Promise<string[]> {
  const applied: string[] = [];

  for (const diff of diffs) {
    const filePath = path.join(targetDir, diff.file);

    if (diff.type === 'removed') {
      if (dryRun) {
        applied.push(`[removed] ${diff.file} (would be removed)`);
      } else if (fs.existsSync(filePath)) {
        await fs.remove(filePath);
        applied.push(`[removed] ${diff.file}`);
      }
    } else if (diff.type === 'added') {
      if (dryRun) {
        applied.push(`[added] ${diff.file} (would be created)`);
      } else {
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, diff.newContent || '', 'utf8');
        applied.push(`[added] ${diff.file}`);
      }
    } else if (diff.type === 'changed') {
      if (dryRun) {
        applied.push(`[changed] ${diff.file} (would be updated)`);
      } else if (fs.existsSync(filePath)) {
        const backupPath = filePath + '.bak';
        await fs.copy(filePath, backupPath);
        await fs.writeFile(filePath, diff.newContent || '', 'utf8');
        applied.push(`[changed] ${diff.file}`);
      }
    }
  }

  return applied;
}
