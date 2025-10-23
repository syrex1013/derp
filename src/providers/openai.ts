import axios from 'axios';
import { Provider, CompletionResult } from './base.js';

export class OpenAIProvider implements Provider {
  constructor(private apiKey: string, private model: string = 'gpt-4') {}

  async complete(systemPrompt: string, userPrompt: string): Promise<CompletionResult> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY environment variable.');
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
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
          },
          timeout: 30000,
        }
      );

      const content = response.data.choices?.[0]?.message?.content || '';
      const regex = this.extractRegex(content);
      
      return { regex, explanation: content };
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  private extractRegex(content: string): string {
    const lines = content.trim().split('\n');
    const cleaned = lines[0].replace(/^["'`]|["'`]$/g, '').trim();
    return cleaned;
  }
}
