import chalk from 'chalk';

export const logger = {
  info: (msg: string) => {
    console.log(`${chalk.blue('ℹ')} ${msg}`);
  },
  success: (msg: string) => {
    console.log(`${chalk.green('✔')} ${msg}`);
  },
  warn: (msg: string) => {
    console.warn(`${chalk.yellow('⚠')} ${msg}`);
  },
  error: (msg: string) => {
    console.error(`${chalk.red('✖')} ${chalk.red(msg)}`);
  },
  bold: (msg: string) => {
    return chalk.bold(msg);
  },
  header: (msg: string) => {
    console.log(`\n${chalk.bold.blue(msg)}`);
  },
};
