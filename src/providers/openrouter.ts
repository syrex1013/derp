import axios from 'axios';
import { Provider, CompletionResult } from './base.js';

export class OpenRouterProvider implements Provider {
  constructor(private apiKey: string, private model: string = 'anthropic/claude-3-sonnet') {}

  async complete(systemPrompt: string, userPrompt: string): Promise<CompletionResult> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured. Set OPENROUTER_API_KEY environment variable.');
    }

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1,
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://github.com/yourusername/grepagent',
            'X-Title': 'GrepAgent',
          },
          timeout: 30000,
        }
      );

      const content = response.data.choices?.[0]?.message?.content || '';
      const regex = this.extractRegex(content);
      
      return { regex, explanation: content };
    } catch (error: any) {
      throw new Error(`OpenRouter API error: ${error.message}`);
    }
  }

  private extractRegex(content: string): string {
    const lines = content.trim().split('\n');
    const cleaned = lines[0].replace(/^["'`]|["'`]$/g, '').trim();
    return cleaned;
  }
}
