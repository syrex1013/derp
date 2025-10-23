import axios from 'axios';
import { Provider, CompletionResult, parseCompletionResult } from './base.js';

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
          num_predict: 512,  // Limit response length for speed
        },
        format: 'json'  // Request JSON format from Ollama
      }, {
        timeout: 30000,
      });

      const content = response.data.message?.content || '';
      return parseCompletionResult(content);
    } catch (error: any) {
      throw new Error(`Ollama API error: ${error.message}`);
    }
  }
}
