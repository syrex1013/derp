import axios from 'axios';
import { Provider, CompletionResult } from './base.js';

export class OllamaProvider implements Provider {
  constructor(
    private host: string,
    private model: string
  ) {}

  async complete(systemPrompt: string, userPrompt: string): Promise<CompletionResult> {
    try {
      const response = await axios.post(`${this.host}/api/chat`, {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        options: {
          temperature: 0.1,
        }
      }, {
        timeout: 30000,
      });

      const content = response.data.message?.content || '';
      const regex = this.extractRegex(content);
      
      return { regex, explanation: content };
    } catch (error: any) {
      throw new Error(`Ollama API error: ${error.message}`);
    }
  }

  private extractRegex(content: string): string {
    const lines = content.trim().split('\n');
    const cleaned = lines[0].replace(/^["'`]|["'`]$/g, '').trim();
    return cleaned;
  }
}
