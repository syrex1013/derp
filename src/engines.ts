import { spawn, spawnSync } from 'child_process';
import { which, quote } from './utils.js';

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
  
  const finalArgs = ['-E', regex, ...args];
  const command = `${engine} ${finalArgs.map(quote).join(' ')}`;

  if (dryRun) {
    console.log(`\n🔍 Would execute: ${command}\n`);
    return;
  }

  console.log(`\n🚀 Executing: ${command}\n`);

  const child = spawn(enginePath, finalArgs, {
    stdio: 'inherit',
    shell: false,
  });

  child.on('error', (error) => {
    console.error('Failed to execute:', error);
    process.exit(1);
  });

  child.on('exit', (code) => {
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
