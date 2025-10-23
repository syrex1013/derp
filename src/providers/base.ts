export interface CompletionResult {
  regex: string;
  explanation?: string;
}

export interface Provider {
  complete(systemPrompt: string, userPrompt: string): Promise<CompletionResult>;
}
