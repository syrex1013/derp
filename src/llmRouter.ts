import { GrepAgentConfig } from './config.js';
import { regexPrompt } from './prompts.js';
import { OllamaProvider } from './providers/ollama.js';
import { LMStudioProvider } from './providers/lmstudio.js';
import { OpenAIProvider } from './providers/openai.js';
import { BedrockProvider } from './providers/bedrock.js';
import { OpenRouterProvider } from './providers/openrouter.js';
import { Provider, CompletionResult } from './providers/base.js';

export async function naturalQueryToRegex(
  intent: string,
  config: GrepAgentConfig
): Promise<CompletionResult> {
  const { system, user } = regexPrompt(intent);
  
  let provider: Provider;

  switch (config.provider) {
    case 'ollama':
      provider = new OllamaProvider(
        config.ollamaHost || 'http://localhost:11434',
        config.model || 'llama3.2'
      );
      break;

    case 'lmstudio':
      provider = new LMStudioProvider(
        config.lmstudioUrl || 'http://localhost:1234',
        config.model || 'local-model'
      );
      break;

    case 'openai':
      provider = new OpenAIProvider(
        config.openaiApiKey || process.env.OPENAI_API_KEY || '',
        config.model || 'gpt-4'
      );
      break;

    case 'bedrock':
      provider = new BedrockProvider(
        config.bedrockUrl || process.env.BEDROCK_URL || '',
        config.model || 'anthropic.claude-v2'
      );
      break;

    case 'openrouter':
      provider = new OpenRouterProvider(
        config.openrouterApiKey || process.env.OPENROUTER_API_KEY || '',
        config.model || 'anthropic/claude-3-sonnet'
      );
      break;

    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }

  try {
    return await provider.complete(system, user);
  } catch (error: any) {
    throw new Error(`LLM request failed: ${error.message}`);
  }
}
