#!/usr/bin/env node

import chalk from 'chalk';
import ora from 'ora';
import { loadConfig, saveConfig, GrepAgentConfig } from './config.js';
import { naturalQueryToRegex } from './llmRouter.js';
import { resolveEngine, runEngine, previewMatches, Engine } from './engines.js';
import { isProbablyNaturalLanguage, quote } from './utils.js';

function printBanner(): void {
  console.log(chalk.bold.blue('\n🤖 grepagent') + chalk.dim(' - AI-powered grep\n'));
}

function printHelp(): void {
  printBanner();
  console.log(chalk.bold('USAGE:'));
  console.log('  grepagent <natural-language-query> [grep-options]\n');
  console.log(chalk.bold('OPTIONS:'));
  console.log('  --init              Initialize configuration');
  console.log('  --config            Show current configuration');
  console.log('  --dry-run           Show generated command without executing');
  console.log('  --explain           Show LLM explanation');
  console.log('  --help              Show this help\n');
  console.log(chalk.bold('EXAMPLES:'));
  console.log('  grepagent "emails in files" -r .');
  console.log('  grepagent "TODO comments" src/ --dry-run');
  console.log('  grepagent "IP addresses" logs/*.log --explain\n');
  console.log(chalk.bold('CONFIGURATION:'));
  console.log('  Run `grepagent --init` to configure your LLM provider.\n');
}

async function initConfig(): Promise<void> {
  printBanner();
  console.log(chalk.bold('Configuration Setup\n'));

  // @ts-ignore
  const inquirer = (await import('inquirer')).default;

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Select LLM provider:',
      choices: ['ollama', 'lmstudio', 'openai', 'bedrock', 'openrouter'],
      default: 'ollama',
    },
    {
      type: 'input',
      name: 'model',
      message: 'Model name:',
      default: 'llama3.2',
    },
    {
      type: 'input',
      name: 'ollamaHost',
      message: 'Ollama host:',
      default: 'http://localhost:11434',
      when: (ans: any) => ans.provider === 'ollama',
    },
    {
      type: 'input',
      name: 'lmstudioUrl',
      message: 'LM Studio URL:',
      default: 'http://localhost:1234',
      when: (ans: any) => ans.provider === 'lmstudio',
    },
    {
      type: 'password',
      name: 'openaiApiKey',
      message: 'OpenAI API Key:',
      when: (ans: any) => ans.provider === 'openai',
    },
    {
      type: 'input',
      name: 'bedrockUrl',
      message: 'Bedrock URL:',
      when: (ans: any) => ans.provider === 'bedrock',
    },
    {
      type: 'password',
      name: 'openrouterApiKey',
      message: 'OpenRouter API Key:',
      when: (ans: any) => ans.provider === 'openrouter',
    },
  ]);

  saveConfig(answers as GrepAgentConfig);
}

function showConfig(): void {
  printBanner();
  const config = loadConfig();
  console.log(chalk.bold('Current Configuration:\n'));
  console.log(JSON.stringify(config, null, 2));
  console.log();
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--init')) {
    await initConfig();
    process.exit(0);
  }

  if (args.includes('--config')) {
    showConfig();
    process.exit(0);
  }

  const dryRun = args.includes('--dry-run');
  const explain = args.includes('--explain');

  const filteredArgs = args.filter(
    (arg) => !['--dry-run', '--explain'].includes(arg)
  );

  if (filteredArgs.length === 0) {
    console.error(chalk.red('Error: No query provided\n'));
    printHelp();
    process.exit(1);
  }

  const query = filteredArgs[0];
  const grepArgs = filteredArgs.slice(1);

  if (!isProbablyNaturalLanguage(query)) {
    console.log(chalk.yellow('⚠️  Query doesn\'t look like natural language. Using as-is as regex.\n'));
    const { engine } = resolveEngine();
    runEngine(engine, query, grepArgs, dryRun);
    return;
  }

  printBanner();

  const config = loadConfig();
  const spinner = ora('Generating regex with AI...').start();

  try {
    const result = await naturalQueryToRegex(query, config);
    spinner.succeed('Regex generated');

    console.log(chalk.cyan('\n📋 Regex: ') + chalk.bold(result.regex));

    if (explain && result.explanation) {
      console.log(chalk.gray('\n💡 Explanation:'));
      console.log(chalk.gray(result.explanation));
    }

    const { engine } = resolveEngine();

    if (!dryRun && grepArgs.length > 0) {
      const preview = previewMatches(engine, result.regex, grepArgs, 3);
      if (preview.length > 0) {
        console.log(chalk.gray('\n🔍 Preview (first 3 matches):'));
        preview.forEach((line) => console.log(chalk.gray('  ' + line)));
      }
    }

    const cmdArgs = ['-E', result.regex, ...grepArgs].map(quote).join(' ');
    console.log(chalk.magenta(`\n🚀 Command: ${engine} ${cmdArgs}\n`));

    if (!dryRun) {
      runEngine(engine, result.regex, grepArgs, false);
    }
  } catch (error: any) {
    spinner.fail('Failed to generate regex');
    console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});
