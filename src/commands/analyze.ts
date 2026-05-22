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

const REQUIRED_SECTIONS: Record<string, string[]> = {
  'AGENTS.md': ['Tech Stack', 'Command Reference', 'Rules of Engagement'],
  'ARCHITECTURE.md': ['Architecture Blueprint', 'System Overview'],
  'CODEBASE_MAP.md': ['Codebase Map', 'Directory Structure'],
  'BUSINESS_RULES.md': ['Business Rules', 'Domain Rules'],
  'API_CONTRACTS.md': ['API Contracts'],
  'UI_PATTERNS.md': ['UI Patterns'],
  'REFACTOR_RULES.md': ['Refactoring', 'Code Quality'],
  'GLOSSARY.md': ['Glossary'],
};

export interface AnalyzeOptions {
  strict?: boolean;
}

export async function analyzeCommand(options: AnalyzeOptions = {}): Promise<void> {
  logger.info('Analyzing documentation...');
  const docsDir = path.resolve('docs');

  if (!fs.existsSync(docsDir)) {
    logger.warn('No docs/ directory found. Run "generate" first.');
    return;
  }

  let missingCount = 0;
  let sectionIssues = 0;

  for (const file of EXPECTED_FILES) {
    const filePath = path.join(docsDir, file);
    if (!fs.existsSync(filePath)) {
      logger.error(`  [missing] ${file}`);
      missingCount++;
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const expected = REQUIRED_SECTIONS[file] || [];
    const fileIssues: string[] = [];

    for (const section of expected) {
      if (!content.includes(`# ${section}`) && !content.includes(`## ${section}`)) {
        fileIssues.push(section);
      }
    }

    if (fileIssues.length === 0) {
      logger.success(`  [pass]    ${file}`);
    } else {
      logger.warn(`  [stale]   ${file} — missing sections: ${fileIssues.join(', ')}`);
      sectionIssues++;
    }
  }

  const totalIssues = missingCount + sectionIssues;
  if (totalIssues === 0) {
    logger.success(`All ${EXPECTED_FILES.length} documentation files look good.`);
  } else {
    logger.warn(`Found ${totalIssues} issue(s): ${missingCount} missing, ${sectionIssues} stale.`);
  }

  if (options.strict && totalIssues > 0) {
    throw new Error('Strict mode: documentation analysis failed.');
  }
}
