#!/usr/bin/env node

import chalk from 'chalk';
import ora from 'ora';
import { loadConfig, saveConfig, DerpConfig } from './config.js';
import { naturalQueryToRegex } from './llmRouter.js';
import { resolveEngine, runEngine, previewMatches, Engine } from './engines.js';
import { isProbablyNaturalLanguage, quote } from './utils.js';

const derpMessages = [
  'Consulting the regex gods for you, you derp...',
  'Converting your words to nerd hieroglyphics...',
  'Asking AI because you forgot regex again...',
  'Translating from human to regex-speak...',
  'Generating the pattern you should\'ve memorized...',
  'Doing the regex homework you avoided...',
  'Saving you from Googling "regex for..."...',
  'Making up for your regex education gaps...',
];

function printBanner(): void {
  console.log(chalk.bold.blue('\n🤖 derp') + chalk.dim(' - Natural language grep for regex-challenged developers\n'));
}

function printHelp(): void {
  printBanner();
  console.log(chalk.bold('USAGE:'));
  console.log('  derp <natural-language-query> [grep-options]\n');
  console.log(chalk.bold('OPTIONS:'));
  console.log('  --init              Initialize configuration');
  console.log('  --config            Show current configuration');
  console.log('  --dry-run           Show generated command without executing');
  console.log('  --explain           Show LLM explanation');
  console.log('  --help              Show this help\n');
  console.log(chalk.bold('EXAMPLES:'));
  console.log('  derp "emails in files" -r .');
  console.log('  derp "TODO comments" src/ --dry-run');
  console.log('  derp "IP addresses" logs/*.log --explain\n');
  console.log(chalk.bold('CONFIGURATION:'));
  console.log('  Run `derp --init` to configure your LLM provider.\n');
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
      default: 'qwen2.5:1.5b',
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

  saveConfig(answers as DerpConfig);
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
  const userProvidedArgs = filteredArgs.slice(1);

  if (!isProbablyNaturalLanguage(query)) {
    console.log(chalk.yellow('⚠️  Query doesn\'t look like natural language. Using as-is as regex.\n'));
    const { engine } = resolveEngine();
    runEngine(engine, query, userProvidedArgs, dryRun);
    return;
  }

  const config = loadConfig();
  const randomMessage = derpMessages[Math.floor(Math.random() * derpMessages.length)];
  const spinner = ora(randomMessage).start();

  try {
    const result = await naturalQueryToRegex(query, config);
    spinner.stop();
    process.stdout.write('\r\x1b[K'); // Clear the spinner line

    const { engine } = resolveEngine();

    // Merge LLM-generated args with user-provided args (user args take precedence)
    const finalArgs = [...result.args, ...userProvidedArgs];

    if (dryRun) {
      const cmdArgs = ['-E', result.regex, ...finalArgs].map(quote).join(' ');
      console.log(`${engine} ${cmdArgs}`);
      if (result.explanation && explain) {
        console.log(chalk.gray('\nExplanation: ') + result.explanation);
      }
    } else if (explain) {
      console.log(chalk.cyan('Regex: ') + result.regex);
      console.log(chalk.cyan('Args: ') + finalArgs.join(' '));
      if (result.explanation) {
        console.log(chalk.gray('Explanation: ') + result.explanation);
      }
      console.log(); // blank line before results
      runEngine(engine, result.regex, finalArgs, false);
    } else {
      runEngine(engine, result.regex, finalArgs, false);
    }
  } catch (error: any) {
    spinner.stop();
    process.stdout.write('\r\x1b[K'); // Clear the spinner line
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});
