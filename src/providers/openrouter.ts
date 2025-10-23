import axios from 'axios';
import { Provider, CompletionResult, parseCompletionResult } from './base.js';

export class OpenRouterProvider implements Provider {
  constructor(private apiKey: string, private model: string = 'anthropic/claude-3-haiku') {}

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
          max_tokens: 512,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://github.com/yourusername/derp',
            'X-Title': 'GrepAgent',
          },
          timeout: 30000,
        }
      );

      const content = response.data.choices?.[0]?.message?.content || '';
      return parseCompletionResult(content);
    } catch (error: any) {
      throw new Error(`OpenRouter API error: ${error.message}`);
    }
  }
}
