import { spawn, spawnSync } from 'child_process';
import { which, quote } from './utils.js';
import ora from 'ora';
import chalk from 'chalk';

export type Engine = 'rg' | 'grep';

export function resolveEngine(): { engine: Engine; path: string } {
  const rg = which('rg');
  if (rg) {
    return { engine: 'rg', path: rg };
  }

  const grep = which('grep');
  if (grep) {
    return { engine: 'grep', path: grep };
  }

  throw new Error('Neither ripgrep (rg) nor grep found in PATH');
}

export function runEngine(
  engine: Engine,
  regex: string,
  args: string[],
  dryRun: boolean = false
): void {
  const { path: enginePath } = resolveEngine();

  // Add color support if not already specified
  const hasColorFlag = args.some(arg => arg.startsWith('--color'));
  const colorArgs = hasColorFlag ? [] : ['--color=always'];

  // Correct order: grep -E 'pattern' --color=always args...
  const finalArgs = ['-E', regex, ...colorArgs, ...args];
  const command = `${engine} ${finalArgs.map(quote).join(' ')}`;

  if (dryRun) {
    console.log(`\n🔍 Would execute: ${command}\n`);
    return;
  }

  const funnyPhrases = [
    '🔮 Summoning regex wizardry...',
    '🕵️  Hunting down those patterns...',
    '🎯 Locking onto target strings...',
    '🧙 Casting grep spells...',
    '🚀 Launching pattern missiles...',
    '🔍 Sherlock mode activated...',
    '🎪 Performing search acrobatics...',
    '⚡ Electrifying your grep...',
    '🎲 Rolling for search success...',
    '🎨 Painting matches on screen...'
  ];
  
  const randomPhrase = funnyPhrases[Math.floor(Math.random() * funnyPhrases.length)];
  const spinner = ora(chalk.cyan(randomPhrase)).start();

  const child = spawn(enginePath, finalArgs, {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: false,
    env: { ...process.env, GREP_COLORS: 'ms=01;31:mc=01;31:sl=:cx=:fn=35:ln=32:bn=32:se=36' }
  });

  let hasOutput = false;

  child.stdout.on('data', (data) => {
    if (!hasOutput) {
      spinner.succeed(chalk.green('Done! Here\'s what I found:\n'));
      hasOutput = true;
    }
    process.stdout.write(data);
  });

  child.stderr.on('data', (data) => {
    if (!hasOutput) {
      spinner.stop();
      hasOutput = true;
    }
    process.stderr.write(data);
  });

  child.on('error', (error) => {
    spinner.fail(chalk.red('Oops! Search spell fizzled...'));
    console.error('Failed to execute:', error);
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (!hasOutput) {
      spinner.info(chalk.yellow('No matches found!'));
    }
    process.exit(code || 0);
  });
}

export function previewMatches(engine: Engine, regex: string, args: string[], limit: number = 3): string[] {
  const { path: enginePath } = resolveEngine();
  
  const previewArgs = ['-E', regex, ...args];
  
  try {
    const result = spawnSync(enginePath, previewArgs, {
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024,
      timeout: 5000,
    });

    if (result.error) {
      return [];
    }

    const lines = result.stdout.split('\n').filter(line => line.trim());
    return lines.slice(0, limit);
  } catch {
    return [];
  }
}
