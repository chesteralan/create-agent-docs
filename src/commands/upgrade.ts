import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';
import { t } from '../utils/locale.js';
import { scanGeneratedFiles, diffTemplateSets, readTemplates, applyMigration, type MigrationDiff } from '../utils/migration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.resolve(__dirname, '../templates');

export interface UpgradeOptions {
  dryRun?: boolean;
  diff?: boolean;
  migrate?: boolean;
}

async function getCurrentVersion(): Promise<string> {
  try {
    const pkg = await fs.readJson(path.resolve(__dirname, '../../package.json'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

async function getLatestVersion(): Promise<string | null> {
  try {
    const output = execSync('npm view create-agent-docs version 2>/dev/null', {
      encoding: 'utf8',
      timeout: 10000,
    });
    return output.trim();
  } catch {
    return null;
  }
}

export async function upgradeCommand(options: UpgradeOptions = {}): Promise<void> {
  if (options.diff) {
    await showTemplateDiff();
    return;
  }

  if (options.migrate) {
    await migrateGeneratedDocs(options);
    return;
  }

  logger.info('Checking for updates...');

  const current = await getCurrentVersion();
  logger.info(`Current version: ${logger.bold(current)}`);

  const latest = await getLatestVersion();

  if (!latest) {
    logger.warn('Could not check npm registry. Are you offline?');
    logger.info('Running yarn install to refresh local dependencies...');
    if (!options.dryRun) {
      execSync('yarn install', { stdio: 'inherit' });
    } else {
      logger.info('[Dry-Run] Would run: yarn install');
    }
    logger.success('Dependencies refreshed.');
    return;
  }

  logger.info(`Latest version:  ${logger.bold(latest)}`);

  if (current === latest) {
    logger.success('You are on the latest version.');
    return;
  }

  logger.info(`A newer version (${latest}) is available!`);
  logger.info(`Run: ${logger.bold('npm install -g create-agent-docs@latest')}`);
  logger.info(`Or:  ${logger.bold('npx create-agent-docs@latest')}`);

  if (!options.dryRun) {
    logger.info('Upgrading local installation...');
    try {
      execSync('yarn install', { stdio: 'inherit' });
      logger.success('Dependencies refreshed.');
    } catch (err: any) {
      logger.error(`Failed to refresh dependencies: ${err.message}`);
      throw err;
    }
  }
}

async function readLocalTemplates(dir: string): Promise<Record<string, string>> {
  const templates: Record<string, string> = {};
  if (!fs.existsSync(dir)) return templates;
  const files = fs.readdirSync(dir, { recursive: true }) as string[];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isFile() && file.endsWith('.hbs')) {
      templates[file] = fs.readFileSync(fullPath, 'utf8');
    }
  }
  return templates;
}

async function fetchLatestTemplates(): Promise<Record<string, string> | null> {
  try {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cad-diff-'));
    execSync(`npm pack create-agent-docs --pack-destination "${tmpDir}" 2>/dev/null`, {
      stdio: 'pipe',
      timeout: 30000,
    });
    const tarball = fs.readdirSync(tmpDir).find(f => f.endsWith('.tgz'));
    if (!tarball) return null;
    const extractDir = path.join(tmpDir, 'pkg');
    fs.ensureDirSync(extractDir);
    execSync(`tar -xzf "${path.join(tmpDir, tarball)}" -C "${extractDir}" 2>/dev/null`, {
      stdio: 'pipe',
    });
    const templates = await readTemplates(path.join(extractDir, 'package', 'dist', 'templates'));
    fs.removeSync(tmpDir);
    return templates;
  } catch {
    return null;
  }
}

async function showTemplateDiff(): Promise<void> {
  logger.info('Comparing current templates with latest published version...');

  const currentDir = path.resolve(__dirname, '../templates');
  const currentTemplates = await readLocalTemplates(currentDir);

  if (Object.keys(currentTemplates).length === 0) {
    logger.warn('No templates found in current installation.');
    return;
  }

  const latestTemplates = await fetchLatestTemplates();
  if (!latestTemplates) {
    logger.warn('Could not fetch latest templates from npm. Are you offline?');
    return;
  }

  const allFiles = new Set([...Object.keys(currentTemplates), ...Object.keys(latestTemplates)]);
  let changes = 0;

  for (const file of [...allFiles].sort()) {
    const current = currentTemplates[file];
    const latest = latestTemplates[file];

    if (!latest) {
      logger.info(`  ${logger.bold('[removed]')} ${file}`);
      changes++;
    } else if (!current) {
      logger.info(`  ${logger.bold('[added]')} ${file}`);
      changes++;
    } else if (current !== latest) {
      logger.info(`  ${logger.bold('[changed]')} ${file}`);
      changes++;
    }
  }

  if (changes === 0) {
    logger.success('Templates are identical to latest published version.');
  } else {
    logger.info(`\n${changes} template(s) differ from latest published version.`);
  }
}

async function migrateGeneratedDocs(options: UpgradeOptions): Promise<void> {
  const docsDir = path.resolve('docs');
  const generatedFiles = scanGeneratedFiles(docsDir);

  if (generatedFiles.length === 0) {
    logger.warn('No generated files found in docs/ directory.');
    return;
  }

  logger.info(`Found ${generatedFiles.length} generated file(s) to check.`);

  const currentTemplates = await readTemplates(TEMPLATE_DIR);
  const diffs: MigrationDiff[] = [];

  for (const gf of generatedFiles) {
    const templateName = path.basename(gf.file);
    const templateKey = Object.keys(currentTemplates).find(
      k => k === `${templateName}.hbs` || k === templateName,
    );
    if (!templateKey) continue;

    const currentTemplateContent = currentTemplates[templateKey];
    const bareContent = gf.content.replace(/<!-- template-version:[^>]+-->\n*/g, '').trim();

    if (bareContent !== currentTemplateContent.trim()) {
      diffs.push({
        file: path.relative(process.cwd(), gf.file),
        type: 'changed',
        oldContent: bareContent,
        newContent: currentTemplateContent,
      });
    }
  }

  if (diffs.length === 0) {
    logger.success('All generated files match current templates.');
    return;
  }

  logger.info(`\n${diffs.length} file(s) differ from current templates.`);

  if (options.dryRun) {
    logger.header('Migration dry-run:');
    for (const diff of diffs) {
      logger.info(`  ${logger.bold(`[${diff.type}]`)} ${diff.file}`);
    }
    logger.info('Dry-run complete. No files were modified.');
    return;
  }

  const applied = await applyMigration(process.cwd(), diffs, false);
  logger.header('Migration applied:');
  for (const entry of applied) {
    logger.info(`  ${entry}`);
  }
}
