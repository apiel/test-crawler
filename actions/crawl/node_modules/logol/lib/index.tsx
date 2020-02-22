import chalk from 'chalk';

export const logol = {
    info: console.info,
    log: console.log,
    debug: console.debug,
    warn: console.warn,
    error: console.error,
}

function colorize(args: any[], fn: any) {
    return args.map(arg => (['string', 'number'] as any).includes(typeof(arg)) ? fn(arg) : arg );
}

export function info(...args: any) {
    logol.info(chalk.bold(chalk.blue('• info')), ...args);
}

export function log(...args: any) {
    logol.log(chalk.bold('•'), ...args);
}

export function success(...args: any) {
    logol.info(chalk.bold(chalk.green('• success')), ...colorize(args, chalk.green));
}

export function debug(...args: any) {
    logol.debug(chalk.bold(chalk.gray('• debug')), ...colorize(args, chalk.gray));
}

export function warn(...args: any) {
    logol.warn(chalk.bold(chalk.yellow('• warn')), ...colorize(args, chalk.yellow));
}

export function error(...args: any) {
    logol.error(chalk.bold(chalk.red('• ') + chalk.bgRed('ERR')), ...colorize(args, chalk.red));
}
