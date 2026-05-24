import chalk from 'chalk';

export function initNoColor(): void {
  const hasNoColorFlag = process.argv.includes('--no-color');
  const hasNoColorEnv = process.env.NO_COLOR !== undefined;
  if (hasNoColorFlag || hasNoColorEnv) {
    chalk.level = 0;
  }
}
