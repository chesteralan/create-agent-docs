import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger.js';

const EXPECTED_FILES = [
  'AGENTS.md',
  'ARCHITECTURE.md',
  'CODEBASE_MAP.md',
  'BUSINESS_RULES.md',
  'API_CONTRACTS.md',
  'UI_PATTERNS.md',
  'REFACTOR_RULES.md',
  'GLOSSARY.md',
];

const UNSUBSTITUTED_PATTERN = /\{\{([^}]+)\}\}/g;

export interface ValidateOptions {
  fix?: boolean;
}

export async function validateCommand(options: ValidateOptions = {}): Promise<void> {
  logger.info('Validating documentation...');
  const docsDir = path.resolve('docs');

  if (!fs.existsSync(docsDir)) {
    logger.warn('No docs/ directory found. Run "generate" first.');
    return;
  }

  let totalIssues = 0;

  for (const file of EXPECTED_FILES) {
    const filePath = path.join(docsDir, file);
    if (!fs.existsSync(filePath)) {
      logger.warn(`  [skip]    ${file} — not found`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const unsubstituted: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      if (UNSUBSTITUTED_PATTERN.test(lines[i])) {
        unsubstituted.push(i + 1);
      }
    }

    if (unsubstituted.length === 0) {
      logger.success(`  [pass]    ${file}`);
    } else {
      logger.warn(
        `  [fail]    ${file} — unsubstituted variables at lines ${unsubstituted.join(', ')}`,
      );
      totalIssues += unsubstituted.length;

      if (options.fix) {
        const fixed = content.replace(UNSUBSTITUTED_PATTERN, (_, varName) => `*[UNSET: ${varName.trim()}]*`);
        fs.writeFileSync(filePath, fixed, 'utf8');
        logger.info(`  [fixed]   ${file} — replaced ${unsubstituted.length} unsubstituted variables with placeholders`);
      }
    }
  }

  if (totalIssues === 0) {
    logger.success('Validation passed — all variables are properly substituted.');
  } else {
    logger.warn(`Validation found ${totalIssues} unsubstituted variable(s).`);
  }
}
