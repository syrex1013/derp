import fs from 'fs';
import path from 'path';
import os from 'os';

export interface DerpConfig {
  provider: 'ollama' | 'lmstudio' | 'openai' | 'bedrock' | 'openrouter';
  model?: string;
  ollamaHost?: string;
  lmstudioUrl?: string;
  openaiApiKey?: string;
  bedrockUrl?: string;
  openrouterApiKey?: string;
}

const CONFIG_PATH = path.join(os.homedir(), '.derp.json');

export function loadConfig(): DerpConfig {
  const defaults: DerpConfig = {
    provider: 'ollama',
    model: 'qwen2.5:1.5b',  // Fast, small model optimized for structured output
    ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434',
    lmstudioUrl: process.env.LMSTUDIO_URL || 'http://localhost:1234',
    openaiApiKey: process.env.OPENAI_API_KEY,
    bedrockUrl: process.env.BEDROCK_URL,
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
  };

  if (!fs.existsSync(CONFIG_PATH)) {
    return defaults;
  }

  try {
    const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(data);
    return { ...defaults, ...config };
  } catch (error) {
    console.error('Failed to load config:', error);
    return defaults;
  }
}

export function saveConfig(config: DerpConfig): void {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    console.log(`✅ Configuration saved to ${CONFIG_PATH}`);
  } catch (error) {
    console.error('Failed to save config:', error);
    throw error;
  }
}
