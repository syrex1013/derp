import axios from 'axios';
import { Provider, CompletionResult } from './base.js';

export class BedrockProvider implements Provider {
  constructor(private url: string, private model: string = 'anthropic.claude-v2') {}

  async complete(systemPrompt: string, userPrompt: string): Promise<CompletionResult> {
    if (!this.url) {
      throw new Error('Bedrock URL not configured. Set BEDROCK_URL environment variable.');
    }

    try {
      const response = await axios.post(
        this.url,
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
          },
          timeout: 30000,
        }
      );

      const content = response.data.choices?.[0]?.message?.content || 
                     response.data.content?.[0]?.text || '';
      const regex = this.extractRegex(content);
      
      return { regex, explanation: content };
    } catch (error: any) {
      throw new Error(`Bedrock API error: ${error.message}`);
    }
  }

  private extractRegex(content: string): string {
    const lines = content.trim().split('\n');
    const cleaned = lines[0].replace(/^["'`]|["'`]$/g, '').trim();
    return cleaned;
  }
}
