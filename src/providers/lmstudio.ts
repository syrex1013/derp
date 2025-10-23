import axios from 'axios';
import { Provider, CompletionResult } from './base.js';

export class LMStudioProvider implements Provider {
  constructor(private url: string, private model: string = 'local-model') {}

  async complete(systemPrompt: string, userPrompt: string): Promise<CompletionResult> {
    try {
      const response = await axios.post(
        `${this.url}/v1/chat/completions`,
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
            'Authorization': 'Bearer dummy-token',
          },
          timeout: 30000,
        }
      );

      const content = response.data.choices?.[0]?.message?.content || '';
      const regex = this.extractRegex(content);
      
      return { regex, explanation: content };
    } catch (error: any) {
      throw new Error(`LM Studio API error: ${error.message}`);
    }
  }

  private extractRegex(content: string): string {
    const lines = content.trim().split('\n');
    const cleaned = lines[0].replace(/^["'`]|["'`]$/g, '').trim();
    return cleaned;
  }
}
