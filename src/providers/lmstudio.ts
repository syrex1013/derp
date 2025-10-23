import axios from 'axios';
import { Provider, CompletionResult, parseCompletionResult } from './base.js';

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
          max_tokens: 512,
          response_format: { type: 'json_object' }
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
      return parseCompletionResult(content);
    } catch (error: any) {
      throw new Error(`LM Studio API error: ${error.message}`);
    }
  }
}
