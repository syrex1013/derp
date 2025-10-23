import axios from 'axios';
import { Provider, CompletionResult, parseCompletionResult } from './base.js';

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
          max_tokens: 512,
          response_format: { type: 'json_object' }
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
      return parseCompletionResult(content);
    } catch (error: any) {
      throw new Error(`Bedrock API error: ${error.message}`);
    }
  }
}
